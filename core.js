/* =================================================================
   PROOP PITCH SYSTEM — CORE.JS
   Shared utilities: progress bar, nav spy, counters,
   video autoplay, GSAP scroll animations
   ================================================================= */
'use strict';

window.PC = (function(){

  /* ── PROGRESS BAR ── */
  function bar(){
    const el=document.getElementById('pb');if(!el)return;
    window.addEventListener('scroll',()=>{
      const s=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
      el.style.width=(h>0?(s/h)*100:0)+'%';
    },{passive:true});
  }

  /* ── NAV ── */
  function nav(){
    const n=document.querySelector('.nav');if(!n)return;
    const tick=()=>n.classList.toggle('on',window.scrollY>50);
    window.addEventListener('scroll',tick,{passive:true});tick();
  }

  /* ── NAV SPY ── */
  function spy(){
    const links=[...document.querySelectorAll('.nav-links a[href^="#"]')];
    if(!links.length)return;
    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting)
          links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id));
      });
    },{threshold:.35});
    document.querySelectorAll('section[id]').forEach(s=>io.observe(s));
  }

  /* ── COUNTER ── */
  function counter(el){
    if(!window.gsap)return;
    const to=parseFloat(el.dataset.c),dec=parseInt(el.dataset.dec||'0',10);
    const o={n:0};
    gsap.to(o,{n:to,duration:2.2,ease:'power2.out',
      onUpdate(){
        el.textContent=dec?o.n.toFixed(dec):Math.round(o.n).toLocaleString('es-CL');
      },
      onComplete(){el.textContent=dec?to.toFixed(dec):to.toLocaleString('es-CL');}
    });
  }
  function counters(){
    if(!window.gsap||!window.ScrollTrigger)return;
    document.querySelectorAll('[data-c]').forEach(el=>{
      let done=false;
      ScrollTrigger.create({trigger:el,start:'top 90%',
        onEnter(){if(!done){done=true;counter(el);}}});
    });
  }

  /* ── VIDEO AUTOPLAY ── */
  function vids(){
    const vs=document.querySelectorAll('[data-av],.phone__screen video');if(!vs.length)return;
    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{const v=e.target;e.isIntersecting?v.play().catch(function(){}):v.pause();});
    },{threshold:.4});
    vs.forEach(v=>{v.muted=true;v.loop=true;v.playsInline=true;io.observe(v);});
  }

  /* ── VIDEO HOVER ── */
  function vhover(){
    document.querySelectorAll('[data-vh]').forEach(c=>{
      const v=c.querySelector('video');if(!v)return;
      v.muted=true;v.loop=true;
      c.addEventListener('mouseenter',()=>v.play().catch(function(){}));
      c.addEventListener('mouseleave',()=>{v.pause();v.currentTime=0;});
    });
  }

  /* ── HERO ENTRANCE ── */
  function heroIn(){
    if(!window.gsap)return;
    const els=document.querySelectorAll('.hero [data-h]');if(!els.length)return;
    gsap.set(els,{opacity:0,y:32});
    gsap.to(els,{opacity:1,y:0,duration:.9,ease:'power3.out',stagger:.13,delay:.2});
  }

  /* ── HERO PIN/FADE ── */
  function heroPin(){
    if(!window.gsap||!window.ScrollTrigger)return;
    const hero=document.querySelector('.hero'),inner=document.querySelector('.hero__i');
    if(!hero||!inner)return;
    gsap.to(inner,{opacity:0,y:-55,ease:'none',
      scrollTrigger:{trigger:hero,start:'top top',end:'bottom 65%',scrub:1}});
  }

  /* ── SCROLL FADE ANIMS ── */
  function anims(){
    if(!window.gsap||!window.ScrollTrigger)return;
    document.querySelectorAll('[data-a]').forEach(el=>{
      const t=el.dataset.a,delay=parseFloat(el.dataset.d||0);
      const from={};
      if(t==='up')   {from.y=50;from.opacity=0;}
      if(t==='down') {from.y=-40;from.opacity=0;}
      if(t==='left') {from.x=-50;from.opacity=0;}
      if(t==='right'){from.x=50;from.opacity=0;}
      if(t==='fade') {from.opacity=0;}
      if(t==='scale'){from.scale=.88;from.opacity=0;}
      gsap.from(el,{...from,duration:.9,ease:'power3.out',delay,
        scrollTrigger:{trigger:el,start:'top 90%',toggleActions:'play none none reverse'}});
    });
    // stagger grids
    document.querySelectorAll('[data-sg]').forEach(p=>{
      const st=parseFloat(p.dataset.sg||.1);
      gsap.from(p.children,{opacity:0,y:40,duration:.8,ease:'power3.out',stagger:st,
        scrollTrigger:{trigger:p,start:'top 88%',toggleActions:'play none none reverse'}});
    });
  }

  /* ── CHART DEFAULTS ── */
  function chartDefs(){
    if(!window.Chart)return;
    Chart.defaults.color='#7E8C7E';
    Chart.defaults.font.family='DM Sans';
    Chart.defaults.plugins.tooltip.backgroundColor='#111811';
    Chart.defaults.plugins.tooltip.borderColor='rgba(76,175,80,.22)';
    Chart.defaults.plugins.tooltip.borderWidth=1;
    Chart.defaults.plugins.tooltip.titleColor='#EDEEED';
    Chart.defaults.plugins.tooltip.bodyColor='#7E8C7E';
    Chart.defaults.plugins.tooltip.padding=12;
    Chart.defaults.plugins.tooltip.cornerRadius=8;
  }

  /* ── ANCHORS ── */
  function anchors(){
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',e=>{
        const t=document.querySelector(a.getAttribute('href'));
        if(!t)return;e.preventDefault();
        t.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
  }

  /* ── INIT ── */
  function init(){
    bar();nav();spy();anchors();vids();vhover();chartDefs();
    if(window.gsap&&window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);
      heroIn();heroPin();anims();counters();
    }
  }

  document.addEventListener('DOMContentLoaded',init);
  return{counter,chartDefs};
})();
