import { MOODS, ACTIONS, GOALS, CATS, ACH, BOSSES } from './data.js';
import { today, loadState, saveState, resetState, safeAdd } from './state.js';

let state = loadState();
let tab = 'today';
let goalFilter = 'all';

const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const currentCheckin = () => state.checkins[today()] || null;
const currentEnergy = () => Math.min(100, Math.max(1, Number(currentCheckin()?.energy ?? state.energy) || 1));
const level = () => Math.floor(state.xp / 500) + 1;
const pct = () => Math.min(100, (state.xp % 500) / 5);
const xpToNext = () => 500 - (state.xp % 500 || 0);
const mood = () => MOODS.find(m => m.id === (currentCheckin()?.mood || state.mood)) || MOODS[1];
const activeBoss = () => state.boss && !state.boss.defeated ? state.boss : null;

function streak() {
  let count = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (!state.checkins[key]) break;
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function iconButton(icon, label, active, action) {
  return `<button class="nav-btn ${active ? 'active' : ''}" data-action="${action}"><span>${icon}</span><b>${label}</b></button>`;
}

function render() {
  if (state.onboard) return renderOnboarding();
  document.getElementById('app').innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand"><div class="brand-mark">⚡</div><div><b>LevelUp</b><span>Life</span></div></div>
        <nav>${iconButton('⌂','Hoy',tab==='today','today')}${iconButton('◎','Objetivos',tab==='goals','goals')}${iconButton('🏆','Progreso',tab==='progress','progress')}</nav>
        <div class="sidebar-bottom">
          <div class="mini-level"><div><span>Nivel ${level()}</span><b>${state.xp} XP</b></div><div class="progress"><i style="width:${pct()}%"></i></div><small>${xpToNext()} XP para nivel ${level()+1}</small></div>
          <button class="nav-btn" data-action="settings"><span>⚙</span><b>Ajustes</b></button>
        </div>
      </aside>
      <main class="main">
        <header class="topbar"><div class="mobile-brand">⚡ <b>LevelUp</b></div><div class="date">${new Intl.DateTimeFormat('es-AR',{weekday:'long',day:'numeric',month:'long'}).format(new Date())}</div><button class="avatar" data-action="profile">${esc((state.name || '?')[0].toUpperCase())}</button></header>
        ${tab==='today' ? todayView() : tab==='goals' ? goalsView() : progressView()}
      </main>
    </div>`;
  bind();
}

function todayView() {
  const m = mood();
  const done = Object.keys(state.completed).filter(k => k.startsWith(today())).length;
  const active = state.goals.map(id => GOALS.find(g => g.id === id)).filter(Boolean);
  return `<div class="page">
    <section class="welcome"><div><div class="eyebrow">${streak()>1?'DÍA · RACHA DE '+streak():'TU PUNTO DE PARTIDA'}</div><h1>Hola, ${esc(state.name)} <span>✦</span></h1><p>No necesitás un día perfecto. Solo una acción que te acerque.</p></div><button class="checkin-button" data-action="checkin"><strong>⚡ ${currentEnergy()}</strong> Actualizar energía</button></section>
    <div class="dashboard-grid">
      <section class="card level-card"><div class="card-label">TU NIVEL</div><div class="level-row"><div class="level-number">${level()}</div><div><h3>En construcción</h3><p>${xpToNext()} XP para el siguiente nivel</p></div></div><div class="progress"><i style="width:${pct()}%"></i></div><div class="level-foot"><span>${state.xp} XP total</span><span>${Math.round(pct())}%</span></div></section>
      <section class="card mood-card"><div class="card-label">MOOD DE HOY</div><div class="mood-row"><div class="mood-emoji">${m.emoji}</div><div><h3>${m.label}</h3><p>Elegimos acciones según cómo llegaste hoy.</p></div></div><button class="text-button" data-action="checkin">Cambiar mood →</button></section>
    </div>
    ${activeBoss() ? bossCard(activeBoss()) : bossTeaser()}
    <section class="section-heading"><div><div class="eyebrow">MICRO-MISIONES</div><h2>Una mejora pequeña también cuenta.</h2></div><span class="counter">✓ ${done} hechas hoy</span></section>
    <section class="actions-grid">${ACTIONS[m.id].map((a,i)=>actionCard(a,i)).join('')}</section>
    <section class="section-heading"><div><div class="eyebrow">TUS OBJETIVOS</div><h2>Elegí qué querés construir.</h2></div><button class="ghost" data-action="goals">Ver objetivos →</button></section>
    ${active.length ? `<div class="goal-list">${active.slice(0,3).map(goalCard).join('')}</div>` : `<div class="empty-goals card"><div class="empty-icon">◎</div><div><b>Todavía no elegiste un objetivo.</b><p>Elegí algo que quieras mejorar y empezá por el nivel 1.</p></div><button class="primary small" data-action="goals">Elegir objetivo</button></div>`}
  </div>`;
}

function actionCard(a, i) {
  const id = `${today()}-mood-${i}`;
  const done = Boolean(state.completed[id]);
  return `<article class="action-card ${done?'done':''}">
    <div class="action-icon">${a.icon}</div><div class="action-copy"><b>${a.title}</b><span>${a.desc}</span></div>
    <div class="reward"><strong>+${a.xp}</strong><small>XP</small><em>+${a.energy} ⚡</em></div>
    <button class="primary small complete-button" data-action="mood" data-id="${i}" ${done?'disabled':''}>${done?'✓ Completada':'✓ Completar misión'}</button>
  </article>`;
}

function goalCard(g) {
  const idx = g.steps.findIndex((s,i) => !state.completed[`${today()}-${g.id}-${i}`]);
  const stepIndex = idx < 0 ? g.steps.length - 1 : idx;
  const s = g.steps[stepIndex];
  const done = Boolean(state.completed[`${today()}-${g.id}-${stepIndex}`]);
  return `<article class="goal-card card"><div class="goal-card-icon">${g.icon}</div><div class="goal-card-main"><div class="goal-card-title"><b>${g.title}</b><span>Nivel ${stepIndex+1}</span></div><p>${s.title}</p><small>${s.desc}</small></div><button class="primary small ${done?'completed':''}" data-action="step" data-goal="${g.id}" data-step="${stepIndex}" ${done?'disabled':''}>${done?'✓ Hecho':'✓ Completar misión'}</button></article>`;
}

function bossTeaser() {
  return `<section class="boss-teaser card"><div><div class="eyebrow">⚔️ OPCIONAL</div><h2>¿Querés un Boss?</h2><p>Convertí uno de tus objetivos en una batalla. No es obligatorio.</p></div><button class="primary small" data-action="boss-setup">Elegir Boss →</button></section>`;
}

function bossCard(boss) {
  const def = BOSSES.find(b => b.id === boss.type) || BOSSES[0];
  const hp = Math.max(0, Number(boss.hp) || 0);
  const max = Math.max(1, Number(boss.maxHp) || 100);
  const progress = Math.min(100, Math.max(0, (1 - hp/max) * 100));
  const stage = hp <= max/3 ? 3 : hp <= max*2/3 ? 2 : 1;
  return `<section class="boss-card card stage-${stage}" style="--boss-color:${def.color}">
    <div class="boss-header"><div><div class="eyebrow">⚔️ BOSS ACTIVO · OPCIONAL</div><h2>${def.name}</h2><p>${def.subtitle}</p></div><button class="ghost danger-text" data-action="boss-abandon">Abandonar</button></div>
    <div class="boss-arena"><div class="boss-illustration">${bossSvg(def.id, stage)}</div><div class="boss-stats"><div class="boss-hp"><span>VIDA DEL BOSS</span><b>${hp} / ${max}</b></div><div class="boss-bar"><i style="width:${Math.max(0,100-progress)}%"></i></div><div class="hearts">${[0,1,2,3,4].map((_,i)=>`<span class="${i < Math.ceil(hp/max*5) ? 'alive':''}">♥</span>`).join('')}</div><p>${stage===1?'Todavía está fresco. Seguí atacando.':stage===2?'¡Ya está herido! Unas pocas misiones más.':'¡Está a punto de caer!'}</p></div></div>
  </section>`;
}

function bossSvg(type, stage) {
  const damaged = stage >= 2;
  const critical = stage === 3;
  const face = critical ? '😵' : damaged ? '😠' : '😈';
  if (type === 'chaos') return `<svg viewBox="0 0 220 180" aria-label="Boss Bestia del Caos" role="img"><path class="boss-body" d="M44 134C26 98 38 43 81 30c38-12 81 9 91 46 11 40-10 71-42 82-36 13-68 7-86-24Z"/><path class="boss-horn" d="M58 52 36 18l36 21M160 52l24-34-36 21"/><circle class="boss-eye" cx="87" cy="82" r="8"/><circle class="boss-eye" cx="139" cy="82" r="8"/><path class="boss-mouth" d="M83 113Q112 ${critical?'132':damaged?'123':'118'} 147 110"/><path class="crack ${damaged?'visible':''}" d="M114 41l-8 34 14 11-13 31"/><path class="scar ${critical?'visible':''}" d="M62 70l22 23M158 70l-20 24"/><text x="110" y="164" text-anchor="middle">${face}</text></svg>`;
  if (type === 'scroll') return `<svg viewBox="0 0 220 180" aria-label="Boss Devorador de Tiempo" role="img"><path class="boss-body" d="M57 137c-13-31-10-77 14-96 24-20 68-18 86 8 19 28 11 76-12 92-25 17-75 19-88-4Z"/><rect class="boss-phone" x="78" y="54" width="64" height="82" rx="9"/><circle class="boss-eye" cx="92" cy="83" r="6"/><circle class="boss-eye" cx="128" cy="83" r="6"/><path class="boss-mouth" d="M94 105Q110 ${critical?'121':damaged?'116':'109'} 128 105"/><path class="crack ${damaged?'visible':''}" d="M60 61l22 17M157 51l-18 25"/><path class="scar ${critical?'visible':''}" d="M69 106l18-16M150 103l-18-18"/><text x="110" y="164" text-anchor="middle">${face}</text></svg>`;
  return `<svg viewBox="0 0 220 180" aria-label="Boss Procrastinador" role="img"><path class="boss-body" d="M47 137c-8-35 4-79 32-96 30-18 72-11 91 17 18 27 13 68-10 88-24 21-104 24-113-9Z"/><path class="boss-horn" d="M70 49 58 17l28 23M149 47l14-30 14 35"/><circle class="boss-eye" cx="87" cy="81" r="8"/><circle class="boss-eye" cx="137" cy="81" r="8"/><path class="boss-mouth" d="M83 109Q110 ${critical?'127':damaged?'120':'115'} 146 109"/><path class="crack ${damaged?'visible':''}" d="M107 37l-12 31 13 15-12 32"/><path class="scar ${critical?'visible':''}" d="M67 72l22 18M151 68l-20 23"/><text x="110" y="164" text-anchor="middle">${face}</text></svg>`;
}

function goalsView() {
  return `<div class="page"><section class="page-title"><div><div class="eyebrow">OBJETIVOS</div><h1>Construí tu propia progresión.</h1><p>Elegí áreas que quieras mejorar. Cada una empieza con acciones pequeñas.</p></div></section><div class="category-tabs"><button class="${goalFilter==='all'?'active':''}" data-filter="all">Todos</button>${CATS.map(c=>`<button class="${goalFilter===c[0]?'active':''}" data-filter="${c[0]}">${c[1]}</button>`).join('')}</div><div class="goals-grid">${GOALS.filter(g=>goalFilter==='all'||g.cat===goalFilter).map(goalSetup).join('')}</div></div>`;
}

function goalSetup(g) {
  const selected = state.goals.includes(g.id);
  const bossForGoal = activeBoss()?.goalId === g.id;
  return `<article class="goal-setup ${selected?'selected':''}" data-cat="${g.cat}"><div class="goal-top"><div class="goal-icon">${g.icon}</div><button class="select-pill ${selected?'selected':''}" data-action="toggle" data-goal="${g.id}">${selected?'✓ En curso':'+ Sumar'}</button></div><h3>${g.title}</h3><p>${g.desc}</p><div class="step-line"><span>PROGRESIÓN</span><span>3 niveles</span></div><div class="steps">${g.steps.map((s,i)=>{const done=Boolean(state.completed[`${today()}-${g.id}-${i}`]);const previousDone=i===0||Boolean(state.completed[`${today()}-${g.id}-${i-1}`]);const unlocked=selected&&previousDone&&!done;return `<div class="step ${done?'done':''} ${!unlocked&&!done?'locked':''}"><span class="step-num">${i+1}</span><span class="step-info"><b>${s.title}</b><small>${s.desc}</small></span><span class="step-xp">+${s.xp} XP</span>${unlocked ? `<button class="mini-complete" data-action="step" data-goal="${g.id}" data-step="${i}">Completar</button>` : done ? '<span class="step-done">✓</span>' : '<span class="step-lock">🔒</span>'}</div>`}).join('')}</div>${selected ? `<button class="boss-launch ${bossForGoal?'active':''}" data-action="boss-setup" data-goal="${g.id}">${bossForGoal?'⚔️ Boss activo':'⚔️ Activar Boss opcional'}</button>` : '<small class="hint">🔒 Sumalo para desbloquear las misiones</small>'}</article>`;
}

function progressView() {
  const cats = new Set(state.goals.map(id=>GOALS.find(g=>g.id===id)?.cat).filter(Boolean)).size;
  return `<div class="page"><section class="page-title"><div><div class="eyebrow">PROGRESO</div><h1>Tu progreso, sin compararte.</h1><p>El objetivo es que puedas ver que estás avanzando, incluso cuando el avance es chico.</p></div></section><div class="stats-grid"><div class="stat card"><span>⚡</span><b>${state.xp}</b><small>XP acumulada</small></div><div class="stat card"><span>🔥</span><b>${streak()}</b><small>días de racha</small></div><div class="stat card"><span>✓</span><b>${Object.keys(state.completed).length}</b><small>misiones hechas</small></div><div class="stat card"><span>◎</span><b>${cats}</b><small>áreas exploradas</small></div></div><section class="roadmap card"><div class="roadmap-head"><div><div class="card-label">TU CAMINO</div><h2>Nivel ${level()}</h2></div><div class="big-xp">${state.xp} <span>XP</span></div></div><div class="progress"><i style="width:${pct()}%"></i></div><div class="roadmap-levels">${[1,2,3,4,5].map(n=>`<div class="${level()>=n?'reached':''}"><div class="level-node">${level()>=n?'✓':'·'}</div><span>Nivel ${n}</span></div>`).join('')}</div></section><section class="achievements"><div class="section-heading"><div><div class="eyebrow">LOGROS</div><h2>Pequeñas pruebas de constancia.</h2></div></div><div class="achievement-grid">${ACH.map(a=>`<div class="achievement card ${state.achievements.includes(a[0])?'unlocked':''}"><div class="achievement-icon">${a[3]}</div><div><b>${a[1]}</b><p>${a[2]}</p></div><span>${state.achievements.includes(a[0])?'✓':'🔒'}</span></div>`).join('')}</div></section></div>`;
}

function renderOnboarding() {
  document.getElementById('app').innerHTML = `<div class="onboarding"><div class="onboard-card"><div class="hero-orb">⚡</div><div class="eyebrow">TU VIDA, PERO CON XP</div><h1>Primero, <em>conocete.</em></h1><p>¿Cómo te llamás? Vamos a usar tu nombre para que cada partida se sienta tuya.</p><input id="nameInput" class="name-input" maxlength="24" placeholder="Tu nombre" autocomplete="given-name"><button class="primary big" id="startBtn">Empezar →</button><small>Tu progreso se guarda en este dispositivo.</small></div></div>`;
  const input = document.getElementById('nameInput');
  input.focus();
  document.getElementById('startBtn').onclick = () => {
    const name = input.value.trim();
    if (!name) { input.focus(); input.classList.add('invalid'); return; }
    state.name = name; state.onboard = false; state.checkins[today()] = { energy: state.energy, mood: state.mood }; saveState(state); render();
  };
}

function bind() {
  document.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', () => handle(btn.dataset.action, btn)));
  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => { goalFilter = btn.dataset.filter; render(); }));
}

function handle(action, button) {
  if (['today','goals','progress'].includes(action)) { tab = action; render(); return; }
  if (action === 'checkin') return checkinModal();
  if (action === 'mood') return completeMood(Number(button.dataset.id));
  if (action === 'step') return completeStep(button.dataset.goal, Number(button.dataset.step));
  if (action === 'toggle') return toggleGoal(button.dataset.goal);
  if (action === 'boss-setup') return bossSetupModal(button.dataset.goal || activeBoss()?.goalId);
  if (action === 'boss-abandon') return abandonBoss();
  if (action === 'settings') return settingsModal();
  if (action === 'profile') return profileModal();
}

function addReward({ xp, energy, label, damage = 0 }) {
  const oldLevel = level();
  const safeXp = Math.max(0, Number(xp) || 0);
  const safeEnergy = Number(energy) || 0;
  state.xp = Math.max(0, Math.floor(safeAdd(state.xp, safeXp)));
  state.energy = Math.min(100, Math.max(1, Math.floor(safeAdd(state.energy, safeEnergy))));
  const checkin = currentCheckin();
  if (checkin) {
    checkin.energy = state.energy;
    state.checkins[today()] = checkin;
  }
  if (state.boss && !state.boss.defeated && damage > 0) {
    state.boss.hp = Math.max(0, (Number(state.boss.hp) || 0) - damage);
    if (state.boss.hp <= 0) defeatBoss();
  }
  unlock(); saveState(state); render(); toast(`+${safeXp} XP · +${safeEnergy} energía · ${label}`, 'success');
  if (level() > oldLevel) setTimeout(() => levelUpToast(level()), 250);
}

function completeMood(index) {
  const action = ACTIONS[mood().id]?.[index];
  if (!action) return;
  const id = `${today()}-mood-${index}`;
  if (state.completed[id]) return toast('Ya completaste esta misión.', 'info');
  state.completed[id] = true;
  addReward({ xp: action.xp, energy: action.energy, label: action.title });
}

function completeStep(goalId, stepIndex) {
  const goal = GOALS.find(g=>g.id===goalId); const step = goal?.steps[stepIndex];
  if (!goal || !step || !state.goals.includes(goalId)) return;
  const id = `${today()}-${goalId}-${stepIndex}`;
  if (state.completed[id]) return toast('Ya completaste esta misión.', 'info');
  state.completed[id] = true;
  addReward({ xp: step.xp, energy: step.energy, damage: activeBoss()?.goalId === goalId ? step.damage : 0, label: step.title });
}

function toggleGoal(id) {
  state.goals = state.goals.includes(id) ? state.goals.filter(x=>x!==id) : [...state.goals,id];
  saveState(state); render();
}

function unlock() {
  const add = id => { if (!state.achievements.includes(id)) state.achievements.push(id); };
  if (Object.keys(state.completed).length >= 1) add('first');
  if (state.xp >= 500) add('xp500');
  if (level() >= 3) add('level3');
  if (state.goals.length >= 3) add('three');
  if (streak() >= 7) add('week');
  if (state.defeatedBosses.length >= 1) add('boss');
}

function checkinModal() {
  const m = mood(); const e = currentEnergy();
  modal(`<h2>Check-in</h2><p>¿Cómo llegás a este momento?</p><div class="checkin-energy"><div><span>Energía</span><b id="ev">${e}<small>/100</small></b></div><input id="energyRange" type="range" min="1" max="100" value="${e}"><div class="range-labels"><span>Bajísima</span><span>Alta</span></div></div><div class="modal-section"><div class="modal-label">MOOD <span>OPCIONAL</span></div><div class="mood-modal-grid">${MOODS.map(x=>`<button class="${x.id===m.id?'selected':''}" data-mood="${x.id}">${x.emoji}<b>${x.label}</b></button>`).join('')}</div></div><button class="primary full" id="saveCheck">Guardar check-in ✓</button>`);
  let chosen = m.id;
  document.querySelectorAll('[data-mood]').forEach(x=>x.onclick=()=>{chosen=x.dataset.mood;document.querySelectorAll('[data-mood]').forEach(y=>y.classList.remove('selected'));x.classList.add('selected');});
  document.getElementById('energyRange').oninput=e=>document.getElementById('ev').innerHTML=e.target.value+'<small>/100</small>';
  document.getElementById('saveCheck').onclick=()=>{state.energy=Number(document.getElementById('energyRange').value);state.mood=chosen;state.checkins[today()]={energy:state.energy,mood:chosen};saveState(state);closeModal();render();toast('Check-in guardado. Hoy ya tiene un punto de partida.','info');};
}

function bossSetupModal(goalId) {
  if (!goalId) { toast('Primero elegí un objetivo.', 'info'); tab='goals'; render(); return; }
  if (activeBoss()) { toast('Ya tenés un Boss activo. Derrotalo o abandonalo antes de elegir otro.', 'info'); return; }
  const goal = GOALS.find(g=>g.id===goalId); if (!goal) return;
  modal(`<h2>Elegí tu enemigo</h2><p>Es opcional. Convertí <b>${esc(goal.title)}</b> en una batalla.</p><div class="boss-choice-grid">${BOSSES.map(b=>`<button class="boss-choice" data-boss="${b.id}"><div class="boss-choice-art">${bossSvg(b.id,1)}</div><b>${b.name}</b><span>${b.subtitle}</span></button>`).join('')}</div><div class="boss-config"><label>${goal.id==='read'?'¿Cuántas páginas tiene tu libro?':'¿Qué tan grande querés que sea el desafío?'}</label>${goal.id==='read'?'<input id="bossTarget" type="number" min="20" max="3000" value="200" placeholder="Ej. 240">':'<select id="bossTarget"><option value="100">Normal · 100 HP</option><option value="150">Difícil · 150 HP</option><option value="200">Épico · 200 HP</option></select>'}</div><button class="primary full" id="activateBoss">⚔️ Activar Boss</button>`);
  let selected = BOSSES[0].id;
  document.querySelectorAll('[data-boss]').forEach(x=>x.onclick=()=>{selected=x.dataset.boss;document.querySelectorAll('[data-boss]').forEach(y=>y.classList.remove('selected'));x.classList.add('selected');});
  document.getElementById('activateBoss').onclick=()=>{
    const target = Math.max(20, Number(document.getElementById('bossTarget').value) || 100);
    state.boss = { type:selected, goalId, maxHp:target, hp:target, defeated:false };
    saveState(state); closeModal(); tab='today'; render(); toast('Boss activado. Que empiece la batalla. ⚔️','success');
  };
}

function defeatBoss() {
  if (!state.boss) return;
  const defeated = state.boss.type;
  state.boss.defeated = true;
  state.defeatedBosses.push(defeated);
  state.xp = safeAdd(state.xp, 200);
  unlock();
  saveState(state);
  setTimeout(()=>bossDefeatedModal(defeated), 180);
}

function bossDefeatedModal(type) {
  const b = BOSSES.find(x=>x.id===type) || BOSSES[0];
  modal(`<div class="victory-modal"><div class="victory-art">${bossSvg(type,3)}</div><div class="eyebrow">⚔️ BOSS DERROTADO</div><h2>¡${b.name} cayó!</h2><p>Convertiste pequeñas acciones en un gran avance.</p><div class="victory-reward">+200 XP</div><button class="primary full" id="closeVictory">Seguir jugando →</button></div>`);
  document.getElementById('closeVictory').onclick=()=>{state.boss=null;saveState(state);closeModal();render();toast('Boss derrotado · +200 XP','success');};
}

function abandonBoss() {
  if (!confirm('¿Abandonar este Boss? Su progreso se perderá.')) return;
  state.boss=null; saveState(state); render(); toast('Boss abandonado. Podés activar otro cuando quieras.','info');
}

function modal(content) { document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><div class="modal"><button class="modal-close" id="closeModal">×</button>${content}</div></div>`); document.getElementById('closeModal').onclick=closeModal; }
function closeModal(){document.getElementById('modal')?.remove();}
function settingsModal(){modal(`<h2>Ajustes</h2><p>Preferencias de LevelUp Life.</p><div class="settings-list"><button class="danger" id="reset">↻ Reiniciar todo el progreso</button></div>`);document.getElementById('reset').onclick=()=>{resetState();location.reload();};}
function profileModal(){modal(`<h2>${esc(state.name)}</h2><p>Nivel ${level()} · ${state.xp} XP acumulada</p><div class="profile-big"><div class="avatar large">${esc(state.name[0].toUpperCase())}</div><div><b>Tu partida</b><p>Tu progreso vive localmente en este dispositivo.</p></div></div><div class="profile-note">✨ La idea no es hacer todo. Es hacer que empezar sea fácil.</div>`);}
function levelUpToast(n){toast(`LEVEL UP · Ahora sos nivel ${n} ✦`,'success');}
function toast(text,type){let x=document.querySelector('.toast');if(x)x.remove();document.body.insertAdjacentHTML('beforeend',`<div class="toast ${type}">✓ ${esc(text)}</div>`);setTimeout(()=>document.querySelector('.toast')?.remove(),2800);}

render();
