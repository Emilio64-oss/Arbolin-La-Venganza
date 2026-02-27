import { Skin, Difficulty, StoryPart } from './types';

export const CANVAS_WIDTH = 450;
export const CANVAS_HEIGHT = 800;
export const PLAYER_SPEED = 8;
export const FIRE_WIDTH = 40;
export const FIRE_HEIGHT = 50;

export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'normal', 'hard', 'extreme', 'hacker'];

export const DIFFICULTY_CONFIG: Record<Difficulty, { winScore: number; spawnRate: number; label: string; color: string }> = {
  easy: { winScore: 10, spawnRate: 60, label: 'Fácil', color: '#22c55e' },
  normal: { winScore: 20, spawnRate: 40, label: 'Medio', color: '#eab308' },
  hard: { winScore: 30, spawnRate: 25, label: 'Difícil', color: '#f97316' },
  extreme: { winScore: 50, spawnRate: 15, label: 'Extremo', color: '#ef4444' },
  hacker: { winScore: 100, spawnRate: 5, label: 'HACKER', color: '#a855f7' },
};

export const BANANA_CODES = {
  HARD: "BANANON",      // Se encuentra en el suelo de HARD
  EXTREME: "ARBOLOCO",  // Se encuentra en el suelo de EXTREME
  HACKER: "FRUTITA",    // Se encuentra en el suelo de HACKER
  CHEAT: "UNLOCKEDALL"  // Código maestro para desbloquear todo
};

export const SECRETS_CONFIG = [
  { id: 1, difficulty: 'normal', xMin: 0.85, yMax: 0.1, label: 'Esquina Superior Derecha' },
  { id: 2, difficulty: 'easy', xMax: 0.15, yMax: 0.1, label: 'Esquina Superior Izquierda' },
  { id: 3, difficulty: 'easy', xMax: 0.15, yMin: 0.9, label: 'Esquina Inferior Izquierda' },
  { id: 4, difficulty: 'hard', xMin: 0.85, yMin: 0.9, label: 'Esquina Inferior Derecha' },
  { id: 5, difficulty: 'hard', xMin: 0.4, xMax: 0.6, yMin: 0.4, yMax: 0.6, label: 'Centro del Bosque' },
  { id: 6, difficulty: 'extreme', xMin: 0.85, yMin: 0.85, label: 'Rincón del Fuego' },
  { id: 7, difficulty: 'normal', xMin: 0.4, xMax: 0.6, yMax: 0.15, label: 'Norte del Bosque' },
  { id: 8, difficulty: 'extreme', xMax: 0.15, yMax: 0.15, label: 'Origen de la Llama' },
  { id: 9, difficulty: 'hard', xMax: 0.15, yMin: 0.4, yMax: 0.6, label: 'Oeste del Bosque' },
  { id: 10, difficulty: 'easy', xMin: 0.85, yMin: 0.4, yMax: 0.6, label: 'Este del Bosque' }
];

export const FUEGORIN_STORY: StoryPart[] = [
  { id: 1, title: "El Nacimiento de la Chispa", difficultyReq: 'normal', hint: "Ve a la ESQUINA SUPERIOR DERECHA en dificultad MEDIO.", content: "Todo comenzó con una pequeña chispa, no más grande que una luciérnaga, que brotó de una piedra de pedernal golpeada por un viajero descuidado. Fuegorín no nació con maldad; nació con frío. En sus primeros instantes de conciencia, miró a los árboles gigantes que lo rodeaban, buscando refugio del viento que amenazaba con extinguir su frágil existencia. Solo quería ser parte del bosque, pero el bosque le temía." },
  { id: 2, title: "El Abrazo Prohibido", difficultyReq: 'easy', hint: "Ve a la ESQUINA SUPERIOR IZQUIERDA en dificultad FÁCIL.", content: "Durante semanas, Fuegorín vagó por el sotobosque, observando cómo Arbolín y sus hermanos entrelazaban sus raíces en un abrazo comunal. La envidia lo carcomía. Una noche, desesperado por sentir esa conexión, intentó abrazar a un viejo roble dormido. El resultado fue catastrófico: el roble gritó en silencio mientras su corteza se ennegrecía. Fuegorín retrocedió horrorizado, comprendiendo por primera vez su naturaleza maldita: su toque no era amor, era muerte." },
  { id: 3, title: "El Exilio de Ceniza", difficultyReq: 'easy', hint: "Ve a la ESQUINA INFERIOR IZQUIERDA en dificultad FÁCIL.", content: "Los espíritus del bosque, liderados por el consejo de ancianos verdes, expulsaron a Fuegorín hacia las tierras baldías. Allí, solo y hambriento de combustible, su tristeza se transformó en un resentimiento ardiente. Se alimentó de matorrales secos y arbustos espinosos, creciendo en tamaño y temperatura. Ya no era una chispa inocente; ahora era una llama adolescente con un temperamento volátil y una promesa oscura grabada en su núcleo." },
  { id: 4, title: "La Ira Incontenible", difficultyReq: 'hard', hint: "Ve a la ESQUINA INFERIOR DERECHA en dificultad DIFÍCIL.", content: "Fuegorín descubrió que el dolor le daba fuerza. Cada vez que recordaba el rechazo de Arbolín, su fuego cambiaba de naranja a un azul intenso. Juró que si no podía ser parte del bosque, el bosque sería parte de él, convertido en ceniza y humo. Comenzó a reclutar a otras llamas perdidas, brasas olvidadas de fogatas antiguas, formando un ejército crepitante listo para marchar sobre el valle verde." },
  { id: 5, title: "La Declaración de Guerra", difficultyReq: 'hard', hint: "Párate en el CENTRO EXACTO del mapa en dificultad DIFÍCIL.", content: "La invasión comenzó al amanecer. Fuegorín, ahora un incendio forestal personificado, se plantó en el límite del bosque y rugió, lanzando columnas de humo negro al cielo. No buscaba perdón, buscaba sumisión. Arbolín, despertando de su letargo, vio el horizonte teñido de rojo y supo que la paz había terminado. La guerra elemental había comenzado, y solo uno quedaría en pie." }
];

export const ARBOLIN_STORY: StoryPart[] = [
  { id: 6, title: "El Despertar del Guardián", difficultyReq: 'extreme', hint: "Esquina inferior derecha en EXTREMO.", content: "Cuando el primer árbol cayó, yo desperté. No soy un solo árbol, soy la conciencia colectiva de cada hoja, cada raíz y cada rama de este bosque. Sentí el dolor agudo del fuego mordiendo mi piel de corteza. Me levanté de la tierra, sacudiendo siglos de sueño, y mis raíces se convirtieron en piernas fuertes como columnas. No pedí ser un guerrero, pero proteger la vida es el mandato más antiguo de la naturaleza." },
  { id: 7, title: "La Duda Existencial", difficultyReq: 'normal', hint: "Zona superior central en NORMAL.", content: "Mientras aplastaba las primeras llamas con mis ramas, una duda germinó en mi mente. ¿Acaso no somos nosotros, con nuestra sombra densa, quienes negamos la luz a los brotes más pequeños? ¿Es el fuego un monstruo o simplemente una fuerza necesaria para limpiar lo viejo y dar paso a lo nuevo? Miré a Fuegorín a los ojos y vi mi propio reflejo distorsionado por el calor. Quizás, en otro mundo, podríamos haber sido hermanos." },
  { id: 8, title: "Estrategia de Raíz", difficultyReq: 'extreme', hint: "Esquina superior izquierda en EXTREMO.", content: "El fuego es rápido y voraz, pero la madera es paciente y resistente. Entendí que no podía ganar solo con fuerza bruta. Comencé a lanzar brotes explosivos, semillas cargadas de vida concentrada que, al estallar, sofocaban las llamas con un crecimiento acelerado de musgo húmedo. Cada enemigo derrotado no era una muerte, sino una oportunidad para replantar. La batalla se convirtió en un ciclo de destrucción y creación instantánea." },
  { id: 9, title: "El Llanto del Bosque", difficultyReq: 'hard', hint: "Borde izquierdo en DIFÍCIL.", content: "El río se evaporaba bajo el calor de la batalla. Los animales huían despavoridos, y sus gritos eran como astillas en mi corazón. Fuegorín no parecía importarle; su risa crepitante llenaba el aire viciado. Comprendí entonces que no había negociación posible con el caos puro. Tuve que endurecer mi corteza y cerrar mis poros a la compasión. Para salvar el bosque, debía convertirme en algo tan implacable como el incendio mismo." },
  { id: 10, title: "El Juramento Eterno", difficultyReq: 'easy', hint: "Borde derecho en FÁCIL.", content: "La batalla puede terminar hoy, o puede durar mil años. Mientras quede una sola bellota fértil en este suelo, yo seguiré en pie. Arbolín no es solo un nombre, es una promesa. Si caigo, diez más se levantarán de mis restos. Bailaremos esta danza mortal con Fuegorín hasta el fin de los tiempos, manteniendo el frágil equilibrio entre el verde que respira y el rojo que consume." }
];

export const BANANA_STORY: StoryPart[] = [
  { id: 11, title: "La Anomalía Genética", difficultyReq: 'easy', hint: "Desbloquea con CÓDIGO 1 (Oculto en Difícil).", content: "Nadie sabe quién dejó caer ese frasco de 'Crecimiento Cuántico Experimental' sobre la cáscara de banana podrida en el linde del bosque. Quizás fue un científico viajero, o quizás fue pura casualidad cósmica. Lo cierto es que la cáscara no se descompuso. Al contrario, comenzó a vibrar, absorbiendo la radiación del sol y los minerales del suelo a una velocidad aterradora. La biología del bosque estaba a punto de cambiar para siempre." },
  { id: 12, title: "El Amarillo que Quema", difficultyReq: 'normal', hint: "Desbloquea con CÓDIGO 1 (Oculto en Difícil).", content: "Cuando Fuegorín pasó por esa zona, intentó incinerar la extraña fruta brillante. Para su sorpresa, el fuego resbaló sobre su superficie cerosa. La banana no solo era inmune al calor, sino que lo reflejaba. Fuegorín, confundido, atacó con más fuerza, pero la banana comenzó a emitir un zumbido de alta frecuencia y un olor dulce y empalagoso que mareaba a las llamas. Algo nuevo había entrado en la cadena alimenticia." },
  { id: 13, title: "La Plaga de Potasio", difficultyReq: 'normal', hint: "Desbloquea con CÓDIGO 2 (Oculto en Extremo).", content: "En cuestión de días, el bosque comenzó a mutar. Los pinos empezaron a curvarse, sus agujas se volvieron amarillas y suaves. El agua del río sabía a batido tropical. Las llamas de Fuegorín cambiaron, volviéndose viscosas y de color crema, quemando con un calor pegajoso como el caramelo hirviendo. La guerra entre el verde y el rojo se vio interrumpida por una tercera facción: el Imperio del Potasio." },
  { id: 14, title: "El Héroe Improbable", difficultyReq: 'hard', hint: "Desbloquea con CÓDIGO 2 (Oculto en Extremo).", content: "Arbolín sintió el cambio en su propia savia. Se sentía más... flexible. Más resbaladizo. Al mirarse en un charco de jarabe, vio que su corteza se había vuelto lisa y amarilla. Al principio sintió horror, pero pronto descubrió las ventajas. Podía deslizarse a velocidades increíbles y sus golpes tenían una elasticidad devastadora. Si el mundo se volvía una locura frutal, él sería el rey de esa locura." },
  { id: 15, title: "Rebelión en el Frutero", difficultyReq: 'hard', hint: "Desbloquea con CÓDIGO 3 (Oculto en Hacker).", content: "Las decoraciones del bosque cobraron vida. Pequeñas cerezas explosivas y piñas blindadas se unieron a la batalla. Fuegorín, ahora una masa de 'Flambé Viviente', estaba furioso pero fascinado. La guerra ya no era por supervivencia, era por sabor. El bosque se había convertido en una ensalada de frutas caótica donde las leyes de la física eran sugerencias opcionales." },
  { id: 16, title: "La Tiranía del Azúcar", difficultyReq: 'extreme', hint: "Desbloquea con CÓDIGO 3 (Oculto en Hacker).", content: "El aire era tan dulce que costaba respirar. Los animales, ahora obesos y lentos por el exceso de fructosa, rodaban en lugar de correr. Arbolín Banana se dio cuenta de que esta utopía amarilla era en realidad una prisión. La dulzura era adictiva, y tanto árboles como fuego estaban perdiendo su identidad, fundiéndose en una masa homogénea de postre universal." },
  { id: 17, title: "El Núcleo de la Fruta", difficultyReq: 'extreme', hint: "Desbloquea con CÓDIGO 3 (Oculto en Hacker).", content: "En el centro del bosque, la banana original pulsaba con luz cegadora. Era el corazón de la infección. Arbolín sabía que debía destruirla, o pelarla, para devolver el equilibrio al mundo. Pero una parte de él, esa parte nueva y amarilla, susurraba que el mundo era mejor así: suave, dulce y sin dolor. La lucha interna era más feroz que cualquier incendio." },
  { id: 18, title: "El Deslizamiento Final", difficultyReq: 'hacker', hint: "Completa la historia Banana.", content: "Fuegorín y Arbolín, enemigos eternos, se encontraron frente al Gran Fruto. Por un momento, cruzaron miradas. Ambos eran monstruos de azúcar ahora, caricaturas de lo que alguna vez fueron. Sin palabras, acordaron una tregua temporal. El fuego caramelizaría la cáscara mientras la madera golpeaba el núcleo. Era una maniobra arriesgada que podría terminar en una explosión de mermelada nuclear." },
  { id: 19, title: "La Gran Explosión Dulce", difficultyReq: 'hacker', hint: "Completa la historia Banana.", content: "El impacto fue ensordecedor. Una onda expansiva de puré cubrió el valle. Cuando el polvo (o el azúcar glass) se asentó, el bosque había recuperado sus colores normales, aunque todo estaba pegajoso. La banana gigante había desaparecido, dispersada en millones de partículas. Arbolín miró sus manos: corteza rugosa otra vez. Suspiró aliviado, aunque en el fondo, extrañaría poder deslizarse." },
  { id: 20, title: "Residuos Radiactivos", difficultyReq: 'hacker', hint: "Completa la historia Banana.", content: "Dicen que, en las noches más oscuras, si cavas profundo en la tierra del bosque, todavía puedes encontrar raíces amarillas que brillan. Y dicen que Fuegorín, a veces, escupe llamas con olor a vainilla. La infección se ha ido, pero el recuerdo permanece. El Modo Banana no es solo un juego, es una advertencia: demasiada dulzura puede ser letal." }
];

export const AVAILABLE_SKINS: Skin[] = [
  { id: 'default', name: 'Arbolín Original', color: '#22c55e', secondaryColor: '#4ade80', description: 'El inicio.', unlocked: true, unlockHint: 'Por defecto', type: 'arbolin' },
  { id: 'sakura', name: 'Cerezo Místico', color: '#ec4899', secondaryColor: '#fce7f3', description: 'Por modo Medio.', unlocked: false, unlockHint: 'Completa Medio', type: 'arbolin' },
  { id: 'autumn', name: 'Roble de Otoño', color: '#d97706', secondaryColor: '#fcd34d', description: 'Por modo Difícil.', unlocked: false, unlockHint: 'Completa Difícil', type: 'arbolin' },
  { id: 'golden', name: 'Arbolín Dorado', color: '#fbbf24', secondaryColor: '#ffffff', description: '50 brotes.', unlocked: false, unlockHint: '50 brotes', type: 'arbolin' },
  { id: 'void', name: 'El Vacío', color: '#1e1b4b', secondaryColor: '#818cf8', description: 'Maestro.', unlocked: false, unlockHint: 'Todas las dificultades', type: 'arbolin' },
  { id: 'ancient', name: 'Arbolín Ancestral', color: '#65a30d', secondaryColor: '#a78bfa', description: 'Superviviente.', unlocked: false, unlockHint: '120s supervivencia', type: 'arbolin' },
  { id: 'glitch', name: '0x_AR_ERR', color: '#000000', secondaryColor: '#22c55e', description: 'Hacker.', unlocked: false, unlockHint: 'Modo Hacker', type: 'arbolin' },
  { id: 'magma', name: 'Magma', color: '#7f1d1d', secondaryColor: '#ef4444', description: 'Extremo.', unlocked: false, unlockHint: 'Modo Extremo', type: 'fuegorin' },
  { id: 'peruano', name: 'El Peruano', color: '#000000', secondaryColor: '#ef4444', description: '50 veces quemado.', unlocked: false, unlockHint: '50 derrotas', type: 'fuegorin' },
  { id: 'venezolano', name: 'Venezolano', color: '#7f1d1d', secondaryColor: '#fbbf24', description: '50s Hacker.', unlocked: false, unlockHint: '50s sin comer', type: 'fuegorin' },
  { id: 'bolivia', name: 'Navegante', color: '#ef4444', secondaryColor: '#3b82f6', description: '25 derrotas Fuegorín.', unlocked: false, unlockHint: '25 derrotas Fuegorín', type: 'fuegorin' },
  { id: 'banana_hero', name: 'Banana Pro', color: '#fde047', secondaryColor: '#713f12', description: 'Héroe frutal.', unlocked: false, unlockHint: 'Modo Banana Activado', type: 'banana' },
  { id: 'banana_split', name: 'Banana Split', color: '#ffffff', secondaryColor: '#f472b6', description: 'Dulce victoria.', unlocked: false, unlockHint: '50 Canastas', type: 'banana' },
  { id: 'banana_rotten', name: 'Banana Podrida', color: '#4b5563', secondaryColor: '#1f2937', description: 'Olvido.', unlocked: false, unlockHint: '25 derrotas Banana', type: 'banana' },
  { id: 'banana_mecha', name: 'Mecha Banana', color: '#94a3b8', secondaryColor: '#334155', description: 'Futuro.', unlocked: false, unlockHint: 'Completa Hacker Banana', type: 'banana' }
];

export const BANANA_ACHIEVEMENTS = [
  { id: 'baskets_50', title: 'Recolector Frutal', description: 'Consigue 50 canastas.', skinRewardId: 'banana_split', target: 50 },
  { id: 'banana_hacker', title: 'Hacker de Potasio', description: 'Completa Hacker en modo Banana.', skinRewardId: 'banana_mecha', target: 1 },
  { id: 'banana_losses', title: 'Resbalón Eterno', description: 'Pierde 25 veces en modo Banana.', skinRewardId: 'banana_rotten', target: 25 }
];

import { PowerUp } from './types';

export const POWER_UPS: PowerUp[] = [
  { id: 'shield', name: 'Escudo de Corteza', description: 'Protege de un impacto.', cost: 10, icon: '🛡️' },
  { id: 'speed', name: 'Savia Veloz', description: 'Aumenta la velocidad un 50%.', cost: 15, icon: '⚡' },
  { id: 'rapid_fire', name: 'Ametralladora de Semillas', description: 'Dispara semillas automáticamente.', cost: 20, icon: '🔫' },
  { id: 'triple_shot', name: 'Disparo Triple', description: 'Lanza 3 proyectiles a la vez.', cost: 25, icon: '🔱' },
  { id: 'nuke', name: 'Explosión de Polen', description: 'Limpia la pantalla de enemigos.', cost: 50, icon: '☢️' }
];