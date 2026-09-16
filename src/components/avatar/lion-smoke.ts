// Fire-lit smoke shaded inside the density carried by the existing lion trajectories.
export function createLionSmoke(){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=320;
 const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,preserveDrawingBuffer:true});
 if(!gl)return null;
 const vertex='attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}';
 const fragment=`
 precision mediump float;
 uniform float time,light,violet,strength;
 uniform vec2 pointer;
 uniform sampler2D densityMap;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
 float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03+3.7;a*=.5;}return v;}
 void main(){
   vec2 uv=gl_FragCoord.xy/320.;uv.y=1.-uv.y;
   vec2 p=(uv-.5)*2.;float radius=length(p);
   vec2 q=p*3.;
   // Local vortices stretch the density into smoke-like folds, without a circular wipe.
   for(int j=0;j<3;j++){
    float f=float(j);
    vec2 centre=vec2(sin(time*.19+f*2.1),cos(time*.16+f*2.7))*.95;
    vec2 d=q-centre;
    float spin=exp(-dot(d,d)*.42)*(1.5+sin(time*.22+f)*.5);
    q=centre+mat2(cos(spin),-sin(spin),sin(spin),cos(spin))*d;
   }
   q+=pointer*.22*exp(-radius*radius*3.);
   vec2 warp=vec2(fbm(q+vec2(time*.09,0)),fbm(q+vec2(4.3,-time*.08)));
   float n=fbm(q+warp*3.8+vec2(0,time*.11));
   float veins=pow(.5+.5*sin(n*18.+radius*6.-time*.22),2.);
   float body=texture2D(densityMap,uv).a;
   float mist=(texture2D(densityMap,uv+vec2(.007,0)).a+texture2D(densityMap,uv-vec2(.007,0)).a+texture2D(densityMap,uv+vec2(0,.007)).a+texture2D(densityMap,uv-vec2(0,.007)).a)*.25;
   float density=mix(body,mist,.32);
   float hue=.5+.5*sin(uv.x*8.-uv.y*6.+time*.48+sin(uv.y*10.5+time*.23)*1.6+violet*1.4);
   vec3 violetFire=vec3(.57,.35,.76),amberFire=vec3(1.,.65,.22),paleFire=vec3(.73,.85,.60);
   vec3 fire=hue<.5?mix(violetFire,amberFire,hue*2.):mix(amberFire,paleFire,(hue-.5)*2.);
   // Every hue sits beneath the same charcoal veil, including the hottest folds.
   float luminance=dot(fire,vec3(.2126,.7152,.0722));
   fire=mix(vec3(luminance),fire,.72)*.72;
   float heat=smoothstep(.12,.75,n*.7+veins*.3);
   vec3 charcoal=vec3(.035,.037,.044);
   vec3 colour=mix(charcoal,fire,heat*mix(.94,.74,light));
   colour+=fire*pow(heat,4.)*.16;
   float opacity=density*(.70+n*.28);
   gl_FragColor=vec4(colour,opacity*strength);
 }`;
 const compile=(type:number,source:string)=>{const shader=gl.createShader(type);if(!shader)return null;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}return shader;};
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);
 if(!vs||!fs){if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);return null;}
 const program=gl.createProgram();if(!program)return null;
 gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;
 gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
 const uniforms=Object.fromEntries(['time','light','violet','strength','pointer'].map(n=>[n,gl.getUniformLocation(program,n)]));
 const texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 gl.uniform1i(gl.getUniformLocation(program,'densityMap'),0);
 return {canvas,draw(t:number,light:boolean,violet:number,strength:number,x:number,y:number,density:HTMLCanvasElement){
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,density);
  gl.uniform1f(uniforms.time,t*.6);gl.uniform1f(uniforms.light,light?1:0);gl.uniform1f(uniforms.violet,violet);gl.uniform1f(uniforms.strength,strength);gl.uniform2f(uniforms.pointer,x,y);gl.drawArrays(gl.TRIANGLES,0,6);
 },dispose(){gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);gl.getExtension('WEBGL_lose_context')?.loseContext();}};
}
