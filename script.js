// ==================== DATA ====================
// Variable global para premios cargados dinámicamente
let premiosDisponibles = [];

let packs = [
  {
    id: "agua",
    nombre: "Higiene del agua",
    descripcion: "Buenas prácticas de higiene y consumo",
    brandingOpcional: {},
    preguntas: [
      {
        q: "¿Cuál es la forma más efectiva de eliminar microorganismos del agua en casa?",
        o: [
          "Filtrarla con tela",
          "Hervirla por al menos 3 minutos",
          "Agregar sal",
          "Agitarla fuertemente",
        ],
        a: 1,
      },
      {
        q: "¿Cada cuánto se recomienda limpiar los tanques de almacenamiento de agua?",
        o: [
          "Cada 5 años",
          "Cada 6–12 meses",
          "Nunca",
          "Solo cuando huelen mal",
        ],
        a: 1,
      },
      {
        q: "¿Qué indica un olor o sabor extraño en el agua?",
        o: [
          "Que es más nutritiva",
          "Posible contaminación",
          "Que está más fría",
          "Que es más suave",
        ],
        a: 1,
      },
      {
        q: "¿Qué se debe hacer antes de usar un filtro nuevo?",
        o: [
          "Nada",
          "Enjuagar y purgar según fabricante",
          "Calentarlo",
          "Pintarlo",
        ],
        a: 1,
      },
      {
        q: "¿Cuál es la mejor práctica para lavar frutas y verduras?",
        o: [
          "Usar agua corriente limpia",
          "Solo pasar un paño seco",
          "Agua con azúcar",
          "No hace falta",
        ],
        a: 0,
      },
      {
        q: "¿Qué se debe revisar en una planta de tratamiento doméstica?",
        o: [
          "Que esté decorada",
          "Caudales y mantenimiento",
          "Que tenga música",
          "Que esté cerca del sol",
        ],
        a: 1,
      },
      {
        q: "¿El cloro doméstico puede desinfectar agua en emergencia?",
        o: [
          "Sí, dosis adecuada",
          "No",
          "Solo de noche",
          "Solo si está caliente",
        ],
        a: 0,
      },
      {
        q: "¿Qué hacer si el agua sale turbia?",
        o: [
          "Consumir de inmediato",
          "Reportar y evitar consumo",
          "Agregar colorante",
          "Congelar",
        ],
        a: 1,
      },
      {
        q: "¿La correcta higiene de manos reduce enfermedades transmitidas por agua?",
        o: ["Sí", "No", "Solo en niños", "Solo en adultos"],
        a: 0,
      },
      {
        q: "¿Es recomendable reutilizar envases sin lavar para almacenar agua?",
        o: ["Sí", "No", "Depende del color", "Solo si son nuevos"],
        a: 1,
      },
    ],
  },
  {
    id: "servicios",
    nombre: "Servicios DH2OCOL",
    descripcion:
      "Limpieza y desinfección de tanques, inspección con dron e instalación",
    brandingOpcional: {},
    preguntas: [
      {
        q: "¿Qué servicio utiliza tecnología aérea de alta precisión?",
        o: [
          "Inspección con dron",
          "Publicidad con drones",
          "Entrega de paquetes",
          "Juego con drones",
        ],
        a: 0,
      },
      {
        q: "¿Qué tipo de productos usa DH2OCOL en la limpieza y desinfección?",
        o: ["Biodegradables", "Abrillantadores", "Pinturas", "Perfumes"],
        a: 0,
      },
      {
        q: "¿Cuál es el objetivo clave de nuestros servicios?",
        o: [
          "Garantizar la calidad y seguridad del agua",
          "Cambiar el color del agua",
          "Aumentar la presión",
          "Bajar la temperatura",
        ],
        a: 0,
      },
      {
        q: "¿Qué valor promovemos respecto al medio ambiente?",
        o: [
          "Métodos sostenibles",
          "Gasto excesivo de agua",
          "Uso de químicos prohibidos",
          "No medir impactos",
        ],
        a: 0,
      },
      {
        q: "¿Qué clientes confían en DH2OCOL?",
        o: [
          "Empresas privadas, conjuntos residenciales e instituciones de salud",
          "Solo videojuegos",
          "Solo restaurantes",
          "Solo gimnasios",
        ],
        a: 0,
      },
      {
        q: "¿Qué documento resume resultados de muestreo?",
        o: ["Informe técnico", "Póster", "Recibo", "Cuadro decorativo"],
        a: 0,
      },
      {
        q: "¿Qué parámetro es clave en calidad de agua?",
        o: ["pH", "Altura", "Velocidad", "Peso"],
        a: 0,
      },
      {
        q: "¿Qué indica alta turbidez?",
        o: ["Muchas partículas", "Agua clara", "Agua congelada", "Agua salada"],
        a: 0,
      },
      {
        q: "¿Qué mantenimiento requieren los filtros?",
        o: [
          "Periódico según fabricante",
          "Ninguno",
          "Semanal con pintura",
          "Solo si suenan",
        ],
        a: 0,
      },
      {
        q: "¿Qué servicio incluye instalación profesional con mantenimiento?",
        o: [
          "Instalación de tanques",
          "Instalación de luces",
          "Instalación de redes",
          "Instalación de cámaras",
        ],
        a: 0,
      },
    ],
  },
  {
    nombre: "Conoces a DH2OCOL",
    preguntas: [
      // Identidad y Especialización
      {
        q: "¿En qué se especializa DH2OCOL?",
        o: [
          "Limpieza y desinfección de tanques de agua potable",
          "Venta de tanques de agua",
          "Reparación de tuberías",
          "Instalación de bombas",
        ],
        a: 0,
      },
      {
        q: "¿Dónde está ubicada DH2OCOL?",
        o: [
          "Valledupar, Cesar - Colombia",
          "Bogotá, Colombia",
          "Barranquilla, Colombia",
          "Cartagena, Colombia",
        ],
        a: 0,
      },
      {
        q: "¿Qué significa DH2O?",
        o: [
          "Desinfección del H2O (agua)",
          "Distribución de agua",
          "Desarrollo hídrico",
          "Depósitos de agua",
        ],
        a: 0,
      },

      // Servicios
      {
        q: "¿Qué tipo de productos utiliza DH2OCOL en sus servicios?",
        o: [
          "Productos biodegradables y ecológicos",
          "Productos químicos industriales",
          "Productos importados",
          "Productos genéricos",
        ],
        a: 0,
      },
      {
        q: "¿Qué tecnología utiliza DH2OCOL para inspecciones?",
        o: [
          "Drones de alta precisión",
          "Cámaras submarinas",
          "Robots terrestres",
          "Sensores infrarrojos",
        ],
        a: 0,
      },
      {
        q: "¿Qué incluye el servicio de instalación de tanques?",
        o: [
          "Instalación profesional con garantía y mantenimiento",
          "Solo instalación básica",
          "Solo venta del tanque",
          "Solo asesoría",
        ],
        a: 0,
      },
      {
        q: "¿Qué tipo de servicios ofrece DH2OCOL?",
        o: [
          "Inspección, instalación, limpieza y desinfección",
          "Solo limpieza",
          "Solo instalación",
          "Solo inspección",
        ],
        a: 0,
      },

      // Compromiso y Valores
      {
        q: "¿Cuál es el compromiso principal de DH2OCOL?",
        o: [
          "Garantizar la calidad y seguridad del agua",
          "Vender más tanques",
          "Reducir costos",
          "Expandirse internacionalmente",
        ],
        a: 0,
      },
      {
        q: "¿Qué caracteriza los métodos de DH2OCOL?",
        o: [
          "Sostenibles y respetuosos con el medio ambiente",
          "Rápidos y económicos",
          "Tradicionales",
          "Automatizados",
        ],
        a: 0,
      },
      {
        q: "¿Qué garantiza DH2OCOL con su tecnología de vanguardia?",
        o: [
          "Eficiencia, calidad y respeto al medio ambiente",
          "Solo rapidez",
          "Solo bajo costo",
          "Solo cobertura amplia",
        ],
        a: 0,
      },

      // Clientes
      {
        q: "¿Qué tipo de clientes confían en DH2OCOL?",
        o: [
          "Empresas privadas e instituciones de salud",
          "Solo residencias",
          "Solo hoteles",
          "Solo industrias",
        ],
        a: 0,
      },
      {
        q: "¿Cómo son los servicios de DH2OCOL?",
        o: [
          "Personalizados según necesidades del cliente",
          "Estándar para todos",
          "Solo para grandes empresas",
          "Solo para residencias",
        ],
        a: 0,
      },
      {
        q: "¿Qué sector de salud confía en DH2OCOL?",
        o: [
          "Instituciones de salud y droguerías hospitalarias",
          "Solo clínicas pequeñas",
          "Solo consultorios",
          "Solo farmacias",
        ],
        a: 0,
      },

      // Educación y Programas
      {
        q: "¿Qué programa educativo ofrece DH2OCOL?",
        o: [
          "EducAgua - Educación del Agua Potable",
          "Cursos de plomería",
          "Talleres de instalación",
          "Capacitación en ventas",
        ],
        a: 0,
      },
      {
        q: "¿Qué objetivo tiene el programa EducAgua?",
        o: [
          "Educar sobre el cuidado del agua potable",
          "Vender más servicios",
          "Capacitar empleados",
          "Promocionar productos",
        ],
        a: 0,
      },

      // Servicios Específicos
      {
        q: "¿Qué evalúa DH2OCOL con inspección de drones?",
        o: [
          "Estado de tanques y estructuras elevadas",
          "Calidad del agua",
          "Fugas en tuberías",
          "Consumo de agua",
        ],
        a: 0,
      },
      {
        q: "¿Qué tipo de tanques atiende DH2OCOL?",
        o: [
          "Tanques elevados de agua potable",
          "Tanques subterráneos",
          "Tanques de combustible",
          "Tanques industriales",
        ],
        a: 0,
      },
      {
        q: "¿Qué incluye el servicio completo de limpieza?",
        o: [
          "Limpieza y desinfección con productos biodegradables",
          "Solo lavado con agua",
          "Solo desinfección química",
          "Solo inspección visual",
        ],
        a: 0,
      },

      // Calidad y Certificaciones
      {
        q: "¿Qué tipo de personal tiene DH2OCOL?",
        o: [
          "Personal calificado y certificado",
          "Personal sin experiencia",
          "Solo técnicos básicos",
          "Contratistas externos",
        ],
        a: 0,
      },
      {
        q: "¿Qué políticas guían el trabajo de DH2OCOL?",
        o: [
          "Compromiso ambiental, seguridad y calidad",
          "Solo reducción de costos",
          "Solo velocidad de servicio",
          "Solo expansión comercial",
        ],
        a: 0,
      },

      // Cobertura y Alcance
      {
        q: "¿En qué región opera principalmente DH2OCOL?",
        o: [
          "Valledupar y región Cesar",
          "Todo Colombia",
          "Solo Bogotá",
          "Costa Caribe completa",
        ],
        a: 0,
      },
      {
        q: "¿Qué tipo de empresa es DH2OCOL?",
        o: [
          "Empresa líder en servicios de tanques de agua",
          "Empresa de construcción",
          "Empresa de distribución",
          "Empresa de consultoría",
        ],
        a: 0,
      },

      // Productos y Accesorios
      {
        q: "¿Qué ofrece DH2OCOL además de servicios?",
        o: [
          "Accesorios para tanques elevados",
          "Solo asesorías",
          "Solo capacitaciones",
          "Solo inspecciones",
        ],
        a: 0,
      },
      {
        q: "¿Qué garantiza DH2OCOL en sus instalaciones?",
        o: [
          "Garantía y mantenimiento profesional",
          "Solo garantía de 30 días",
          "No ofrece garantía",
          "Solo mantenimiento pagado",
        ],
        a: 0,
      },

      // Diferenciadores
      {
        q: "¿Qué hace diferente a DH2OCOL de otras empresas?",
        o: [
          "Tecnología de vanguardia y métodos sostenibles",
          "Solo precios bajos",
          "Solo rapidez",
          "Solo cobertura amplia",
        ],
        a: 0,
      },
      {
        q: "¿Qué tipo de clientes empresariales confían en DH2OCOL?",
        o: [
          "Dislicores, Eticos, Scotiabank Colpatria",
          "Solo pequeñas empresas",
          "Solo empresas extranjeras",
          "Solo startups",
        ],
        a: 0,
      },

      // Responsabilidad
      {
        q: "¿Qué responsabilidad asume DH2OCOL con el agua?",
        o: [
          "Garantizar que llegue limpia y segura a hogares y negocios",
          "Solo vender servicios",
          "Solo cumplir contratos",
          "Solo generar ganancias",
        ],
        a: 0,
      },
      {
        q: "¿Cómo adapta DH2OCOL sus servicios?",
        o: [
          "Según necesidades específicas de cada cliente",
          "Servicios estándar para todos",
          "Solo paquetes predefinidos",
          "Sin personalización",
        ],
        a: 0,
      },

      // Innovación
      {
        q: "¿Qué innovación tecnológica usa DH2OCOL?",
        o: [
          "Inspección aérea con drones de alta precisión",
          "Solo métodos tradicionales",
          "Solo inspección manual",
          "Solo cámaras básicas",
        ],
        a: 0,
      },
      {
        q: "¿Qué busca DH2OCOL con sus servicios personalizados?",
        o: [
          "Adaptarse a las necesidades específicas de cada cliente",
          "Vender más servicios",
          "Reducir tiempo de trabajo",
          "Estandarizar procesos",
        ],
        a: 0,
      },
    ],
  },
];

// Memory game card pairs (water-themed)
const memoryPairs = [
  { id: 1, icon: "💧", label: "Agua" },
  { id: 2, icon: "🚰", label: "Grifo" },
  { id: 3, icon: "🧪", label: "Cloro" },
  { id: 4, icon: "🔬", label: "Análisis" },
  { id: 5, icon: "🏊", label: "Tanque" },
  { id: 6, icon: "🧼", label: "Limpieza" },
  { id: 7, icon: "✨", label: "Pureza" },
  { id: 8, icon: "🌊", label: "Flujo" },
];

const memoryLevels = [
  {
    id: "easy",
    nombre: "Fácil",
    descripcion: "8 pares - Tiempo ilimitado",
    pairs: 8,
    timeLimit: 0,
  },
  {
    id: "medium",
    nombre: "Medio",
    descripcion: "8 pares - 2 minutos",
    pairs: 8,
    timeLimit: 120,
  },
  {
    id: "hard",
    nombre: "Difícil",
    descripcion: "8 pares - 90 segundos",
    pairs: 8,
    timeLimit: 90,
  },
];

// ==================== STATE ====================
const state = {
  // Game mode
  mode: "trivia", // 'trivia' or 'memory'

  // Trivia state
  vidas: 3,
  score: 0,
  indicePregunta: 0,
  preguntasUsadas: new Set(),
  correctAnswers: 0,
  premioActual: null,
  codigoPremio: null,
  pack: null,
  tuvoPremio: false,
  codes: new Set(),
  inFinalTimeout: null,
  timeLeft: 30,
  timerInterval: null,
  questionStartTime: 0,

  // Memory game state
  memoryLevel: null,
  memoryCards: [],
  flippedCards: [],
  matchedPairs: 0,
  memoryScore: 0,
  memoryTimeElapsed: 0,
  memoryTimerInterval: null,

  // Wheel state
  wheelSegments: [],
  wheelCtx: null,
  wheelRotation: 0,
  isSpinning: false,
  wheelCtx: null,
  wheelRotation: 0,
  isSpinning: false,
  wheelLives: 3,

  // Puzzle state
  puzzleGrid: [], // Current state of grid indices
  puzzleSolvedGrid: [0, 1, 2, 3, 4, 5, 6, 7, 8], // Goals
  puzzleMoves: 0,
  puzzleTimerInterval: null,
  puzzleTimeLeft: 60,
  draggedPiece: null,
};

// ==================== ELEMENTS ====================
const el = {
  // Screens
  home: document.getElementById("screen-home"),
  game: document.getElementById("screen-game"),
  memory: document.getElementById("screen-memory"),
  final: document.getElementById("screen-final"),

  // Mode selection
  btnModeTrivia: document.getElementById("btn-mode-trivia"),
  btnModeMemory: document.getElementById("btn-mode-memory"),
  triviaSelection: document.getElementById("trivia-selection"),
  memorySelection: document.getElementById("memory-selection"),
  wheelSelection: document.getElementById("wheel-selection"),
  
  // Wheel elements
  btnModeWheel: document.getElementById("btn-mode-wheel"),
  wheelScreen: document.getElementById("screen-wheel"),
  wheelCanvas: document.getElementById("wheel-canvas"),
  wheelLives: document.getElementById("wheel-lives"),
  btnSpin: document.getElementById("btn-spin"),
  btnWheelQuit: document.getElementById("btn-wheel-quit"),

  // Puzzle elements
  btnModePuzzle: document.getElementById("btn-mode-puzzle"),
  puzzleScreen: document.getElementById("screen-puzzle"),
  puzzleBoard: document.getElementById("puzzle-board"), 
  puzzleScore: document.getElementById("puzzle-score"),
  puzzleTimer: document.getElementById("puzzle-timer"),
  btnPuzzleQuit: document.getElementById("btn-puzzle-quit"),

  // Trivia elements
  packsList: document.getElementById("packs-list"),
  btnStart: document.getElementById("btn-start"),
  btnFullscreen: document.getElementById("btn-fullscreen"),
  lives: document.getElementById("lives"),
  score: document.getElementById("score"),
  packName: document.getElementById("pack-name"),
  question: document.getElementById("question"),
  options: document.getElementById("options"),
  progressBar: document.getElementById("progress-bar"),
  timer: document.getElementById("timer"),

  // Memory elements
  memoryLevels: document.getElementById("memory-levels"),
  memoryBoard: document.getElementById("memory-board"),
  memoryMoves: document.getElementById("memory-moves"),
  memoryScore: document.getElementById("memory-score"),
  memoryPairs: document.getElementById("memory-pairs"),
  memoryTimer: document.getElementById("memory-timer"),
  btnMemoryQuit: document.getElementById("btn-memory-quit"),

  // Final screen
  finalTitle: document.getElementById("final-title"),
  finalStats: document.getElementById("final-stats"),
  finalCode: document.getElementById("final-code"),
  btnRestart: document.getElementById("btn-restart"),

  // Modals
  modal: document.getElementById("modal"),
  modalPrize: document.getElementById("modal-prize"),
  modalCode: document.getElementById("modal-code"),
  btnCloseModal: document.getElementById("btn-close-modal"),

  // Leaderboard
  btnLeaderboard: document.getElementById("btn-leaderboard"),
  leaderboardModal: document.getElementById("leaderboard-modal"),
  leaderboardList: document.getElementById("leaderboard-list"),
  btnCloseLeaderboard: document.getElementById("btn-close-leaderboard"),
  tabTrivia: document.getElementById("tab-trivia"),
  tabMemory: document.getElementById("tab-memory"),
};

// ==================== PRIZE LOADING ====================
async function cargarPremios() {
  try {
    const response = await fetch("/api/premios?activos=true");
    const data = await response.json();

    if (data.success && data.premios.length > 0) {
      const activos = data.premios.filter((p) => p.cantidad_disponible > 0);
      premiosDisponibles = activos.map((p) => ({
        nombre: p.nombre,
        probabilidad: calcularProbabilidad(p.cantidad_disponible, activos),
      }));
      console.log("✅ Premios cargados desde DB:", premiosDisponibles.length);
    } else {
      premiosDisponibles = [];
      console.warn("⚠️ No hay premios activos en DB");
    }
  } catch (error) {
    console.error("❌ Error cargando premios:", error);
    premiosDisponibles = [];
  }
}

function calcularProbabilidad(cantidad, todosPremios) {
  const totalCantidad = todosPremios.reduce(
    (sum, p) => sum + p.cantidad_disponible,
    0
  );
  if (totalCantidad > 0) {
    return cantidad / totalCantidad;
  }
  // Si todos tienen cantidad 0, distribuir equitativamente
  return 1 / todosPremios.length;
}

function usarPremiosPorDefecto() {
  premiosDisponibles = [];
}

async function cargarPacks() {
  try {
    const res = await fetch("/api/preguntas?activa=true");
    const data = await res.json();
    const list = Array.isArray(data.preguntas) ? data.preguntas : [];
    const byCat = new Map();
    for (const p of list) {
      const cat = (p.categoria && String(p.categoria).trim()) || "General";
      let arr = byCat.get(cat);
      if (!arr) {
        arr = [];
        byCat.set(cat, arr);
      }
      const opciones = Array.isArray(p.opciones) ? p.opciones : [];
      const texts = opciones.map((o) => o.texto);
      const idx = opciones.findIndex((o) => o.correcta);
      if (texts.length > 0 && idx >= 0) {
        arr.push({ q: p.texto, o: texts, a: idx });
      }
    }
    const toSlug = (s) =>
      String(s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    const packsData = Array.from(byCat.entries()).map(([cat, preguntas]) => ({
      id: toSlug(cat),
      nombre: cat,
      descripcion: "",
      brandingOpcional: {},
      preguntas,
    }));
    if (packsData.length > 0) {
      packs = packsData;
    } else {
      packs = [];
    }
  } catch (e) {
    packs = [];
  }
}

// ==================== INITIALIZATION ====================
async function init() {
  await cargarPacks();
  renderPacks();
  renderMemoryLevels();
  setupEventListeners();
  loadLeaderboard();
  cargarPremios();
}

function setupEventListeners() {
  // Mode selection
  el.btnModeTrivia.addEventListener("click", () => selectMode("trivia"));
  el.btnModeMemory.addEventListener("click", () => selectMode("memory"));
  el.btnModeWheel.addEventListener("click", () => selectMode("wheel"));

  // Wheel
  el.btnSpin.addEventListener("click", spinWheel);
  el.btnWheelQuit.addEventListener("click", () => setScreen("home"));
  // Puzzle
  el.btnModePuzzle.addEventListener("click", () => selectMode("puzzle"));
  el.btnPuzzleQuit.addEventListener("click", () => {
    clearInterval(state.puzzleTimerInterval);
    setScreen("home");
  });

  // Trivia
  el.btnStart.addEventListener("click", startGame);
  el.btnFullscreen.addEventListener("click", toggleFullscreen);

  // Quit buttons
  const btnTriviaQuit = document.getElementById("btn-trivia-quit");
  btnTriviaQuit.addEventListener("click", () => {
    clearInterval(state.timerInterval);
    setScreen("home");
  });

  el.btnMemoryQuit.addEventListener("click", () => {
    clearInterval(state.memoryTimerInterval);
    setScreen("home");
  });

  // Final screen
  el.btnRestart.addEventListener("click", () => {
    clearTimeout(state.inFinalTimeout);
    setScreen("home");
  });

  // Modals
  el.btnCloseModal.addEventListener("click", () => {
    el.modal.classList.add("hidden");
  });

  // Botón de registrar premio
  const btnRegisterPrize = document.getElementById("btn-register-prize");
  btnRegisterPrize.addEventListener("click", () => {
    const codigo = state.codigoPremio;
    const premio = state.premioActual.nombre;
    // Abrir en nueva pestaña
    window.open(
      `/registro?codigo=${encodeURIComponent(
        codigo
      )}&premio=${encodeURIComponent(premio)}`,
      "_blank"
    );
  });

  el.btnLeaderboard.addEventListener("click", showLeaderboard);
  el.btnCloseLeaderboard.addEventListener("click", () => {
    el.leaderboardModal.classList.add("hidden");
  });

  el.tabTrivia.addEventListener("click", () => {
    el.tabTrivia.classList.add("active");
    el.tabMemory.classList.remove("active");
    renderLeaderboard("trivia");
  });

  el.tabMemory.addEventListener("click", () => {
    el.tabMemory.classList.add("active");
    el.tabTrivia.classList.remove("active");
    renderLeaderboard("memory");
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const f = document.activeElement;
      if (f && f.classList.contains("option")) f.click();
    }
  });
}

// ==================== MODE SELECTION ====================
function selectMode(mode) {
  state.mode = mode;

  // Update UI
  el.btnModeTrivia.classList.toggle("selected", mode === "trivia");
  el.btnModeMemory.classList.toggle("selected", mode === "memory");
  el.btnModeWheel.classList.toggle("selected", mode === "wheel");
  el.btnModePuzzle.classList.toggle("selected", mode === "puzzle");

  el.triviaSelection.classList.toggle("hidden", mode !== "trivia");
  el.memorySelection.classList.toggle("hidden", mode !== "memory");
  el.wheelSelection.classList.toggle("hidden", mode !== "wheel" && mode !== "puzzle");

  // Reset selection
  if (mode === "wheel") {
      el.btnStart.disabled = false;
      el.btnStart.textContent = "Ir a la Ruleta";
      el.btnStart.classList.remove("hidden");
      el.btnStart.onclick = startWheelMode;
  } else if (mode === "puzzle") {
      el.btnStart.disabled = false;
      el.btnStart.textContent = "Iniciar Puzzle";
      el.btnStart.classList.remove("hidden");
      el.btnStart.onclick = startPuzzleMode;
  } else {
      el.btnStart.disabled = true;
      el.btnStart.textContent = "Iniciar Juego";
      el.btnStart.onclick = startGame;
      el.btnStart.classList.remove("hidden");
  }

  if (mode === "trivia") {
    document
      .querySelectorAll(".pack-card")
      .forEach((x) => x.classList.remove("selected"));
    state.pack = null;
  } else if (mode === "memory") {
    document
      .querySelectorAll("#memory-levels .pack-card")
      .forEach((x) => x.classList.remove("selected"));
    state.memoryLevel = null;
    el.btnStart.classList.add("hidden"); // Memory shows levels directly
  }
}

// ==================== TRIVIA GAME ====================
function renderPacks() {
  el.packsList.innerHTML = "";
  packs.forEach((p) => {
    const d = document.createElement("button");
    d.className = "pack-card";
    d.setAttribute("role", "listitem");
    d.innerHTML = `<strong>${p.nombre}</strong><br><span>${p.descripcion}</span>`;
    d.addEventListener("click", () => {
      document
        .querySelectorAll(".pack-card")
        .forEach((x) => x.classList.remove("selected"));
      d.classList.add("selected");
      state.pack = p;
      el.btnStart.disabled = false;
    });
    el.packsList.appendChild(d);
  });
}

function setScreen(name) {
  el.home.classList.toggle("hidden", name !== "home");
  el.game.classList.toggle("hidden", name !== "game");
  el.memory.classList.toggle("hidden", name !== "memory");
  el.final.classList.toggle("hidden", name !== "final");
  el.final.classList.toggle("hidden", name !== "final");
  el.wheelScreen.classList.toggle("hidden", name !== "wheel");
  el.puzzleScreen.classList.toggle("hidden", name !== "puzzle");
}

function startGame() {
  if (state.mode === "trivia") {
    startTriviaGame();
  } else {
    startMemoryGame();
  }
}

function startTriviaGame() {
  state.vidas = 3;
  state.score = 0;
  state.indicePregunta = 0;
  state.preguntasUsadas = new Set();
  state.correctAnswers = 0;
  state.premioActual = null;
  state.codigoPremio = null;
  state.tuvoPremio = false;
  updateTriviaStatus();
  setScreen("game");
  nextQuestion();
}

function updateTriviaStatus() {
  el.lives.textContent = `❤️ ${state.vidas}`;
  el.score.textContent = `Puntos: ${state.score}`;
  el.packName.textContent = state.pack ? state.pack.nombre : "";

  // Update progress bar
  const progress =
    (state.preguntasUsadas.size / state.pack.preguntas.length) * 100;
  el.progressBar.style.width = `${progress}%`;
}

function nextQuestion() {
  if (state.vidas <= 0) {
    finishTrivia(false);
    return;
  }
  if (state.preguntasUsadas.size >= state.pack.preguntas.length) {
    finishTrivia(true);
    return;
  }

  let idx;
  do {
    idx = Math.floor(Math.random() * state.pack.preguntas.length);
  } while (state.preguntasUsadas.has(idx));
  state.preguntasUsadas.add(idx);

  const pq = state.pack.preguntas[idx];
  el.question.textContent = pq.q;
  el.options.innerHTML = "";

  pq.o.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "option";
    b.textContent = opt;
    b.tabIndex = 0;
    b.addEventListener("click", () => selectOption(i, pq.a, b));
    el.options.appendChild(b);
  });

  el.options.firstChild && el.options.firstChild.focus();

  // Start timer
  startTimer();
}

function startTimer() {
  state.timeLeft = 30;
  state.questionStartTime = Date.now();
  el.timer.textContent = `${state.timeLeft}s`;
  el.timer.classList.remove("warning");

  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    el.timer.textContent = `${state.timeLeft}s`;

    if (state.timeLeft <= 10) {
      el.timer.classList.add("warning");
    }

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      // Time's up - treat as wrong answer
      state.vidas -= 1;
      updateTriviaStatus();
      setTimeout(() => {
        if (state.vidas <= 0) {
          finishTrivia(false);
        } else {
          nextQuestion();
        }
      }, 500);
    }
  }, 1000);
}

function selectOption(i, ans, btn) {
  clearInterval(state.timerInterval);
  const correct = i === ans;
  Array.from(el.options.children).forEach((c) => (c.disabled = true));
  btn.classList.add(correct ? "correct" : "incorrect");

  setTimeout(() => {
    if (correct) {
      // Calculate score based on time taken
      const timeTaken = Math.floor(
        (Date.now() - state.questionStartTime) / 1000
      );
      const timeBonus = Math.max(0, 30 - timeTaken) * 10;
      const baseScore = 100;
      state.score += baseScore + timeBonus;
      state.correctAnswers++;
      updateTriviaStatus();

      // Mostrar premio inmediatamente al alcanzar 3 respuestas correctas
      if (state.correctAnswers === 3 && !state.tuvoPremio) {
        awardPrize();
      }
    } else {
      state.vidas -= 1;
      updateTriviaStatus();
    }
    setTimeout(() => {
      if (state.vidas <= 0) {
        finishTrivia(false);
      } else {
        nextQuestion();
      }
    }, 200);
  }, 300);
}

function awardPrize() {
  const prize = pickPrize(premiosDisponibles);
  if (!prize) return;
  const code = genCode();
  state.premioActual = prize;
  state.codigoPremio = code;
  state.tuvoPremio = true;
  el.modalPrize.textContent = prize.nombre;
  el.modalCode.textContent = code;
  el.modal.classList.remove("hidden");
}

function pickPrize(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  const s = list.reduce((a, b) => a + b.probabilidad, 0);
  let r = Math.random() * s;
  for (const p of list) {
    if (r < p.probabilidad) return p;
    r -= p.probabilidad;
  }
  return list[0];
}

function genCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  do {
    let t = "";
    for (let i = 0; i < 4; i++)
      t += chars[Math.floor(Math.random() * chars.length)];
    code = `DH2O-FERIA-${t}`;
  } while (state.codes.has(code));
  state.codes.add(code);
  return code;
}

function finishTrivia(won) {
  clearInterval(state.timerInterval);
  setScreen("final");
  const isWinner = won || state.tuvoPremio;

  // Determinar título según resultados
  let titleText = "Fin de la partida";
  if (state.correctAnswers >= 3) {
    titleText = "¡Ganaste! 🎉";
  } else if (state.correctAnswers > 0) {
    titleText = "¡Buen intento! 💪";
  }
  el.finalTitle.textContent = titleText;

  // Show stats
  const accuracy =
    state.preguntasUsadas.size > 0
      ? Math.round((state.correctAnswers / state.preguntasUsadas.size) * 100)
      : 0;

  el.finalStats.innerHTML = `
    <strong>Puntuación:</strong> ${state.score}<br>
    <strong>Preguntas respondidas:</strong> ${state.preguntasUsadas.size}<br>
    <strong>Respuestas correctas:</strong> ${state.correctAnswers}<br>
    <strong>Precisión:</strong> ${accuracy}%<br>
    <strong>Vidas restantes:</strong> ${state.vidas}
  `;

  // Mostrar código solo si ganó premio
  if (state.codigoPremio) {
    el.finalCode.innerHTML = `
      <strong>¡Felicidades!</strong><br>
      Has ganado: <strong>${state.premioActual.nombre}</strong><br>
      <div class="code">Código: ${state.codigoPremio}</div>
      <small style="color: var(--azul); opacity: 0.8;">Presenta este código único para reclamar tu premio</small>
    `;
  } else if (state.correctAnswers < 3) {
    el.finalCode.innerHTML = `
      <p style="color: var(--azul); opacity: 0.9;">
        Necesitas <strong>mínimo 3 respuestas correctas</strong> para obtener un premio.<br>
        Obtuviste: <strong>${state.correctAnswers}</strong> correctas. ¡Inténtalo de nuevo!
      </p>
    `;
  } else {
    el.finalCode.textContent = "";
  }

  // Save to leaderboard
  saveScore("trivia", state.score, {
    pack: state.pack.nombre,
    questions: state.preguntasUsadas.size,
    accuracy: accuracy,
  });

  clearTimeout(state.inFinalTimeout);
  state.inFinalTimeout = setTimeout(() => {
    setScreen("home");
  }, 60000);
}

// ==================== MEMORY GAME ====================
function renderMemoryLevels() {
  el.memoryLevels.innerHTML = "";
  memoryLevels.forEach((level) => {
    const d = document.createElement("button");
    d.className = "pack-card";
    d.setAttribute("role", "listitem");
    d.innerHTML = `<strong>${level.nombre}</strong><br><span>${level.descripcion}</span>`;
    d.addEventListener("click", () => {
      document
        .querySelectorAll("#memory-levels .pack-card")
        .forEach((x) => x.classList.remove("selected"));
      d.classList.add("selected");
      state.memoryLevel = level;
      el.btnStart.disabled = false;
    });
    el.memoryLevels.appendChild(d);
  });
}

function startMemoryGame() {
  state.moves = 0;
  state.matchedPairs = 0;
  state.memoryLives = 3; // Reiniciar vidas a 3
  state.memoryScore = 0;
  state.memoryTimeElapsed = 0;
  state.flippedCards = [];

  // Create shuffled card deck
  const pairs = memoryPairs.slice(0, state.memoryLevel.pairs);
  const cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
  state.memoryCards = cards.map((pair, index) => ({
    ...pair,
    index,
    flipped: false,
    matched: false,
  }));

  setScreen("memory");
  renderMemoryBoard();
  updateMemoryStatus();
  startMemoryTimer();
}

function renderMemoryBoard() {
  el.memoryBoard.innerHTML = "";
  state.memoryCards.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "memory-card";
    cardEl.innerHTML = `
      <div class="card-back">💧</div>
      <div class="card-front">${card.icon}</div>
    `;
    cardEl.addEventListener("click", () => flipCard(index));
    el.memoryBoard.appendChild(cardEl);
  });
}

function updateMemoryStatus() {
  el.memoryMoves.textContent = `❤️ Intentos: ${state.memoryLives}`;
  el.memoryScore.textContent = `Puntos: ${state.memoryScore}`;
  el.memoryPairs.textContent = `Pares: ${state.matchedPairs}/${state.memoryLevel.pairs}`;
}

function startMemoryTimer() {
  clearInterval(state.memoryTimerInterval);
  state.memoryTimerInterval = setInterval(() => {
    state.memoryTimeElapsed++;
    el.memoryTimer.textContent = `${state.memoryTimeElapsed}s`;

    // Check time limit
    if (
      state.memoryLevel.timeLimit > 0 &&
      state.memoryTimeElapsed >= state.memoryLevel.timeLimit
    ) {
      clearInterval(state.memoryTimerInterval);
      finishMemory(false);
    }
  }, 1000);
}

function flipCard(index) {
  const card = state.memoryCards[index];

  // Prevent flipping if already flipped, matched, or two cards are already flipped
  if (card.flipped || card.matched || state.flippedCards.length >= 2) {
    return;
  }

  // Flip the card
  card.flipped = true;
  state.flippedCards.push(index);

  const cardEl = el.memoryBoard.children[index];
  cardEl.classList.add("flipped");

  // Check for match when two cards are flipped
  if (state.flippedCards.length === 2) {
    state.moves++;
    updateMemoryStatus();

    const [idx1, idx2] = state.flippedCards;
    const card1 = state.memoryCards[idx1];
    const card2 = state.memoryCards[idx2];

    if (card1.id === card2.id) {
      // Match found!
      setTimeout(() => {
        card1.matched = true;
        card2.matched = true;
        el.memoryBoard.children[idx1].classList.add("matched");
        el.memoryBoard.children[idx2].classList.add("matched");
        state.matchedPairs++;

        // Calculate score
        const timeBonus =
          state.memoryLevel.timeLimit > 0
            ? Math.max(
                0,
                state.memoryLevel.timeLimit - state.memoryTimeElapsed
              ) * 5
            : 0;
        state.memoryScore += 100 + timeBonus;

        updateMemoryStatus();
        state.flippedCards = [];

        // Mostrar premio inmediatamente al alcanzar 3 pares
        if (state.matchedPairs === 3 && !state.tuvoPremio) {
          awardMemoryPrize();
        }

        // Check if game is complete
        if (state.matchedPairs === state.memoryLevel.pairs) {
          clearInterval(state.memoryTimerInterval);
          setTimeout(() => finishMemory(true), 500);
        }
      }, 500);
    } else {
      // No match - perder una vida
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        el.memoryBoard.children[idx1].classList.remove("flipped");
        el.memoryBoard.children[idx2].classList.remove("flipped");
        state.flippedCards = [];

        // Restar una vida
        state.memoryLives--;
        updateMemoryStatus();

        // Verificar si se acabaron las vidas
        if (state.memoryLives <= 0) {
          clearInterval(state.memoryTimerInterval);
          setTimeout(() => finishMemory(false), 500);
        }
      }, 1000);
    }
  }
}

function awardMemoryPrize() {
  // Usar premios cargados dinámicamente desde la base de datos
  const prize = pickPrize(premiosDisponibles);
  if (!prize) return;
  const code = genCode();
  state.premioActual = prize;
  state.codigoPremio = code;
  state.tuvoPremio = true;
  el.modalPrize.textContent = prize.nombre;
  el.modalCode.textContent = code;
  el.modal.classList.remove("hidden");
}

function finishMemory(won) {
  clearInterval(state.memoryTimerInterval);
  setScreen("final");

  // Determinar el mensaje según la razón de finalización
  let titleText = "Fin de la partida";
  if (won) {
    titleText = "¡Completado! 🎉";
  } else if (state.memoryLives <= 0) {
    titleText = "Sin intentos ❌";
  } else if (
    state.memoryLevel.timeLimit > 0 &&
    state.memoryTimeElapsed >= state.memoryLevel.timeLimit
  ) {
    titleText = "Tiempo agotado ⏰";
  }

  el.finalTitle.textContent = titleText;

  const efficiency =
    state.moves > 0
      ? Math.round(((state.matchedPairs * 2) / state.moves) * 100)
      : 0;

  el.finalStats.innerHTML = `
    <strong>Puntuación:</strong> ${state.memoryScore}<br>
    <strong>Tiempo:</strong> ${state.memoryTimeElapsed}s<br>
    <strong>Movimientos:</strong> ${state.moves}<br>
    <strong>Intentos restantes:</strong> ${state.memoryLives}<br>
    <strong>Eficiencia:</strong> ${efficiency}%<br>
    <strong>Pares encontrados:</strong> ${state.matchedPairs}/${state.memoryLevel.pairs}
  `;

  el.finalCode.textContent = "";

  // Save to leaderboard
  if (won) {
    saveScore("memory", state.memoryScore, {
      level: state.memoryLevel.nombre,
      time: state.memoryTimeElapsed,
      moves: state.moves,
      efficiency: efficiency,
    });
  }

  clearTimeout(state.inFinalTimeout);
  state.inFinalTimeout = setTimeout(() => {
    setScreen("home");
  }, 60000);
}

// ==================== LEADERBOARD ====================
function loadLeaderboard() {
  if (!localStorage.getItem("dh2o-leaderboard-trivia")) {
    localStorage.setItem("dh2o-leaderboard-trivia", JSON.stringify([]));
  }
  if (!localStorage.getItem("dh2o-leaderboard-memory")) {
    localStorage.setItem("dh2o-leaderboard-memory", JSON.stringify([]));
  }
}

function saveScore(gameType, score, details) {
  const key = `dh2o-leaderboard-${gameType}`;
  let leaderboard = JSON.parse(localStorage.getItem(key) || "[]");

  leaderboard.push({
    score,
    details,
    date: new Date().toISOString(),
  });

  // Sort by score (descending) and keep top 10
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);

  localStorage.setItem(key, JSON.stringify(leaderboard));
}

function showLeaderboard() {
  el.leaderboardModal.classList.remove("hidden");
  renderLeaderboard("trivia");
}

function renderLeaderboard(gameType) {
  const key = `dh2o-leaderboard-${gameType}`;
  const leaderboard = JSON.parse(localStorage.getItem(key) || "[]");

  if (leaderboard.length === 0) {
    el.leaderboardList.innerHTML =
      '<div class="leaderboard-empty">No hay puntajes registrados aún</div>';
    return;
  }

  el.leaderboardList.innerHTML = leaderboard
    .map((entry, index) => {
      const rank = index + 1;
      const medal =
        rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

      let detailsText = "";
      if (gameType === "trivia") {
        detailsText = `${entry.details.pack} - ${entry.details.questions} preguntas - ${entry.details.accuracy}% precisión`;
      } else {
        detailsText = `${entry.details.level} - ${entry.details.time}s - ${entry.details.moves} movimientos`;
      }

      return `
        <div class="leaderboard-item">
          <div class="leaderboard-rank">${medal}</div>
          <div class="leaderboard-info">
            <div class="leaderboard-score">${entry.score} pts</div>
            <div style="font-size: 14px; opacity: 0.8;">${detailsText}</div>
          </div>
        </div>
      `;
    })
    .join("");
}

// ==================== UTILITY ====================
function toggleFullscreen() {
  const de = document.documentElement;
  if (!document.fullscreenElement) {
    de.requestFullscreen && de.requestFullscreen();
  } else {
    document.exitFullscreen && document.exitFullscreen();
  }
}

// ==================== START ====================
// ==================== WHEEL LOGIC ====================

function startWheelMode() {
    setScreen("wheel");
    initWheel();
}

function initWheel() {
    // Definir segmentos basados en categorías o premios
    state.wheelSegments = [];
    
    // 1. Agregar categorías de preguntas disponibles
    if (packs && packs.length > 0) {
        packs.forEach(p => {
            const label = p.nombre || "Pregunta";
            state.wheelSegments.push({ 
                type: 'question', 
                text: label.substring(0, 15), // Limitar longitud
                data: p, 
                color: getRandomColor() 
            });
        });
    }

    // 2. Agregar segmentos de "Variedad" para hacer la ruleta más interesante
    const extraSegments = [
        { type: 'prize', text: '🎁 PREMIO', color: '#FFD700' },
        { type: 'retry', text: 'Gira Otra Vez', color: '#4CAF50' },
        { type: 'prize', text: '🏆 SORPRESA', color: '#FF9800' }, 
        { type: 'retry', text: 'Intenta Nuevo', color: '#2196F3' }
    ];

    // Mezclar y agregar extras
    extraSegments.forEach(seg => {
        state.wheelSegments.push({ ...seg, data: null });
    });
    
    // 3. Si aún hay pocos segmentos (menos de 8), duplicar existentes
    // Priorizar duplicar PREMIO y Categorías
    while (state.wheelSegments.length < 8) {
         const original = state.wheelSegments[state.wheelSegments.length % 2]; // Alternar entre los primeros
         state.wheelSegments.push({ ...original, color: getRandomColor() });
    }

    // Shuffle segments for better distribution
    for (let i = state.wheelSegments.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.wheelSegments[i], state.wheelSegments[j]] = [state.wheelSegments[j], state.wheelSegments[i]];
    }

    state.wheelLives = 3;
    updateWheelStatus();

    state.wheelCtx = el.wheelCanvas.getContext("2d");
    drawWheel();
}

function updateWheelStatus() {
    el.wheelLives.textContent = `Giros: ${state.wheelLives}`;
    // el.wheelScore.textContent = ... if we had score
}

function getRandomColor() {
    const colors = ['#1986c8', '#1eb8d1', '#008037', '#0d1419', '#4caf50', '#2196f3', '#9c27b0', '#ff5722'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function drawWheel() {
    if (!state.wheelCtx) return;
    const ctx = state.wheelCtx;
    const width = el.wheelCanvas.width;
    const height = el.wheelCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const segments = state.wheelSegments.length;
    const arcSize = (2 * Math.PI) / segments;

    ctx.clearRect(0, 0, width, height);
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(state.wheelRotation);

    for (let i = 0; i < segments; i++) {
        const angle = i * arcSize;
        const segment = state.wheelSegments[i];

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, angle, angle + arcSize);
        ctx.fillStyle = segment.color;
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Arial";
        ctx.fillText(segment.text, radius - 20, 5);
        ctx.restore();
    }
    
    ctx.restore();
    
    // Draw Center Circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.stroke();
}

function spinWheel() {
    if (state.isSpinning) return;
    if (state.wheelLives <= 0) {
        showToast("¡Te has quedado sin giros!", "error");
        return;
    }

    state.wheelLives--;
    updateWheelStatus();

    state.isSpinning = true;
    el.btnSpin.disabled = true;

    // Duración aleatoria entre 3 y 5 segundos
    const duration = 4000 + Math.random() * 2000; 
    const startRotation = state.wheelRotation;
    // Rotar al menos 5 vueltas completas + un extra aleatorio
    const totalRotation = startRotation + (10 * Math.PI) + (Math.random() * 10 * Math.PI);
    const startTime = performance.now();

    function animate(time) {
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1);
        
        // Easing function: cubic-bezier out
        const easeOut = 1 - Math.pow(1 - t, 3);
        
        state.wheelRotation = startRotation + (totalRotation - startRotation) * easeOut;
        drawWheel();

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            state.isSpinning = false;
            el.btnSpin.disabled = false;
            determineWheelResult();
        }
    }

    requestAnimationFrame(animate);
}

function determineWheelResult() {
    const segments = state.wheelSegments.length;
    const arcSize = (2 * Math.PI) / segments;
    // Normalizar rotación entre 0 y 2PI
    const currentRotation = state.wheelRotation % (2 * Math.PI);
    
    // La flecha está arriba (270 grados o -90 grados, que es 1.5 PI)
    // Calcular qué segmento está tocando la flecha
    // Ajuste matemático: 
    // Angulo de flecha efectivo considerando la rotación: (2*Math.PI - currentRotation + 1.5*Math.PI) % 2*Math.PI
    // Simplificado: Index se basa en (TotalAngle - HandAngle)
    
    // Método simple: calcular angulo recorrido
    let pointerAngle = (3 * Math.PI / 2) - currentRotation;
    while (pointerAngle < 0) pointerAngle += 2 * Math.PI;
    
    const index = Math.floor(pointerAngle / arcSize) % segments;
    const result = state.wheelSegments[index];
    
    if (result.type === 'question') {
        launchWheelQuestion(result.data);
    } else if (result.type === 'prize') {
        giveRandomPrize();
    } else if (result.type === 'retry') {
        showToast("¡Ups! Cuenta como giro.", "info");
        checkWheelGameEnd();
    }
}

function checkWheelGameEnd() {
    if (state.wheelLives > 0) {
        el.btnSpin.disabled = false;
    } else {
        setTimeout(() => {
            showToast("Juego Terminado", "info");
             // Maybe show summary or return home
             setTimeout(() => setScreen("home"), 2000);
        }, 1500);
    }
}

function launchWheelQuestion(pack) {
    // Configurar estado para una sola pregunta
    state.pack = pack;
    // Seleccionar pregunta aleatoria
    const randomIndex = Math.floor(Math.random() * pack.preguntas.length);
    state.indicePregunta = randomIndex; 
    
    // Mostrar modal con la pregunta (reusando UI de Trivia o un modal custom)
    // Para simpleza, usaremos una alerta visual o cambiaremos temporalmente a la pantalla de juego con 1 sola vida/pregunta
    // Mejor: mostramos un Modal
    
    state.currentQuestion = pack.preguntas[randomIndex];
    
    // Usar el modal genérico para mostrar la pregunta
    el.modal.classList.remove("hidden");
    const modalContent = el.modal.querySelector(".modal-content");
    
    // Render Question in Modal
    modalContent.innerHTML = `
        <h3>${pack.nombre}</h3>
        <p class="question" style="font-size:20px; color:white;">${state.currentQuestion.q}</p>
        <div id="wheel-options" class="options" style="margin-top:20px;"></div>
    `;
    
    const optsContainer = document.getElementById("wheel-options");
    state.currentQuestion.o.forEach((optText, idx) => {
        const btn = document.createElement("button");
        btn.className = "option";
        btn.textContent = optText;
        btn.onclick = () => checkWheelAnswer(idx, btn);
        optsContainer.appendChild(btn);
    });
}

function checkWheelAnswer(selectedIndex, btnElement) {
    const correctIndex = state.currentQuestion.a;
    if (selectedIndex === correctIndex) {
        btnElement.classList.add("correct");
        setTimeout(() => {
            el.modal.classList.add("hidden");
            // Dar premio o puntos
            giveRandomPrize(); // Ganó la pregunta -> Premio
            showToast("¡Respuesta Correcta!", "success");
            checkWheelGameEnd();
        }, 1000);
    } else {
        btnElement.classList.add("incorrect");
        setTimeout(() => {
             el.modal.classList.add("hidden");
             showToast("Respuesta Incorrecta", "error");
             checkWheelGameEnd();
        }, 1000);
    }
}

function giveRandomPrize() {
    // Lógica existente de premios
    const rand = Math.random();
    let acumulado = 0;
    let seleccionado = null;

    if (premiosDisponibles.length === 0) {
        // Mostrar premio genérico si no hay stock
        state.premioActual = { nombre: "Descuento Especial" };
        state.codigoPremio = genCode();
        state.tuvoPremio = true;
        el.modalPrize.textContent = "Descuento Especial";
        el.modalCode.textContent = state.codigoPremio;
        el.modal.classList.remove("hidden");
        return;
    }

    for (const p of premiosDisponibles) {
        acumulado += p.probabilidad;
        if (rand < acumulado) {
            seleccionado = p;
            break;
        }
    }
    
    if (!seleccionado) seleccionado = premiosDisponibles[premiosDisponibles.length - 1];
    
    state.premioActual = seleccionado;
    state.codigoPremio = genCode();
    state.tuvoPremio = true;
    el.modalPrize.textContent = seleccionado.nombre;
    el.modalCode.textContent = state.codigoPremio;
    el.modal.classList.remove("hidden");
    
    // Si viene de la ruleta, verificar fin de juego al cerrar modal?
    // Por simplicidad, el modal bloquea, al cerrarlo el usuario ve el boton deshabilitado si vidas=0
    if (state.mode === 'wheel') checkWheelGameEnd();
}

function showToast(message, type) {
    // Basic toast reuse or implementation
    console.log(type, message);
}

// ==================== START ====================
// ==================== PUZZLE LOGIC ====================

function startPuzzleMode() {
    setScreen("puzzle");
    initPuzzle();
}

function initPuzzle() {
    state.puzzleTimeLeft = 60;
    state.puzzleMoves = 0;
    state.puzzleGrid = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Shuffle simple ensuring solvability (or just random swaps)
    // For 3x3 simple swap puzzle, just shuffle array.
    for (let i = state.puzzleGrid.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.puzzleGrid[i], state.puzzleGrid[j]] = [state.puzzleGrid[j], state.puzzleGrid[i]];
    }

    renderPuzzleBoard();
    updatePuzzleStatus();

    clearInterval(state.puzzleTimerInterval);
    state.puzzleTimerInterval = setInterval(() => {
        state.puzzleTimeLeft--;
        el.puzzleTimer.textContent = `${state.puzzleTimeLeft}s`;
        if (state.puzzleTimeLeft <= 0) {
            finishPuzzle(false);
        }
    }, 1000);
}

function updatePuzzleStatus() {
    el.puzzleScore.textContent = `Movimientos: ${state.puzzleMoves}`;
}

function renderPuzzleBoard() {
    el.puzzleBoard.innerHTML = "";
    state.puzzleGrid.forEach((val, index) => {
        const piece = document.createElement("div");
        piece.className = "puzzle-piece";
        piece.draggable = true;
        piece.dataset.index = index;
        piece.dataset.val = val; 
        
        // Calculate background position
        // val is 0-8. Grid is 3x3.
        // Row = val / 3 (integer), Col = val % 3
        const row = Math.floor(val / 3);
        const col = val % 3;
        // Background positions: 0% 0%, 50% 0%, 100% 0% ...
        // Size is 300x300. Each piece is 100x100.
        // So bg position is -100*col px -100*row px
        piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;

        if (isPuzzleSolved()) {
             piece.draggable = false;
             piece.classList.add("correct");
        }

        piece.addEventListener("dragstart", handleDragStart);
        piece.addEventListener("dragover", handleDragOver);
        piece.addEventListener("drop", handleDrop);
        
        // Touch events for mobile
        piece.addEventListener("touchstart", handleTouchStart, {passive: false});
        piece.addEventListener("touchmove", handleTouchMove, {passive: false});
        piece.addEventListener("touchend", handleTouchEnd);

        el.puzzleBoard.appendChild(piece);
    });
}

function handleDragStart(e) {
    state.draggedPiece = e.target;
    e.dataTransfer.setData("text/plain", e.target.dataset.index);
    e.target.classList.add("dragging");
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
}

function handleDrop(e) {
    e.preventDefault();
    const target = e.target;
    if (!target.classList.contains("puzzle-piece")) return;
    
    const fromIndex = parseInt(state.draggedPiece.dataset.index);
    const toIndex = parseInt(target.dataset.index);
    
    if (fromIndex !== toIndex) {
        swapPieces(fromIndex, toIndex);
    }
    
    state.draggedPiece.classList.remove("dragging");
    state.draggedPiece = null;
}

// Touch support implementation simplified: select first, tap second to swap
let selectedTouchPiece = null;
function handleTouchStart(e) {
    // e.preventDefault();
    // Simple tap-to-swap logic for touch
    const target = e.target;
    if (!target.classList.contains("puzzle-piece")) return;
    
    if (!selectedTouchPiece) {
        selectedTouchPiece = target;
        target.classList.add("dragging"); // Reusing style for selection
    } else {
        const fromIndex = parseInt(selectedTouchPiece.dataset.index);
        const toIndex = parseInt(target.dataset.index);
        
        if (fromIndex !== toIndex) {
            swapPieces(fromIndex, toIndex);
        }
        
        selectedTouchPiece.classList.remove("dragging");
        selectedTouchPiece = null;
    }
}
function handleTouchMove(e) { e.preventDefault(); }
function handleTouchEnd(e) {}

function swapPieces(fromIdx, toIdx) {
    // Audio feedback could be here
    [state.puzzleGrid[fromIdx], state.puzzleGrid[toIdx]] = [state.puzzleGrid[toIdx], state.puzzleGrid[fromIdx]];
    state.puzzleMoves++;
    renderPuzzleBoard();
    updatePuzzleStatus();
    
    checkPuzzleWin();
}

function isPuzzleSolved() {
    for (let i = 0; i < state.puzzleGrid.length; i++) {
        if (state.puzzleGrid[i] !== i) return false;
    }
    return true;
}

function checkPuzzleWin() {
    if (isPuzzleSolved()) {
        clearInterval(state.puzzleTimerInterval);
        setTimeout(() => finishPuzzle(true), 500);
    }
}

function finishPuzzle(won) {
    clearInterval(state.puzzleTimerInterval);
    if (won) {
        // Show Win Modal or just alert
        showToast(`¡Puzzle Completado! en ${60 - state.puzzleTimeLeft}s`, "success");
        setTimeout(() => {
            giveRandomPrize(); // Reuse prize logic
        }, 1000);
    } else {
        showToast("Tiempo agotado. ¡Inténtalo de nuevo!", "error");
        setTimeout(() => setScreen("home"), 2000);
    }
}

init();
