'use strict';

// Cursor dot
(function() {
  const dot = document.getElementById('cursorDot');
  if (!dot || window.matchMedia('(pointer: coarse)').matches) { if (dot) dot.style.display='none'; return; }
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function loop(){ cx+=(mx-cx)*0.18; cy+=(my-cy)*0.18; dot.style.left=cx+'px'; dot.style.top=cy+'px'; requestAnimationFrame(loop); })();
  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => dot.style.transform='translate(-50%,-50%) scale(2.5)');
    el.addEventListener('mouseleave', () => dot.style.transform='translate(-50%,-50%) scale(1)');
  });
})();

// Nav
(function() {
  const nav=document.getElementById('nav');
  const toggle=document.getElementById('navToggle');
  const links=document.getElementById('navLinks');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY>30));
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  const sections=document.querySelectorAll('section[id],header[id]');
  const navAs=links.querySelectorAll('a');
  new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href')==='#'+e.target.id)); });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe ? sections.forEach(s => new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href')==='#'+e.target.id)); });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s)) : null;
})();

// Scroll reveal
new IntersectionObserver((entries, io) => {
  entries.forEach((e,i) => { if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('is-visible'),i*80); io.unobserve(e.target); } });
}, { threshold: 0.12 }).observe ? document.querySelectorAll('[data-aos]').forEach(el =>
  new IntersectionObserver((entries, io) => {
    entries.forEach((e,i) => { if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('is-visible'),i*80); io.unobserve(e.target); } });
  }, { threshold: 0.12 }).observe(el)
) : null;

// Count-up
document.querySelectorAll('.stat-num[data-count]').forEach(el => {
  new IntersectionObserver((entries, io) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const end=parseInt(el.dataset.count,10), dur=1800, start=performance.now();
      (function tick(now){ const p=Math.min((now-start)/dur,1), e=1-Math.pow(1-p,4); el.textContent=Math.round(e*end).toLocaleString(); if(p<1)requestAnimationFrame(tick); })(start);
      io.unobserve(el);
    });
  }, { threshold: 0.5 }).observe(el);
});

// Skill bars
document.querySelectorAll('.skill-fill[data-width]').forEach(el => {
  new IntersectionObserver((entries, io) => {
    entries.forEach(e => { if(e.isIntersecting){ setTimeout(()=>el.style.width=el.dataset.width+'%',100); io.unobserve(el); } });
  }, { threshold: 0.3 }).observe(el);
});

// Hero canvas — particle network
(function() {
  const canvas=document.getElementById('heroCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let W,H,particles;
  function resize(){ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; }
  function rand(a,b){ return a+Math.random()*(b-a); }
  function init(){ particles=Array.from({length:90},()=>({ x:rand(0,W),y:rand(0,H),vx:rand(-0.18,0.18),vy:rand(-0.18,0.18),r:rand(1,3),alpha:rand(0.2,0.8),color:Math.random()>0.55?[78,255,176]:[108,140,255] })); }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++){
      const p=particles[i],q=particles[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<100){ ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.strokeStyle=`rgba(78,255,176,${(1-d/100)*0.12})`; ctx.lineWidth=0.5; ctx.stroke(); }
    }
    particles.forEach(p=>{
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(${p.color.join(',')},${p.alpha})`; ctx.fill();
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<-10)p.x=W+10; if(p.x>W+10)p.x=-10; if(p.y<-10)p.y=H+10; if(p.y>H+10)p.y=-10;
    });
    requestAnimationFrame(draw);
  }
  resize(); init(); draw();
  window.addEventListener('resize',()=>{ resize(); init(); });
})();

// Yield canvas — IDW heatmap
(function() {
  const canvas=document.getElementById('yieldCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height;
  const seeds=[{x:0.15,y:0.2,v:0.92},{x:0.55,y:0.12,v:0.88},{x:0.85,y:0.25,v:0.72},{x:0.25,y:0.55,v:0.58},{x:0.6,y:0.5,v:0.95},{x:0.9,y:0.65,v:0.65},{x:0.15,y:0.82,v:0.48},{x:0.5,y:0.85,v:0.82},{x:0.75,y:0.88,v:0.78},{x:0.35,y:0.35,v:0.69}];
  function idw(px,py){ let sw=0,swv=0; seeds.forEach(s=>{ const d2=(px-s.x)**2+(py-s.y)**2; if(d2<0.0001){sw+=1e10;swv+=1e10*s.v;return;} const w=1/d2**1.25; sw+=w; swv+=w*s.v; }); return swv/sw; }
  function col(v){ return v<0.5 ? [Math.round(220-(v/0.5)*80),Math.round(60+(v/0.5)*140),Math.round(40+(v/0.5)*20)] : [Math.round(140-((v-0.5)/0.5)*80),Math.round(200+((v-0.5)/0.5)*55),Math.round(60+((v-0.5)/0.5)*60)]; }
  const img=ctx.createImageData(W,H), bs=4;
  for(let py=0;py<H;py+=bs) for(let px=0;px<W;px+=bs){ const [r,g,b]=col(idw(px/W,py/H)); for(let dy=0;dy<bs&&py+dy<H;dy++) for(let dx=0;dx<bs&&px+dx<W;dx++){ const i=((py+dy)*W+(px+dx))*4; img.data[i]=r; img.data[i+1]=g; img.data[i+2]=b; img.data[i+3]=220; } }
  ctx.putImageData(img,0,0);
  ctx.beginPath(); ctx.roundRect(12,12,W-24,H-24,6); ctx.strokeStyle='rgba(78,255,176,0.5)'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.12)'; ctx.lineWidth=1;
  for(let i=0;i<4;i++){ const yo=60+i*50; ctx.beginPath(); ctx.moveTo(20,yo+Math.sin(i*1.2)*18); ctx.bezierCurveTo(W*0.3,yo+Math.sin(i*0.7+1)*24,W*0.65,yo+Math.cos(i*0.9)*22,W-20,yo+Math.sin(i*1.4+2)*18); ctx.stroke(); }
  seeds.forEach(s=>{ ctx.beginPath(); ctx.arc(s.x*W,s.y*H,4,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fill(); ctx.beginPath(); ctx.arc(s.x*W,s.y*H,2,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fill(); });
  const lgX=W-22,lgY=H-80,lgH=70,grad=ctx.createLinearGradient(0,lgY,0,lgY+lgH);
  grad.addColorStop(0,'#4fffb0'); grad.addColorStop(0.5,'#ffe066'); grad.addColorStop(1,'#ff5a3c');
  ctx.fillStyle=grad; ctx.fillRect(lgX,lgY,10,lgH);
  ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.font='9px IBM Plex Mono,monospace'; ctx.textAlign='right';
  ctx.fillText('High',lgX-3,lgY+8); ctx.fillText('Low',lgX-3,lgY+lgH);
})();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();