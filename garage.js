
(function(){
  "use strict";
  var q=function(s,r){return (r||document).querySelector(s);};
  var qa=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
  var content=q("#garageContent"), modal=q("#garageModal"), modalContent=q("#modalContent"), toast=q("#toast");
  var storageKey="autocheck-kz-garage-v1";
  var defaults={car:{make:"Toyota",model:"Corolla",year:"2012",mileage:"168400"},history:[
    {date:"12.09.2026",title:"Планды диагностика",detail:"P0420 · 3 код · 2 түсіндірме",tone:"warn"},
    {date:"18.07.2026",title:"Май және сүзгі ауыстырылды",detail:"Жүріс: 164 920 км · 38 500 ₸",tone:"ok"},
    {date:"02.03.2026",title:"Жоспарлы техникалық қызмет",detail:"Жүріс: 161 300 км · 62 000 ₸",tone:"info"}
  ],settings:{notifications:true,compact:false,language:"Қазақша"}};
  var data;
  try{data=JSON.parse(localStorage.getItem(storageKey)||"null")||JSON.parse(JSON.stringify(defaults));}catch(e){data=JSON.parse(JSON.stringify(defaults));}
  data.car=Object.assign({},defaults.car,data.car||{});
  data.history=Array.isArray(data.history)?data.history:defaults.history.slice();
  data.settings=Object.assign({},defaults.settings,data.settings||{});
  var currentView="overview";
  function esc(value){return String(value==null?"":value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(data));}catch(e){}}
  function carName(){return (data.car.make+" "+data.car.model).trim()||"Менің көлігім";}
  function mileage(){return Number(data.car.mileage||0).toLocaleString("ru-RU").replace(/\u00a0/g," ");}
  function notify(message){if(!toast)return;toast.textContent=message;toast.classList.add("is-visible");clearTimeout(notify.timer);notify.timer=setTimeout(function(){toast.classList.remove("is-visible");},2600);}
  function openModal(html){if(!modal||!modalContent)return;modalContent.innerHTML=html;modal.hidden=false;document.body.classList.add("modal-open");requestAnimationFrame(function(){modal.classList.add("is-open");});var first=modalContent.querySelector("input,select,textarea,button");if(first)first.focus();}
  function closeModal(){if(!modal)return;modal.classList.remove("is-open");document.body.classList.remove("modal-open");setTimeout(function(){modal.hidden=true;},180);}
  function overview(){
    return "<div class='mini-content-head'><div><span class='mini-kicker'>МЕНІҢ КӨЛІГІМ / 01</span><h3>"+esc(carName())+" <span>"+esc(data.car.year)+"</span></h3></div><button type='button' class='mini-button' data-action='add-car'>+ Көлік қосу</button></div>"+
    "<div class='mini-kpis'><div><small>Жалпы жүріс</small><b>"+mileage()+" <em>км</em></b></div><div><small>Соңғы тексеру</small><b>12.09 <em>2026</em></b></div><div><small>Ашық кодтар</small><b class='warn'>03 <em>назарда</em></b></div></div>"+
    "<div class='mini-chart'><div class='chart-title'><span>Диагностика динамикасы</span><small>соңғы 6 ай</small></div><div class='chart-lines'><i></i><i></i><i></i><svg viewBox='0 0 650 120' preserveAspectRatio='none'><path d='M0 94 C70 78, 90 101, 146 70 S230 83, 282 52 S370 70, 420 31 S520 69, 650 20' fill='none' stroke='currentColor' stroke-width='3'/><path d='M0 94 C70 78, 90 101, 146 70 S230 83, 282 52 S370 70, 420 31 S520 69, 650 20 L650 120 L0 120Z' fill='url(#fade)' stroke='none'/><defs><linearGradient id='fade' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#5ce1f5' stop-opacity='.24'/><stop offset='1' stop-color='#5ce1f5' stop-opacity='0'/></linearGradient></defs></svg></div></div>"+
    "<div class='mini-bottom'><div><span class='mini-kicker'>СОҢҒЫ ДИАГНОСТИКА</span><strong><span class='ok-dot'></span> Есеп дайын</strong><p>3 код · 2 түсіндірме · 1 ұсыныс</p></div><button type='button' class='mini-report' data-action='pdf-report'>PDF есепті ашу ↗</button></div>";
  }
  function cars(){
    return "<div class='garage-view-head'><div><span class='mini-kicker'>ГАРАЖ / 01</span><h3>Менің көліктерім</h3><p>Көлік профилін сақтап, әр диагностика нәтижесін жеке тарихқа қосыңыз.</p></div><button type='button' class='mini-button' data-action='add-car'>+ Көлік қосу</button></div>"+
    "<div class='garage-car-card'><div class='garage-car-icon'>⌁</div><div><strong>"+esc(carName())+"</strong><span>"+esc(data.car.year)+" · "+mileage()+" км</span><small>Белсенді профиль · соңғы тексеру 12.09.2026</small></div><button type='button' class='mini-report' data-action='pdf-report'>Есеп ↗</button></div>"+
    "<div class='garage-info-strip'><span class='ok-dot'></span><b>Профиль дайын</b><small>Дерек осы браузерде сақталады</small></div>";
  }
  function history(){
    var rows=data.history.map(function(item,index){return "<article class='garage-history-item'><span class='history-dot "+esc(item.tone||"info")+"'></span><div><small>"+esc(item.date)+"</small><strong>"+esc(item.title)+"</strong><p>"+esc(item.detail)+"</p></div><button type='button' class='history-action' data-action='pdf-report' data-history-index='"+index+"' aria-label='Есепті ашу'>↗</button></article>";}).join("");
    return "<div class='garage-view-head'><div><span class='mini-kicker'>ГАРАЖ / 03</span><h3>Қызмет тарихы</h3><p>Диагностика мен жөндеу жазбалары бір жерде.</p></div><button type='button' class='mini-button' data-action='add-service'>+ Жазба қосу</button></div><div class='garage-history-list'>"+rows+"</div><div class='garage-info-strip'><span>03</span><b>жазба</b><small>Барлық жазбаны PDF есебіне қосуға болады</small></div>";
  }
  function settings(){
    return "<div class='garage-view-head'><div><span class='mini-kicker'>ГАРАЖ / 04</span><h3>Баптау</h3><p>Кабинетті өз жұмыс тәртібіңізге бейімдеңіз.</p></div></div><form class='garage-settings' id='garageSettingsForm'>"+
    "<label class='setting-row'><span><b>Диагностика ескертулері</b><small>Ашық кодтар өзгергенде хабарлау</small></span><input type='checkbox' name='notifications' "+(data.settings.notifications?"checked":"")+"><i></i></label>"+
    "<label class='setting-row'><span><b>Ықшам көрініс</b><small>Көбірек ақпаратты бір экранға сыйдыру</small></span><input type='checkbox' name='compact' "+(data.settings.compact?"checked":"")+"><i></i></label>"+
    "<label class='setting-select'><span><b>Интерфейс тілі</b><small>Есептің түсіндірме тілі</small></span><select name='language'><option "+(data.settings.language==="Қазақша"?"selected":"")+">Қазақша</option><option "+(data.settings.language==="Русский"?"selected":"")+">Русский</option></select></label><button class='mini-button settings-save' type='submit'>Баптауды сақтау ✓</button></form>";
  }
  function profile(){
    return "<div class='garage-view-head'><div><span class='mini-kicker'>ЖЕКЕ КАБИНЕТ</span><h3>Сәбит Даниал</h3><p>AutoCheck KZ жобасының демо-пайдаланушысы.</p></div><button type='button' class='mini-button' data-action='settings'>Баптауға өту ↗</button></div><div class='profile-grid'><div><span>Жоба</span><strong>AutoCheck KZ</strong><small>Fullstack жеке жоба</small></div><div><span>Рөлі</span><strong>Owner</strong><small>Жеке гараж</small></div><div><span>Дерек</span><strong>Local-first</strong><small>Браузерде сақталады</small></div></div><div class='garage-info-strip'><span class='ok-dot'></span><b>Сессия белсенді</b><small>Қауіпсіз демо режимі</small></div>";
  }
  function render(view){currentView=view||"overview";if(content)content.innerHTML=(currentView==="cars"?cars:currentView==="history"?history:currentView==="settings"?settings:currentView==="profile"?profile:overview)();qa(".mini-side-action").forEach(function(button){button.classList.toggle("side-active",button.dataset.garageView===currentView);});}
  function carModal(){openModal("<span class='modal-kicker'>ГАРАЖ / ЖАҢА ПРОФИЛЬ</span><h2 id='modalTitle'>Көлік қосу</h2><p class='modal-lead'>Автокөлік деректерін енгізіңіз. Олар осы браузерде сақталады.</p><form class='modal-form' id='addCarForm'><label>Марка<input name='make' value='"+esc(data.car.make)+"' required></label><label>Модель<input name='model' value='"+esc(data.car.model)+"' required></label><div class='modal-form-grid'><label>Жыл<input name='year' type='number' min='1980' max='2030' value='"+esc(data.car.year)+"' required></label><label>Жүріс, км<input name='mileage' type='number' min='0' value='"+esc(data.car.mileage)+"' required></label></div><div class='modal-actions'><button class='button button-primary' type='submit'>Профильді сақтау</button><button class='button button-ghost' type='button' data-close-modal>Болдырмау</button></div></form>");}
  function serviceModal(){openModal("<span class='modal-kicker'>ГАРАЖ / ТАРИХ</span><h2 id='modalTitle'>Қызмет жазбасын қосу</h2><p class='modal-lead'>Жөндеу немесе тексеру туралы қысқа жазба сақтаңыз.</p><form class='modal-form' id='serviceForm'><label>Жұмыс атауы<input name='title' placeholder='Май ауыстыру' required></label><label>Толық мәлімет<textarea name='detail' rows='3' placeholder='Жүріс, шығын және ескертпе'></textarea></label><div class='modal-actions'><button class='button button-primary' type='submit'>Жазбаны қосу</button><button class='button button-ghost' type='button' data-close-modal>Болдырмау</button></div></form>");}
  function reportModal(){var rows=data.history.map(function(item){return "<div class='report-row'><span>"+esc(item.date)+"</span><b>"+esc(item.title)+"</b><small>"+esc(item.detail)+"</small></div>";}).join("");openModal("<span class='modal-kicker'>AUTOCHECK KZ / PDF REPORT</span><h2 id='modalTitle'>Диагностика есебі</h2><p class='modal-lead'>"+esc(carName())+" · "+esc(data.car.year)+" · "+mileage()+" км</p><div class='report-summary'><div><span>Ашық кодтар</span><strong>03</strong></div><div><span>Соңғы нәтиже</span><strong class='report-ok'>Есеп дайын</strong></div><div><span>Басымдық</span><strong>Жоспарлы</strong></div></div><div class='report-block'><span class='modal-kicker'>ҚЫЗМЕТ ТАРИХЫ</span>"+rows+"</div><div class='report-block report-note'><span class='modal-kicker'>ҰСЫНЫС</span><p>СТО-ға барған кезде P0420 кодын, оттегі датчиктерін және шығару жүйесін бірге тексеруді сұраңыз.</p></div><div class='modal-actions'><button class='button button-primary' type='button' data-action='print-report'>PDF ретінде сақтау</button><button class='button button-ghost' type='button' data-close-modal>Жабу</button></div>");}
  function printReport(){var popup=window.open("","_blank");if(!popup){notify("Браузер жаңа терезені бұғаттады");return;}popup.document.write("<!doctype html><html lang='kk'><head><meta charset='utf-8'><title>AutoCheck KZ — PDF есеп</title><style>body{font-family:Arial,sans-serif;color:#10212d;padding:48px;max-width:820px;margin:auto}h2{font-size:32px;margin:8px 0}.modal-kicker{font-size:11px;letter-spacing:.16em;color:#087f99;font-weight:700}.modal-lead{color:#526572}.report-summary{display:flex;gap:16px;margin:26px 0}.report-summary>div{border:1px solid #c8d9df;border-radius:12px;padding:16px;min-width:150px}.report-summary span,.report-row span,.report-row small{display:block;color:#60727b;font-size:12px}.report-summary strong{display:block;margin-top:8px}.report-block{margin-top:26px}.report-row{padding:14px 0;border-bottom:1px solid #d9e5e8}.report-row b{display:block;margin:4px 0}.report-note{background:#eefaff;padding:18px;border-radius:14px}</style></head><body>"+(modalContent?modalContent.innerHTML:"")+"</body></html>");popup.document.close();popup.focus();setTimeout(function(){popup.print();},160);}
  render();
  document.addEventListener("click",function(event){
    var view=event.target.closest("[data-garage-view]");if(view){event.preventDefault();render(view.dataset.garageView);return;}
    var action=event.target.closest("[data-action]");if(!action)return;
    if(action.dataset.action==="add-car")carModal();
    if(action.dataset.action==="add-service")serviceModal();
    if(action.dataset.action==="pdf-report")reportModal();
    if(action.dataset.action==="settings")render("settings");
    if(action.dataset.action==="print-report")printReport();
    if(event.target.matches("[data-close-modal]"))closeModal();
  });
  document.addEventListener("submit",function(event){
    if(event.target.id==="addCarForm"){event.preventDefault();var form=new FormData(event.target);data.car={make:String(form.get("make")).trim(),model:String(form.get("model")).trim(),year:String(form.get("year")),mileage:String(form.get("mileage"))};save();closeModal();render("cars");notify("Көлік профилі сақталды");}
    if(event.target.id==="serviceForm"){event.preventDefault();var service=new FormData(event.target);data.history.unshift({date:new Date().toLocaleDateString("kk-KZ"),title:String(service.get("title")).trim(),detail:String(service.get("detail")||"").trim()||"Қосымша мәлімет енгізілмеді",tone:"info"});save();closeModal();render("history");notify("Қызмет жазбасы тарихқа қосылды");}
    if(event.target.id==="garageSettingsForm"){event.preventDefault();var settingsForm=new FormData(event.target);data.settings={notifications:settingsForm.get("notifications")==="on",compact:settingsForm.get("compact")==="on",language:String(settingsForm.get("language"))};save();render("settings");notify("Баптаулар сақталды");}
  });
  document.addEventListener("click",function(event){if(event.target.matches("[data-close-modal]"))closeModal();});
  document.addEventListener("keydown",function(event){if(event.key==="Escape"&&modal&&!modal.hidden)closeModal();});
})();

