export type SkyArt = { id:string; name:string; native:string; file:string; size:[number,number]; anchors:{pos:[number,number];ra:number;dec:number}[] };
const rad=Math.PI/180;
/** Original texture projected through its three catalogue-star anchors. */
export function drawSkyArt(ctx:CanvasRenderingContext2D, art:SkyArt, image:HTMLImageElement, screen:(ra:number,dec:number)=>{x:number;y:number;visible:boolean}, opacity:number) {
  const [a,b,c]=art.anchors;
  const det=(b.pos[1]-c.pos[1])*(a.pos[0]-c.pos[0])+(c.pos[0]-b.pos[0])*(a.pos[1]-c.pos[1]);
  if(Math.abs(det)<1e-8)return;
  const vectors=art.anchors.map(p=>[Math.cos(p.dec*rad)*Math.cos(p.ra*15*rad),Math.cos(p.dec*rad)*Math.sin(p.ra*15*rad),Math.sin(p.dec*rad)]);
  const project=(x:number,y:number)=>{
    const u=((b.pos[1]-c.pos[1])*(x-c.pos[0])+(c.pos[0]-b.pos[0])*(y-c.pos[1]))/det;
    const v=((c.pos[1]-a.pos[1])*(x-c.pos[0])+(a.pos[0]-c.pos[0])*(y-c.pos[1]))/det;
    const p=vectors[0].map((n,i)=>u*n+v*vectors[1][i]+(1-u-v)*vectors[2][i]);
    return screen((Math.atan2(p[1],p[0])/rad+360)%360/15,Math.atan2(p[2],Math.hypot(p[0],p[1]))/rad);
  };
  const steps=16, [w,h]=art.size;
  ctx.save();ctx.globalAlpha=opacity;
  for(let j=0;j<steps;j++)for(let i=0;i<steps;i++){
    const x=i*w/steps,y=j*h/steps,dx=w/steps,dy=h/steps;
    const corners=[[x,y],[x+dx,y],[x,y+dy],[x+dx,y+dy]];
    const dest=corners.map(p=>project(p[0],p[1]));
    for(const ids of [[0,1,2],[1,3,2]]){
      const [p,q,r]=ids.map(k=>dest[k]);
      if(!p.visible||!q.visible||!r.visible||Math.max(Math.hypot(p.x-q.x,p.y-q.y),Math.hypot(p.x-r.x,p.y-r.y))>ctx.canvas.clientWidth/2)continue;
      const [s,t,u]=ids.map(k=>corners[k]);
      const d=(t[0]-s[0])*(u[1]-s[1])-(u[0]-s[0])*(t[1]-s[1]);
      const aa=((q.x-p.x)*(u[1]-s[1])-(r.x-p.x)*(t[1]-s[1]))/d;
      const cc=((r.x-p.x)*(t[0]-s[0])-(q.x-p.x)*(u[0]-s[0]))/d;
      const bb=((q.y-p.y)*(u[1]-s[1])-(r.y-p.y)*(t[1]-s[1]))/d;
      const dd=((r.y-p.y)*(t[0]-s[0])-(q.y-p.y)*(u[0]-s[0]))/d;
      ctx.save();ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineTo(r.x,r.y);ctx.closePath();ctx.clip();
      ctx.transform(aa,bb,cc,dd,p.x-aa*s[0]-cc*s[1],p.y-bb*s[0]-dd*s[1]);
      ctx.drawImage(image,0,0,w,h);ctx.restore();
    }
  }
  ctx.restore();
}
