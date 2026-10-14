const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];

// Mobile navigation
const menuToggle=$('#menuToggle');
const nav=$('#nav');
menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open));});
$$('.nav a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('is-open');menuToggle?.setAttribute('aria-expanded','false');}));

// Scroll progress and subtle cursor light
const progress=$('#progress');
const cursorGlow=$('.cursor-glow');
window.addEventListener('scroll',()=>{const top=window.scrollY;const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=`${max?top/max*100:0}%`;},{passive:true});
window.addEventListener('pointermove',event=>{if(cursorGlow){cursorGlow.style.left=`${event.clientX}px`;cursorGlow.style.top=`${event.clientY}px`;}},{passive:true});

// Reveal sections only when they enter the viewport.
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -40px'});
$$('.reveal').forEach(el=>revealObserver.observe(el));

// Counters use the exact values shown in the research slide.
const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;const target=Number(el.dataset.counter);const decimals=String(target).includes('.')?1:0;let start=null;const step=now=>{if(start===null)start=now;const progress=Math.min((now-start)/1050,1);const eased=1-Math.pow(1-progress,3);el.textContent=(target*eased).toFixed(decimals).replace('.',',');if(progress<1)requestAnimationFrame(step);};requestAnimationFrame(step);counterObserver.unobserve(el);}),{threshold:.7});
$$('[data-counter]').forEach(el=>counterObserver.observe(el));

// Demo ruleset: deliberately labelled as educational mock data.
const rules={
  P0420:{severity:'Жоспарлы тексеру',title:'Катализатор жүйесінің тиімділігі төмен',copy:'Оттегі датчиктері катализатор тиімділігінің төмендегенін көрсетуі мүмкін. Бұл бірден қауіпті ақау деген сөз емес, бірақ эмиссия жүйесін тексеру қажет.',question:'«Датчиктер мен шығару жүйесін тексере аласыз ба?»',tone:'warn',icon:'!'},
  P0301:{severity:'Жақын арада тексеру',title:'1-цилиндрде тұтану үзілісі',copy:'Қозғалтқыштың бір цилиндрінде тұтану үзілісі анықталды. Шам, катушка және инжекторды тексеру ұсынылады. Көлік дірілдесе, ұзақ жүргізбеңіз.',question:'«Шам мен катушканы алмастырып тексеру керек пе?»',tone:'danger',icon:'⚠'},
  U0100:{severity:'Электрикаға назар',title:'ECM модулімен байланыс жоғалған',copy:'Қозғалтқышты басқару модулімен байланыс үзіліп, желі немесе қорек желісі мәселесін көрсетуі мүмкін. Аккумулятор кернеуін де тексеріңіз.',question:'«CAN желісі мен аккумулятор қорегін өлшейсіз бе?»',tone:'info',icon:'⌁'},
  P0171:{severity:'Жоспарлы тексеру',title:'Қоспа тым кедей',copy:'Қозғалтқыш қоспасында ауа көп немесе отын аз болуы мүмкін. Вакуум ағып кетуін, ауа өлшегішті және отын қысымын қарау керек.',question:'«Вакуум жүйесін және MAF датчигін тексересіз бе?»',tone:'warn',icon:'!'}
};
const codeInput=$('#codeInput'),checkCode=$('#checkCode'),demoResult=$('#demoResult');
function showRule(code){const key=String(code||'').toUpperCase().trim();const rule=rules[key]||{severity:'Анықтама табылмады',title:'Бұл код MVP анықтамалығында жоқ',copy:'AutoCheck KZ белгісіз кодқа болжам жасамайды. Кодтың толық сипаттамасын және көлік моделін маманға көрсетіңіз.',question:'«Бұл кодты өндіруші нұсқаулығымен салыстыра аласыз ба?»',tone:'info',icon:'?'};demoResult.classList.add('is-refreshing');setTimeout(()=>{ $('#resultCode').textContent=key||'----';$('#severityText').textContent=rule.severity;$('#resultTitle').textContent=rule.title;$('#resultCopy').textContent=rule.copy;$('#resultQuestion').textContent=rule.question;$('#severityIcon').textContent=rule.icon;$('#severityIcon').className=`severity-icon ${rule.tone}`;demoResult.classList.remove('is-refreshing');},180);}
checkCode?.addEventListener('click',()=>showRule(codeInput.value));
codeInput?.addEventListener('keydown',event=>{if(event.key==='Enter')showRule(codeInput.value);});
$$('.quick-codes button').forEach(button=>button.addEventListener('click',()=>{codeInput.value=button.dataset.code;showRule(button.dataset.code);}));

// Animated active section state in the navigation.
const navLinks=$$('.nav a');
const sections=['problem','product','mvp','architecture','roadmap'].map(id=>document.getElementById(id)).filter(Boolean);
const activeObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));}}),{rootMargin:'-35% 0px -55%'});
sections.forEach(section=>activeObserver.observe(section));

// Keyboard-friendly shortcut for the demo.
window.addEventListener('keydown',event=>{if(event.key==='/'&&document.activeElement!==codeInput){event.preventDefault();codeInput?.focus();}});

// Animated particles make the hero feel like a living diagnostic interface.
const particleField=$('.hero-particles');
if(particleField){
  const fragment=document.createDocumentFragment();
  for(let index=0;index<26;index+=1){
    const dot=document.createElement('span');
    dot.style.left=`${8+Math.random()*86}%`;
    dot.style.top=`${20+Math.random()*68}%`;
    dot.style.setProperty('--duration',`${4.5+Math.random()*5}s`);
    dot.style.setProperty('--delay',`${-Math.random()*7}s`);
    dot.style.setProperty('--drift',`${-55+Math.random()*110}px`);
    fragment.appendChild(dot);
  }
  particleField.appendChild(fragment);
}

// Small, pointer-safe 3D response on information cards.
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  $$('.metric-card,.swot-card,.mvp-card,.persona-card').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const box=card.getBoundingClientRect();
      const x=(event.clientX-box.left)/box.width-.5;
      const y=(event.clientY-box.top)/box.height-.5;
      card.style.transform=`perspective(900px) rotateX(${y*-2.4}deg) rotateY(${x*2.8}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform='';});
  });
}
