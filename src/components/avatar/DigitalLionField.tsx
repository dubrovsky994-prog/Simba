'use client';
import {useEffect,useRef,useState} from 'react';
import type {AvatarState} from './SimbaAIAvatar';
import {TAU,cyclePhase,grainMotion} from './avatar-motion';

type Grain={angle:number;radius:number;light:number;seed:number;homeX:number;homeY:number};
type Props={assetSrc:string;state:AvatarState;tone:'cyan'|'violet'|'error';paused:boolean;dispersion:number;surface:'dark'|'light'};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const random=(n:number)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};

export function DigitalLionField(input:Props){
 const ref=useRef<HTMLCanvasElement>(null),props=useRef(input);
 props.current=input;
 const wake=useRef<()=>void>(()=>{});
 const [failed,setFailed]=useState(false);
 const {assetSrc,state,tone,paused,dispersion,surface}=input;
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas?.getContext('2d',{alpha:true});
  if(!canvas||!ctx){setFailed(true);return;}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const img=new Image();img.crossOrigin='anonymous';
  let disposed=false,ready=false,raf=0,last=0,elapsed=0,frames=0,width=420,stride=1;
  let violet=props.current.tone==='violet'?1:0,warm=0,px=0,py=0,tx=0,ty=0;
  const grains:Grain[]=[];
  const host=canvas.parentElement;
  const pointer=(event:PointerEvent)=>{
   const r=canvas.getBoundingClientRect();tx=(event.clientX-r.left)/r.width*2-1;ty=(event.clientY-r.top)/r.height*2-1;
  };
  const leave=()=>{tx=ty=0;};
  host?.addEventListener('pointermove',pointer);host?.addEventListener('pointerleave',leave);
  const resize=()=>{
   width=Math.max(1,canvas.getBoundingClientRect().width);stride=width<180?4:width<520?3:1;
   const edge=Math.round(width*Math.min(devicePixelRatio||1,2));
   if(canvas.width!==edge)canvas.width=canvas.height=edge;
   wake.current();
  };
  const draw=(dt:number)=>{
   const p=props.current,follow=p.paused||reduced.matches?1:1-Math.exp(-dt/.75);
   violet=mix(violet,p.tone==='violet'?1:0,follow);warm=mix(warm,p.tone==='error'?1:0,follow);
   px=mix(px,tx,follow);py=mix(py,ty,follow);
   const t=reduced.matches?0:elapsed,phase=cyclePhase(t),light=p.surface==='light';
   const s=canvas.width/500;
   ctx.setTransform(s,0,0,s,0,0);ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,500,500);
   ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
   const base=light?[7,42,53]:[169,205,214],cyan=light?[0,139,158]:[98,220,232],violetRgb=light?[105,65,151]:[177,135,247],error=light?[151,79,69]:[207,119,86];
   const particle=(index:number)=>{
    const a=index/24;
    const c=base.map((v,k)=>Math.round(mix(v,cyan[k],.62+Math.sin(a+k)*.12)));
    const accent=.15+.27*(.5+.5*Math.sin(a*.83+.7));
    const v=c.map((n,k)=>Math.round(mix(n,violetRgb[k],accent+violet*.44+warm*.16))).map((n,k)=>Math.round(mix(n,error[k],accent*.42+warm*.54))).join(',');
    return v;
   };
   const rainbow=(h:number,dim:number)=>{
    const rgb=(n:number)=>Math.round((.5+.5*Math.cos((n+h)*TAU))*255*dim);
    return [rgb(0),rgb(1/3),rgb(2/3)].join(',');
   };
   const eyeColour=violet>.45?violetRgb.join(','):cyan.join(',');
   const rgba=(colour:string,a:number)=>'rgba('+colour+','+a+')';
   const bloom=(x:number,y:number,r:number,colour:string,a:number)=>{
    if(a<=0)return;const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,rgba(colour,a));g.addColorStop(.35,rgba(colour,a*.25));g.addColorStop(1,rgba(colour,0));
    ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
   };
   const field=1-phase.eyePresence;
   // A restrained ambient halo keeps the particle body readable on both site surfaces.
   if(field>0)bloom(250,254,132,light?'0,151,168':'98,220,232',(light?.008:.018)*field);
   let meanIntegrity=0,visible=0;
   if(phase.name!=='eyes-only')for(let i=0;i<grains.length;i+=stride){
    const g=grains[i],motion=grainMotion(t,g.angle,g.radius);
    meanIntegrity+=motion.integrity;visible++;
    const alpha=Math.min(1,motion.integrity+motion.sand*.72);
    if(alpha<.004)continue;
    const localX=g.homeX,localY=g.homeY;
    // Continuous river-like parallax: each depth layer travels forward forever.
    const depth=.55+Math.min(1,g.radius/190)*.7;
    const lane=localY*.032+t*.54*depth+g.seed*TAU;
    const warpX=Math.sin(lane)+.34*Math.sin(lane*2.07+localX*.012);
    const warpY=.45*Math.cos(lane*1.31+localX*.018)+.18*Math.sin(lane*.63-localY*.021);
    const r=g.radius+motion.radial*(16+g.seed*22);
    const a=g.angle+motion.turn;
    const breath=Math.sin(t*1.22+g.radius*.018+g.seed*TAU)*(.7+g.light*.55)*(motion.sand>.001?1:.12);
    const riverX=warpX*(4.5+depth*4.5)*motion.sand,riverY=warpY*(2.1+depth*1.8)*motion.sand;
    const x=250+Math.cos(a)*(r+breath)+riverX+px*3.5*motion.sand;
    const y=250+Math.sin(a)*(r+breath)+riverY+py*3.5*motion.sand;
    const size=Math.max(250/width,.72+g.light*.62+g.seed*.2+motion.sand*.38);
    // Outer mane locks carry a restrained rainbow; each tip gets its own hue.
    const tip=g.radius>108&&g.light>.038;
    const hue=(g.seed*.73+g.homeX*.0017+g.homeY*.0023+t*.018+lane*.035+motion.sand*.28+violet*.06)%1;
    ctx.globalAlpha=alpha*(light?.78+g.light*.22:.65+g.light*.35);
    ctx.fillStyle='rgb('+(tip?rainbow(hue,light?.9:.9):particle(Math.floor((g.seed+g.light)*24)))+')';
    const dot=Math.max(1,Math.ceil(size*.95));
    ctx.fillRect(Math.round(x-dot*.5),Math.round(y-dot*.5),dot,dot);
    if(motion.integrity>.35&&g.seed>.32){
     ctx.globalAlpha*=.18;ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=Math.max(.35,size*.22);
     ctx.beginPath();ctx.moveTo(x-riverX*.75,y-riverY*.75);ctx.lineTo(x-riverX*1.9,y-riverY*1.9);ctx.stroke();
    }
    if(g.seed>.992){
     bloom(x,y,3.5+motion.sand*3,particle(26),alpha*.12);
    }
   }
   ctx.globalAlpha=1;
   const eyeBoost=phase.eyePresence*(.32+.68*phase.eyePulse);
   bloom(221,222,13+eyeBoost*13,eyeColour,.18+eyeBoost*.48);
   bloom(282,222,13+eyeBoost*13,eyeColour,.18+eyeBoost*.48);
   ctx.save();ctx.translate(251,223);ctx.scale(1+eyeBoost*.12,1+eyeBoost*.12);ctx.translate(-251,-223);
   ctx.globalAlpha=.72+eyeBoost*.28;ctx.fillStyle='rgb('+eyeColour+')';ctx.shadowColor=rgba(eyeColour,.9);ctx.shadowBlur=5+eyeBoost*14;
   ctx.beginPath();ctx.moveTo(215.5,218.8);ctx.quadraticCurveTo(222,220,226.5,225);ctx.quadraticCurveTo(218,226,215.5,218.8);
   ctx.moveTo(289.8,218.8);ctx.quadraticCurveTo(283,220,278.7,225);ctx.quadraticCurveTo(287,226,289.8,218.8);ctx.fill();
   ctx.restore();ctx.shadowBlur=0;ctx.globalAlpha=1;
   canvas.dataset.phase=phase.name;canvas.dataset.cycleTime=phase.t.toFixed(3);
   canvas.dataset.bodyOpacity=phase.name==='eyes-only'?'0':(visible?meanIntegrity/visible:0).toFixed(3);
   canvas.dataset.eyeOpacity=(.72+eyeBoost*.28).toFixed(3);
   canvas.dataset.direction='river-flow';canvas.dataset.parallax='continuous';canvas.dataset.cycleSeconds='15';canvas.dataset.material='parallax-flow';
   canvas.dataset.smoke='none';canvas.dataset.smokeOpacity='0';
   canvas.dataset.frame=String(++frames);canvas.dataset.grains=String(Math.ceil(grains.length/stride));
  };
  const frame=(now:number)=>{
   raf=0;if(disposed||!ready)return;
   const dt=last?Math.min((now-last)/1000,.1):1/60;last=now;
   if(!props.current.paused&&!reduced.matches)elapsed+=dt;
   const start=performance.now();draw(dt);
   if(performance.now()-start>24&&frames>30)stride=Math.max(stride,2);
   if(!props.current.paused&&!reduced.matches)raf=requestAnimationFrame(frame);
   else{last=0;canvas.dataset.running='false';}
  };
  wake.current=()=>{
   if(disposed||!ready)return;if(raf)cancelAnimationFrame(raf);
   if(props.current.paused)last=0;
   canvas.dataset.running=String(!props.current.paused&&!reduced.matches);raf=requestAnimationFrame(frame);
  };
  const onReduced=()=>wake.current();reduced.addEventListener('change',onReduced);
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  img.onload=()=>{
   if(disposed)return;
   try{
    const n=220,sample=document.createElement('canvas');sample.width=sample.height=n;
    const sc=sample.getContext('2d',{willReadFrequently:true});if(!sc)throw new Error('Canvas unavailable');
    sc.drawImage(img,0,0,n,n);const data=sc.getImageData(0,0,n,n).data;
    for(let y=0;y<n;y++)for(let x=0;x<n;x++){
     const k=(y*n+x)*4,l=(data[k]+data[k+1]+data[k+2])/765;
     if(data[k+3]<120||l<.038)continue;
     const seed=random(y*n+x),homeX=92+x/n*316,homeY=90+y/n*316;
     grains.push({angle:Math.atan2(homeY-250,homeX-250),radius:Math.hypot(homeX-250,homeY-250),light:l,seed,homeX,homeY});
    }
    ready=true;canvas.dataset.ready='true';resize();
   }catch{setFailed(true);}
  };
  img.onerror=()=>{if(!disposed)setFailed(true);};img.src=assetSrc;
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();reduced.removeEventListener('change',onReduced);host?.removeEventListener('pointermove',pointer);host?.removeEventListener('pointerleave',leave);wake.current=()=>{};};
 },[assetSrc]);
 useEffect(()=>wake.current(),[state,tone,paused,dispersion,surface]);
 return failed?<img className="simba-digital-fallback" src={assetSrc} alt=""/>:<canvas ref={ref} className="simba-digital-canvas" data-layer="DigitalLionField" aria-hidden="true"/>;
}
