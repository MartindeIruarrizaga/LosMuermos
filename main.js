/* =================================================================
   LOS MUERMOS — MAIN.JS
   Loads data/los-muermos.json and drives the whole presentation
   ================================================================= */
'use strict';

(async function(){

  /* ── 1. LOAD DATA ── */
  let D;
  try{
    const res=await fetch('../../data/los-muermos.json');
    D=await res.json();
  }catch(e){
    console.warn('JSON load failed, using inline fallback');
    // Inline fallback so the page still works when opened via file://
    D=window.__LM_DATA__||{};
    if(!D.terreno){console.error('No data available');return;}
  }

  /* ── 2. KPIs — TERRENO ── */
  const kpiTerreno=document.getElementById('kpi-terreno');
  if(kpiTerreno&&D.kpis){
    kpiTerreno.innerHTML=D.kpis.map(k=>`
      <div class="kpi">
        <div class="kpi__val">
          <span class="kpi__n" data-c="${k.val}" data-dec="0">${k.val.toLocaleString('es-CL')}</span>
          <span class="kpi__s">${k.suf}</span>
        </div>
        <div class="kpi__l">${k.lbl}</div>
      </div>`).join('');
  }

  /* ── 3. VIRTUDES CARDS ── */
  const virtEl=document.getElementById('virtudes-grid');
  if(virtEl&&D.virtudes){
    virtEl.innerHTML=D.virtudes.map(v=>`
      <div class="card" data-a="up">
        <span class="card__icon">${v.icon}</span>
        <div class="card__title">${v.title}</div>
        <div class="card__body">${v.body}</div>
      </div>`).join('');
  }

  /* ── 4. PROGRAMA BARS ── */
  const progEl=document.getElementById('prog-list');
  if(progEl&&D.programa){
    progEl.innerHTML=D.programa.map(p=>`
      <div class="prog-row">
        <div class="prog-row__name">${p.uso}</div>
        <div class="prog-bar"><div class="prog-bar__fill" style="width:0%" data-pct="${p.pct}"></div></div>
        <div class="prog-row__pct">${p.pct}%</div>
      </div>`).join('');
    // Animate bars on scroll
    if(window.gsap&&window.ScrollTrigger){
      document.querySelectorAll('.prog-bar__fill').forEach(bar=>{
        ScrollTrigger.create({
          trigger:bar,start:'top 90%',
          onEnter(){
            gsap.to(bar,{width:bar.dataset.pct+'%',duration:1.1,ease:'power2.out'});
          }
        });
      });
    } else {
      // No GSAP fallback
      document.querySelectorAll('.prog-bar__fill').forEach(b=>b.style.width=b.dataset.pct+'%');
    }
  }

  /* ── 5. PROOP DIFERENCIADORES ── */
  const difEl=document.getElementById('dif-grid');
  if(difEl&&D.proop&&D.proop.diferenciadores){
    difEl.innerHTML=D.proop.diferenciadores.map(d=>`
      <div class="dif">
        <div class="dif__ico">${d.icon}</div>
        <div class="dif__title">${d.title}</div>
        <div class="dif__body">${d.body}</div>
      </div>`).join('');
  }

  /* ── 6. PROYECTOS ── */
  const projEl=document.getElementById('proj-list');
  if(projEl&&D.proop&&D.proop.proyectos){
    projEl.innerHTML=D.proop.proyectos.map(p=>`
      <div class="proj-row">
        <div>
          <div class="proj-row__name">${p.nombre}</div>
          <div class="proj-row__city">${p.ciudad} · ${p.tipo}</div>
        </div>
        <div class="proj-row__meta">${p.locales} locales · ${p.m2.toLocaleString('es-CL')} m²</div>
        <div class="proj-row__meta">${p.ancla}</div>
        <div class="proj-row__status"><span class="dot-alive"></span>${p.estado}</div>
      </div>`).join('');
  }

  /* ── 7. OPERADORES ── */
  const opEl=document.getElementById('op-grid');
  if(opEl&&D.operadores){
    opEl.innerHTML=D.operadores.map(o=>`
      <div class="op" data-a="up">
        <div class="op__num">${o.num}</div>
        <div class="op__tag"><span class="pill pill--s">${o.tipo}</span></div>
        <div class="op__tipo">${o.rubro}</div>
        <div class="op__estado"><span class="dot-alive"></span>${o.estado}</div>
        <div class="op__detail">
          <div>
            <div class="op__dl">Superficie</div>
            <div class="op__dv">${o.m2}</div>
          </div>
          <div>
            <div class="op__dl">Contrato</div>
            <div class="op__dv">${o.plazo}</div>
          </div>
        </div>
        <div class="op__desc">${o.desc}</div>
      </div>`).join('');
  }

  /* ── 8. KPIs RENT ROLL ── */
  const rrKpiEl=document.getElementById('rr-kpis');
  if(rrKpiEl&&D.rent_roll&&D.rent_roll.kpis){
    rrKpiEl.innerHTML=D.rent_roll.kpis.map(k=>`
      <div class="kpi">
        <div class="kpi__val">
          <span class="kpi__n" data-c="${k.val}" data-dec="0">${k.val.toLocaleString('es-CL')}</span>
          <span class="kpi__s">${k.suf}</span>
        </div>
        <div class="kpi__l">${k.lbl}</div>
      </div>`).join('');
  }

  /* ── 9. RENT ROLL TABLE ── */
  const rrTableEl=document.getElementById('rr-table-body');
  if(rrTableEl&&D.rent_roll&&D.rent_roll.items){
    rrTableEl.innerHTML=D.rent_roll.items.map(r=>`
      <tr>
        <td>${r.local}</td>
        <td>${r.m2.toLocaleString('es-CL')}</td>
        <td>${r.uf_m2.toFixed(2)}</td>
        <td>${r.uf_mes.toLocaleString('es-CL')}</td>
        <td>${r.plazo}</td>
      </tr>`).join('');
    // Total row update
    const tot=document.getElementById('rr-total');
    if(tot&&D.rent_roll.total_mes){
      tot.textContent=D.rent_roll.total_mes.toLocaleString('es-CL')+' UF';
    }
  }

  /* ── 10. CHART ── */
  function buildChart(){
    const ctx=document.getElementById('chart-main');
    if(!ctx||!window.Chart||!D.chart)return;
    const c=D.chart;
    new Chart(ctx,{
      type:'line',
      data:{
        labels:c.labels,
        datasets:[
          {
            label:'Renta Anual (UF)',
            data:c.renta,
            yAxisID:'y',
            borderColor:'#4CAF50',
            backgroundColor:'rgba(76,175,80,0.08)',
            borderWidth:2.5,
            pointBackgroundColor:'#4CAF50',
            pointRadius:4,
            pointHoverRadius:7,
            fill:true,
            tension:.35
          },
          {
            label:'Ocupación (%)',
            data:c.ocupacion,
            yAxisID:'y1',
            borderColor:'rgba(76,175,80,0.35)',
            backgroundColor:'transparent',
            borderWidth:1.5,
            borderDash:[5,4],
            pointBackgroundColor:'rgba(76,175,80,0.5)',
            pointRadius:3,
            pointHoverRadius:5,
            fill:false,
            tension:.35
          }
        ]
      },
      options:{
        responsive:true,maintainAspectRatio:false,
        interaction:{mode:'index',intersect:false},
        plugins:{
          legend:{
            labels:{color:'#7E8C7E',boxWidth:14,padding:20,
              font:{family:'DM Sans',size:12}}
          }
        },
        scales:{
          x:{grid:{color:'rgba(76,175,80,0.04)'},
             ticks:{color:'#3D4A3D',font:{family:'DM Sans',size:11}}},
          y:{
            position:'left',
            grid:{color:'rgba(76,175,80,0.05)'},
            ticks:{color:'#7E8C7E',font:{family:'DM Sans',size:11},
              callback:v=>v.toLocaleString('es-CL')+' UF'}
          },
          y1:{
            position:'right',
            grid:{drawOnChartArea:false},
            min:60,max:100,
            ticks:{color:'rgba(76,175,80,0.5)',font:{family:'DM Sans',size:11},
              callback:v=>v+'%'}
          }
        },
        animation:{duration:1400,easing:'easeInOutQuart'}
      }
    });
  }

  // Init chart when scrolled into view
  if(window.ScrollTrigger){
    ScrollTrigger.create({
      trigger:'#grafico',start:'top 80%',
      onEnter(){buildChart();},
      once:true
    });
  } else {
    const chartSec=document.getElementById('grafico');
    if(chartSec){
      const io=new IntersectionObserver(es=>{
        if(es[0].isIntersecting){buildChart();io.disconnect();}
      },{threshold:.2});
      io.observe(chartSec);
    }
  }

  /* ── 11. CONTACT INFO ── */
  const contactEls={
    'c-nombre':  D.contacto&&D.contacto.nombre,
    'c-cargo':   D.contacto&&D.contacto.cargo,
    'c-email':   D.contacto&&D.contacto.email,
    'c-tel':     D.contacto&&D.contacto.tel,
    'c-web':     D.contacto&&D.contacto.web,
  };
  Object.entries(contactEls).forEach(([id,val])=>{
    const el=document.getElementById(id);
    if(el&&val)el.textContent=val;
  });

  /* ── 12. RE-INIT SCROLL ANIMS after dynamic content ── */
  if(window.gsap&&window.ScrollTrigger){
    // Short delay for DOM settle
    setTimeout(()=>{
      ScrollTrigger.refresh();
      // Re-run counter init for dynamically added elements
      document.querySelectorAll('[data-c]').forEach(el=>{
        let done=false;
        ScrollTrigger.create({trigger:el,start:'top 90%',
          onEnter(){if(!done){done=true;PC.counter(el);}}});
      });
    },200);
  }

})();
