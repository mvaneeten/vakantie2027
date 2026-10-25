function renderVacation(data) {
validateVacation(data);
const {trip, stops, days} = data;
const budget=data.budget.map(row=>[row.name,row.amount,row.color]);
const hotelNights=stops.reduce((sum,stop)=>sum+stop.nights,0);
const year=new Date(trip.startDate+'T00:00:00Z').getUTCFullYear();
const dayDate=iso=>new Date(iso+'T00:00:00Z').toLocaleDateString('nl-NL',{weekday:'short',day:'numeric',month:'long',timeZone:'UTC'});
const euro = n => new Intl.NumberFormat('nl-NL',{style:'currency',currency:trip.currency,maximumFractionDigits:2}).format(n);
const imageFor = stop => stops[stop].image;
const dateAt = offset => new Date(Date.parse(trip.startDate+'T00:00:00Z')+offset*86400000);
const dateLabel = date => date.toLocaleDateString('nl-NL', {day:'numeric', month:'long', timeZone:'UTC'});
let nightsBefore = 0;
const stays = stops.map(s => {
  const stay = {first: nightsBefore + 1, last: nightsBefore + s.nights,
    arrival: dateLabel(dateAt(nightsBefore)), departure: dateLabel(dateAt(nightsBefore + s.nights))};
  nightsBefore += s.nights;
  return stay;
});
let map;
const markers = [];
const routeList = document.getElementById('routeList');
routeList.innerHTML = stops.map((s,i) => `<button type="button" class="route-stop" data-stop="${i}" aria-label="Toon ${s.name} op de kaart"><span class="route-num">${i+1}</span><span><b>${s.name}</b><small>${stays[i].arrival} – ${stays[i].departure} · ${s.nights} nachten</small></span></button>`).join('');
const mapEl = document.getElementById('map');
if (window.L) {
  mapEl.innerHTML = '';
  map = L.map('map', {scrollWheelZoom:false});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom:19
  }).addTo(map).on('tileerror', () => { document.getElementById('mapStatus').textContent = 'Kaartachtergrond niet geladen. Gebruik de routelijst of de Google Maps-link.'; });
  const points = stops.map(s => [s.lat,s.lon]);
  L.polyline(points, {color:'#087f91', weight:4, opacity:.95, dashArray:'9,7'}).addTo(map);
  stops.forEach((s,i) => markers.push(L.marker([s.lat,s.lon], {
    title:`${i+1}. ${s.name}`, alt:s.name,
    icon:L.divIcon({className:'', html:`<div class="map-label">${i+1}</div>`, iconSize:[26,26], iconAnchor:[13,13]})
  }).addTo(map).bindPopup(`<b>${i+1}. ${s.name}</b><br>${s.hotel}<br>${stays[i].arrival} – ${stays[i].departure}<br>Nachten ${stays[i].first}–${stays[i].last} van ${hotelNights}`)));
  const showAll = () => map.fitBounds(points, {padding:[35,35]});
  showAll();
  document.getElementById('showRoute').addEventListener('click', showAll);
} else {
  mapEl.innerHTML = '<div class="map-fallback"><b>De interactieve kaart is niet geladen.</b><p>Gebruik de volledige routelijst en de link naar Google Maps hieronder. Voor de kaart is internet nodig.</p></div>';
  document.getElementById('showRoute').hidden = true;
}
routeList.addEventListener('click', event => {
  const button = event.target.closest('[data-stop]');
  if (!button) return;
  const i = Number(button.dataset.stop);
  if (map) { map.setView([stops[i].lat,stops[i].lon], 8); markers[i].openPopup(); }
});
const grid = document.getElementById('dayGrid');
function renderDays(filter='all') {
  const shown = days.filter(d => filter === 'all' || d.region === filter);
  grid.innerHTML = shown.map(d => {
    const stop = d.stop !== null ? stops[d.stop] : null;
    const hotel = stop
      ? `<div class="night">🛏️ <b>Reisnacht ${d.n} van ${hotelNights}</b><br>${stop.hotel}<br><span>Hotelnacht ${d.night} · ${stays[d.stop].arrival} – ${stays[d.stop].departure}</span></div>`
      : `<div class="night no-night">✈️ ${d.n === 21 ? 'Nachtvlucht · geen hotelovernachting' : 'Thuis · geen hotelovernachting'}</div>`;
    const img = d.image;
    return `<article class="day-card"><div class="day-image" style="background-image:linear-gradient(0deg,#0e34413b,#0e344108),url('${img}')"><span class="day-tag">DAG ${String(d.n).padStart(2,'0')}</span></div><div class="day-content"><div class="day-date">${dayDate(d.date)} ${year} · ${d.loc}</div><h3>${d.title}</h3><div class="day-travel">${d.icon} &nbsp;${d.travel}</div><p>${d.desc}</p><p>${d.notes}</p><div class="day-todo">${d.todo.map(t=>`<span>${t}</span>`).join('')}</div>${hotel}</div></article>`;
  }).join('');
  document.getElementById('dayCount').textContent = `${shown.length} van de ${days.length} reisdagen`;
}
renderDays();
document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
  btn.classList.add('active'); btn.setAttribute('aria-pressed','true'); renderDays(btn.dataset.filter);
}));
document.getElementById('hotelGrid').innerHTML = stops.map((s,i) => `<article class="hotel-card"><div class="hotel-photo" style="background-image:url('${imageFor(i)}')"><span class="photo-caption">Sfeerbeeld bestemming</span></div><div class="hotel-body"><small>${i+1} / ${s.name.toUpperCase()}</small><h3>${s.hotel}</h3><p>${stays[i].arrival} – ${stays[i].departure} ${year}<br><b>Reisnachten ${stays[i].first}–${stays[i].last}</b> · ${s.sub}</p><div class="hotel-bottom"><span>${s.nights} nachten · ${trip.travelers} personen</span><strong>${euro(s.cost)}</strong></div><p class="hotel-estimate">Raming per verblijf · ${euro(s.cost/s.nights)} per nacht</p></div></article>`).join('');
const total = budget.reduce((sum,row) => sum + row[1], 0);
document.getElementById('budgetRows').innerHTML = budget.map(([name,value,color]) => `<div class="budget-row"><span class="budget-dot" style="background:${color}"></span><span>${name}<small>${(value/total*100).toLocaleString('nl-NL',{maximumFractionDigits:1})}% van het budget</small></span><span class="amount">${euro(value)}</span></div>`).join('') + `<div class="budget-row budget-sum"><span>Totaal voor ${trip.travelers} reizigers</span><span class="amount">${euro(total)}</span></div>`;
let angle = 0;
document.querySelector('.budget-ring').style.background = `conic-gradient(${budget.map(([,value,color]) => { const start=angle; angle+=value/total*100; return `${color} ${start}% ${angle}%`; }).join(',')})`;


const view={...trip,year:String(year),heroFirst:trip.heroTitle[0],heroLast:trip.heroTitle[1],
 dateRange:dateLabel(dateAt(0))+' — '+dateLabel(new Date(trip.endDate+'T00:00:00Z'))+' '+year,
 daySummary:days.length+' kalenderdagen',nightSummary:hotelNights+' hotelnachten',stopSummary:stops.length+' bestemmingen',travelerSummary:trip.travelers+' reizigers',
 routeDescription:data.route.lineDescription,distanceLabel:data.route.distanceLabel,
 nightExplanation:hotelNights+' hotelnachten: '+stays[0].arrival+' t/m '+dateLabel(dateAt(hotelNights-1))+'. Op '+dateLabel(new Date(trip.returnFlightDate+'T00:00:00Z'))+' vliegen we terug; '+dateLabel(new Date(trip.endDate+'T00:00:00Z'))+' komen we aan op Schiphol.',
 allDays:'Alle '+days.length+' dagen',hotelDescription:'Voorlopige hotelkeuzes. We zoeken per locatie een kamer voor '+trip.travelerDescription+'. '+trip.hotelRoomPreference,
 targetBudget:euro(trip.targetBudget),perPerson:'Circa '+euro(trip.targetBudget/trip.travelers)+' per persoon'};
document.querySelectorAll('[data-trip-text]').forEach(el=>{el.textContent=view[el.dataset.tripText]});
document.title=trip.title+' | Onze droomreis';
document.getElementById('routeSummary').textContent=stops.map(s=>s.name.toUpperCase()).join(' ✦ ');
document.querySelector('.hero').style.backgroundImage='linear-gradient(90deg,rgba(10,43,56,.93) 0%,rgba(10,43,56,.75) 44%,rgba(10,43,56,.17) 100%),url('+JSON.stringify(stops[0].image)+')';
document.getElementById('googleMapsRoute').href=data.route.googleMapsUrl;
const escapeText=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.getElementById('practicalGrid').innerHTML=data.practical.map(p=>'<article><div class="pict">'+escapeText(p.icon)+'</div><h3>'+escapeText(p.title)+'</h3><p>'+escapeText(p.description)+'</p></article>').join('');
document.getElementById('sourceLinks').innerHTML=data.sources.map(s=>'<a target="_blank" rel="noopener" href="'+escapeText(s.url)+'">'+escapeText(s.title)+' ↗</a>').join(' · ');
document.getElementById('dataStatus').hidden=true;
}

function validateVacation(data) {
 if(data.schemaVersion!==1 || !data.trip || !Array.isArray(data.stops) || !Array.isArray(data.days) || !Array.isArray(data.budget) || !Array.isArray(data.practical) || !Array.isArray(data.sources)) throw new Error('Onbekende indeling van de reisgegevens.');
 const iso=value=>typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value+'T00:00:00Z'));
 if(!iso(data.trip.startDate)||!iso(data.trip.endDate)||!iso(data.trip.returnFlightDate)||!Number.isInteger(data.trip.travelers)||data.trip.travelers<1) throw new Error('Controleer de reisdatums en het aantal reizigers.');
 const expectedDays=(Date.parse(data.trip.endDate)-Date.parse(data.trip.startDate))/86400000+1;
 if(data.days.length!==expectedDays) throw new Error('Het aantal dagen past niet bij de reisdatums.');
 if(!data.stops.length || data.stops.some(s=>!Number.isInteger(s.nights)||s.nights<1||!Number.isFinite(s.lat)||!Number.isFinite(s.lon)||Math.abs(s.lat)>90||Math.abs(s.lon)>180||!Number.isFinite(s.cost)||s.cost<0)) throw new Error('Controleer de hotelnachten, kosten en kaartlocaties.');
 const hotelSequence=data.stops.flatMap((s,i)=>Array(s.nights).fill(i));
 for(const [i,d] of data.days.entries()) {
  if(d.n!==i+1 || !iso(d.date) || Date.parse(d.date)!==Date.parse(data.trip.startDate)+i*86400000 || !Array.isArray(d.todo) || typeof d.notes!=='string') throw new Error('Controleer de volgorde en beschrijving van de reisdagen.');
  const stop=hotelSequence[i]??null;
  if(d.stop!==stop) throw new Error('De hotelnachten sluiten niet aan op het dagprogramma.');
  if(stop!==null) {const first=hotelSequence.indexOf(stop);if(d.night!==((i-first+1)+'/'+data.stops[stop].nights)) throw new Error('De nachtnummering klopt niet.');}
 }
 if(data.budget.some(r=>!Number.isFinite(r.amount)||r.amount<0)||data.budget.reduce((n,r)=>n+r.amount,0)!==data.trip.targetBudget) throw new Error('De begroting past niet bij het richtbudget.');
 if(data.stops.reduce((n,s)=>n+s.cost,0)!==data.budget[0].amount) throw new Error('De hotelkosten passen niet bij de begroting.');
}

function showLoadError() {
 const status=document.getElementById('dataStatus');
 status.hidden=false;
 status.innerHTML='<strong>De reisgegevens konden niet worden geopend.</strong><p>Probeer opnieuw. Heb je de website rechtstreeks vanaf je computer geopend? Kies dan het bijbehorende vakantie.json-bestand.</p><button type="button" id="retryData" class="filter">Opnieuw proberen</button> <label class="filter">Reisbestand kiezen <input id="chooseData" type="file" accept=".json,application/json"></label>';
 document.getElementById('retryData').addEventListener('click',loadVacation);
 document.getElementById('chooseData').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{renderVacation(JSON.parse(await file.text()))}catch(error){console.error(error);showLoadError()}
 });
}

async function loadVacation() {
 try {
  const response=await fetch(new URL('vakantie.json',document.baseURI),{cache:'no-cache'});
  if(!response.ok)throw new Error('Reisbestand niet beschikbaar ('+response.status+').');
  renderVacation(await response.json());
 } catch(error) {console.error(error);showLoadError();}
}
loadVacation();
