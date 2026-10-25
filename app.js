const euro = n => '€ ' + n.toLocaleString('nl-NL');
const imageFor = stop => `images/${stop}.jpg`;
const dateAt = offset => new Date(Date.UTC(2027, 6, 17 + offset));
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
  }).addTo(map).bindPopup(`<b>${i+1}. ${s.name}</b><br>${s.hotel}<br>${stays[i].arrival} – ${stays[i].departure}<br>Nachten ${stays[i].first}–${stays[i].last} van 20`)));
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
      ? `<div class="night">🛏️ <b>Reisnacht ${d.n} van 20</b><br>${stop.hotel}<br><span>Hotelnacht ${d.night} · ${stays[d.stop].arrival} – ${stays[d.stop].departure}</span></div>`
      : `<div class="night no-night">✈️ ${d.n === 21 ? 'Nachtvlucht · geen hotelovernachting' : 'Thuis · geen hotelovernachting'}</div>`;
    const img = imageFor(stop ? d.stop : 8);
    return `<article class="day-card"><div class="day-image" style="background-image:linear-gradient(0deg,#0e34413b,#0e344108),url('${img}')"><span class="day-tag">DAG ${String(d.n).padStart(2,'0')}</span></div><div class="day-content"><div class="day-date">${d.date} 2027 · ${d.loc}</div><h3>${d.title}</h3><div class="day-travel">${d.icon} &nbsp;${d.travel}</div><p>${d.desc}</p><p>${dayNotes[d.n-1]}</p><div class="day-todo">${d.todo.map(t=>`<span>${t}</span>`).join('')}</div>${hotel}</div></article>`;
  }).join('');
  document.getElementById('dayCount').textContent = `${shown.length} van de ${days.length} reisdagen`;
}
renderDays();
document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
  btn.classList.add('active'); btn.setAttribute('aria-pressed','true'); renderDays(btn.dataset.filter);
}));
document.getElementById('hotelGrid').innerHTML = stops.map((s,i) => `<article class="hotel-card"><div class="hotel-photo" style="background-image:url('${imageFor(i)}')"><span class="photo-caption">Sfeerbeeld bestemming</span></div><div class="hotel-body"><small>${i+1} / ${s.name.toUpperCase()}</small><h3>${s.hotel}</h3><p>${stays[i].arrival} – ${stays[i].departure} 2027<br><b>Reisnachten ${stays[i].first}–${stays[i].last}</b> · ${s.sub}</p><div class="hotel-bottom"><span>${s.nights} nachten · 4 personen</span><strong>${euro(s.cost)}</strong></div><p class="hotel-estimate">Raming per verblijf · ${euro(s.cost/s.nights)} per nacht</p></div></article>`).join('');
const total = budget.reduce((sum,row) => sum + row[1], 0);
document.getElementById('budgetRows').innerHTML = budget.map(([name,value,color]) => `<div class="budget-row"><span class="budget-dot" style="background:${color}"></span><span>${name}<small>${(value/total*100).toLocaleString('nl-NL',{maximumFractionDigits:1})}% van het budget</small></span><span class="amount">${euro(value)}</span></div>`).join('') + `<div class="budget-row budget-sum"><span>Totaal voor 4 reizigers</span><span class="amount">${euro(total)}</span></div>`;
let angle = 0;
document.querySelector('.budget-ring').style.background = `conic-gradient(${budget.map(([,value,color]) => { const start=angle; angle+=value/total*100; return `${color} ${start}% ${angle}%`; }).join(',')})`;
