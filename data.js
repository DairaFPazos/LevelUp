export const MOODS = [
  { id: 'great', label: 'Genial', emoji: '😄' },
  { id: 'good', label: 'Bien', emoji: '🙂' },
  { id: 'okay', label: 'Normal', emoji: '😐' },
  { id: 'low', label: 'Bajón', emoji: '😕' },
  { id: 'rough', label: 'Agotado', emoji: '😣' }
];

export const ACTIONS = {
  great: [
    { icon: '💚', title: 'Compartí algo bueno', desc: 'Mandale un mensaje a alguien que quieras.', xp: 12, energy: 4 },
    { icon: '☀️', title: 'Tomá aire', desc: 'Salí 5 minutos y mirá el cielo.', xp: 10, energy: 5 },
    { icon: '🎯', title: 'Elegí una mini meta', desc: 'Definí una sola cosa importante para hoy.', xp: 14, energy: 3 }
  ],
  good: [
    { icon: '💧', title: 'Recargá', desc: 'Tomá agua y hacé una pausa de 3 minutos.', xp: 10, energy: 6 },
    { icon: '🎵', title: 'Una canción', desc: 'Poné una canción que te active.', xp: 8, energy: 5 },
    { icon: '🚶', title: 'Caminata breve', desc: 'Caminá 7 minutos sin mirar el celular.', xp: 14, energy: 8 }
  ],
  okay: [
    { icon: '☀️', title: 'Luz natural', desc: 'Buscá luz del día durante 5 minutos.', xp: 14, energy: 8 },
    { icon: '✨', title: 'Ordená una cosa', desc: 'Dejá un solo espacio mejor que antes.', xp: 16, energy: 5 },
    { icon: '🌬️', title: 'Respirá', desc: 'Hacé 10 respiraciones lentas.', xp: 12, energy: 7 }
  ],
  low: [
    { icon: '🚿', title: 'Reset rápido', desc: 'Lavarte la cara o una ducha corta.', xp: 18, energy: 10 },
    { icon: '🌿', title: 'Cinco minutos afuera', desc: 'Salí, aunque sea a la vereda o balcón.', xp: 20, energy: 12 },
    { icon: '⚡', title: 'La tarea más chica', desc: 'Hacé algo que lleve menos de 2 minutos.', xp: 16, energy: 8 }
  ],
  rough: [
    { icon: '❤️', title: 'Cuidá lo básico', desc: 'Agua + algo de comer + una pausa.', xp: 20, energy: 14 },
    { icon: '🌬️', title: 'Bajá un cambio', desc: 'Respirá lento durante 2 minutos.', xp: 18, energy: 10 },
    { icon: '💬', title: 'Conectá', desc: 'Escribile a alguien: “Hoy estoy medio bajón”.', xp: 24, energy: 12 }
  ]
};

export const GOALS = [
  { id: 'read', cat: 'mind', icon: '📖', title: 'Leer más', desc: 'Construí el hábito sin exigir sesiones largas.', steps: [
    { title: 'Leer 5 páginas', desc: 'Un capítulo o unas pocas páginas.', xp: 35, energy: 6, damage: 5 },
    { title: 'Leer 10 páginas', desc: 'Subí un poco el desafío.', xp: 55, energy: 8, damage: 10 },
    { title: 'Leer 20 páginas', desc: 'Una sesión más profunda.', xp: 85, energy: 10, damage: 20 }
  ] },
  { id: 'move', cat: 'health', icon: '🏋️', title: 'Moverme más', desc: 'Convertí el movimiento en algo fácil de repetir.', steps: [
    { title: 'Caminar 10 minutos', desc: 'Sin necesidad de entrenar.', xp: 30, energy: 8, damage: 20 },
    { title: 'Hacer 10 minutos de ejercicio', desc: 'Una mini sesión cuenta.', xp: 45, energy: 12, damage: 35 },
    { title: 'Entrenar 20 minutos', desc: 'Subí la duración cuando estés listo.', xp: 80, energy: 18, damage: 50 }
  ] },
  { id: 'focus', cat: 'mind', icon: '🧠', title: 'Estudiar / aprender', desc: 'Avanzá aunque tengas poco tiempo.', steps: [
    { title: 'Estudiar 10 minutos', desc: 'Solo empezar ya suma.', xp: 35, energy: 4, damage: 15 },
    { title: 'Completar una lección', desc: 'Una unidad concreta.', xp: 60, energy: 8, damage: 30 },
    { title: 'Estudiar 45 minutos', desc: 'Bloque de foco completo.', xp: 100, energy: 14, damage: 55 }
  ] },
  { id: 'space', cat: 'life', icon: '✨', title: 'Ordenar mi espacio', desc: 'Menos caos, menos fricción mental.', steps: [
    { title: 'Ordenar durante 5 minutos', desc: 'Poné un timer y frená cuando suene.', xp: 25, energy: 5, damage: 15 },
    { title: 'Ordenar una superficie', desc: 'Escritorio, mesa o una repisa.', xp: 40, energy: 7, damage: 30 },
    { title: 'Ordenar una habitación', desc: 'Un reset completo.', xp: 75, energy: 12, damage: 55 }
  ] },
  { id: 'create', cat: 'creative', icon: '🎨', title: 'Crear algo', desc: 'Dale espacio a una idea propia.', steps: [
    { title: 'Crear durante 5 minutos', desc: 'Dibujo, música, código o escritura.', xp: 30, energy: 5, damage: 15 },
    { title: 'Terminar una mini pieza', desc: 'Algo pequeño pero terminado.', xp: 60, energy: 10, damage: 35 },
    { title: 'Trabajar 30 minutos en un proyecto', desc: 'Un bloque creativo real.', xp: 95, energy: 14, damage: 55 }
  ] },
  { id: 'connect', cat: 'social', icon: '❤️', title: 'Conectar con alguien', desc: 'Pequeñas acciones que sostienen vínculos.', steps: [
    { title: 'Mandar un mensaje', desc: 'Preguntale a alguien cómo está.', xp: 20, energy: 3, damage: 15 },
    { title: 'Hacer una llamada', desc: 'Una charla sin multitasking.', xp: 45, energy: 5, damage: 30 },
    { title: 'Planear un encuentro', desc: 'Convertí la intención en un plan.', xp: 70, energy: 6, damage: 55 }
  ] },
  { id: 'sleep', cat: 'health', icon: '🌙', title: 'Dormir mejor', desc: 'Pequeños cambios para cuidar tu descanso.', steps: [
    { title: 'Dejar el celular 10 minutos antes', desc: 'Probá una mini pausa sin pantalla.', xp: 25, energy: 4, damage: 15 },
    { title: 'Preparar la noche', desc: 'Dejá listo lo que necesites mañana.', xp: 45, energy: 6, damage: 30 },
    { title: 'Rutina sin pantallas', desc: '30 minutos de cierre del día.', xp: 75, energy: 10, damage: 55 }
  ] },
  { id: 'finance', cat: 'life', icon: '💰', title: 'Ordenar mis finanzas', desc: 'Sacale fricción a tu dinero con acciones pequeñas.', steps: [
    { title: 'Registrar un gasto', desc: 'Anotá un gasto que hayas hecho hoy.', xp: 20, energy: 2, damage: 15 },
    { title: 'Revisar mis gastos', desc: 'Mirá en qué se fue tu dinero.', xp: 45, energy: 4, damage: 30 },
    { title: 'Armar un mini presupuesto', desc: 'Definí tus próximos gastos principales.', xp: 80, energy: 6, damage: 55 }
  ] },
  { id: 'screen', cat: 'life', icon: '📵', title: 'Usar menos el celular', desc: 'Recuperá atención sin intentar cambiar todo de golpe.', steps: [
    { title: '10 minutos sin celular', desc: 'Dejalo lejos durante una tarea.', xp: 20, energy: 3, damage: 15 },
    { title: '30 minutos sin pantalla', desc: 'Probá una pausa más larga.', xp: 45, energy: 5, damage: 30 },
    { title: 'Una hora desconectado', desc: 'Elegí un bloque para estar presente.', xp: 80, energy: 8, damage: 55 }
  ] },
  { id: 'write', cat: 'creative', icon: '✍️', title: 'Escribir más', desc: 'Convertí ideas sueltas en algo concreto.', steps: [
    { title: 'Escribir 3 líneas', desc: 'No edites. Solo empezá.', xp: 20, energy: 3, damage: 15 },
    { title: 'Escribir 100 palabras', desc: 'Una idea completa en pequeño.', xp: 45, energy: 5, damage: 30 },
    { title: 'Escribir 500 palabras', desc: 'Un bloque creativo más profundo.', xp: 80, energy: 9, damage: 55 }
  ] },
  { id: 'language', cat: 'mind', icon: '🌎', title: 'Aprender un idioma', desc: 'Un poco de práctica también construye fluidez.', steps: [
    { title: 'Practicar 5 minutos', desc: 'Palabras, audio o una app.', xp: 20, energy: 3, damage: 15 },
    { title: 'Aprender 10 palabras', desc: 'Sumá vocabulario nuevo.', xp: 40, energy: 5, damage: 30 },
    { title: 'Practicar 30 minutos', desc: 'Una sesión completa.', xp: 75, energy: 9, damage: 55 }
  ] }
];

export const CATS = [['health','Cuerpo'],['mind','Mente'],['life','Vida'],['creative','Creatividad'],['social','Vínculos']];
export const ACH = [
  ['first','Primer paso','Completá tu primera misión.','🚩'],
  ['week','Una semana','Mantené una racha de 7 días.','🔥'],
  ['xp500','500 XP','Acumulá 500 XP.','⭐'],
  ['level3','Despegando','Llegá al nivel 3.','📈'],
  ['three','Multiclase','Probá 3 tipos de objetivos.','🏆'],
  ['boss','Cazador de bosses','Derrotá tu primer Boss.','⚔️']
];

export const BOSSES = [
  { id:'procrastinator', name:'El Procrastinador', subtitle:'Siempre hay mañana…', icon:'⏳', color:'#c9f36a', desc:'Se alimenta de todo lo que venís postergando.' },
  { id:'chaos', name:'La Bestia del Caos', subtitle:'Todo pendiente. Todo a la vez.', icon:'🌀', color:'#8de0ff', desc:'Crece cuando las pequeñas cosas se acumulan.' },
  { id:'scroll', name:'El Devorador de Tiempo', subtitle:'“Solo cinco minutos más…”', icon:'📱', color:'#ff9a8b', desc:'Se hace más fuerte cada vez que perdés el foco.' }
];
