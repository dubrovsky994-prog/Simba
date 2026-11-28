export const CYCLE_SECONDS=15;
export const TAU=Math.PI*2;
export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
// Zero velocity and acceleration at every transition boundary.
export const ease=(n:number)=>{n=clamp(n);return clamp(n*n*n*(n*(n*6-15)+10));};
export const angleUnit=(angle:number)=>((angle+Math.PI/2+TAU)%TAU)/TAU;
export function cyclePhase(seconds:number){
  const t=((seconds%CYCLE_SECONDS)+CYCLE_SECONDS)%CYCLE_SECONDS;
  return {t,name:t<2.2||t>=13.8?'formed':t<6.8?'dissolving':t<8.6?'eyes-only':'reforming',
    eyePulse:t>=6.8&&t<8.6?Math.sin((t-6.8)/1.8*Math.PI)**2:0,
    eyePresence:ease((t-5.4)/1.4)*(1-ease((t-8.6)/1.6))};
}
export function grainMotion(seconds:number,angle:number,radius=100){
  // Spatial variation has no angular ordering: the whole silhouette loosens in soft patches.
  const x=Math.cos(angle)*radius,y=Math.sin(angle)*radius;
  const order=.5+.25*Math.sin(x*.031+y*.019)+.25*Math.sin(y*.043-x*.012);
  const {t}=cyclePhase(seconds);
  if(t<2.2)return{integrity:1,radial:0,turn:0,sand:0};
  if(t<6.8){const d=ease((t-2.2-order*.65)/3.95);return{integrity:1-ease(d*1.25),radial:d,turn:Math.PI*d*d,sand:Math.sin(Math.PI*d)**2};}
  if(t<8.6)return{integrity:0,radial:1,turn:Math.PI,sand:0};
  if(t<13.8){const a=ease((t-8.6-(1-order)*.7)/4.5);return{integrity:ease((a-.2)/.8),radial:1-a,turn:Math.PI+Math.PI*(1-(1-a)**2),sand:Math.sin(Math.PI*a)**2};}
  return{integrity:1,radial:0,turn:TAU,sand:0};
}
