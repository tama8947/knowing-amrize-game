/**
 * 🇲🇽🌎 i18n/locales/es.js — Español (idioma base)
 *
 * Contiene: ui.* (interfaz) · biz.* (negocios) · stations.* (contenido educativo)
 */
export default {
  game: {
    title: 'Ruta de Constructores',
  },

  // ---------------------------------------------------------------
  // Interfaz
  // ---------------------------------------------------------------
  ui: {
    start: {
      subtitle: 'Construyendo América y Canadá, de la fundación al techo',
      choose: 'Elige tu personaje',
      male: 'Constructor',
      female: 'Constructora',
      maleName: 'Carlos',
      femaleName: 'María',
      begin: 'Comenzar el viaje →',
      controls: 'Controles',
      ctrlMove: 'caminar',
      ctrlJump: 'saltar',
      ctrlInspect: 'inspeccionar el equipo cercano',
      ctrlRun: 'correr',
      ctrlClose: 'cerrar',
      ctrlCamera: 'girar la cámara · rueda — zoom',
      hint: 'Acércate a los equipos de la planta para descubrir cómo se hace el cemento 🟠',
namePlaceholder: 'Escribe tu nombre…',
    nameHint: 'Así te saludaremos en cada planta 🏗️',
    },
    hud: {
      passport: 'Pasaporte de Construcción',
      backToMap: 'Volver al mapa',
      objective: 'Objetivo',
      selectDest: 'Selecciona tu destino',
      approach: 'Acércate a un equipo y pulsa E',
      northAmerica: 'Norteamérica',
    },
    card: {
      address: 'Dirección',
      region: 'Región',
      activity: 'Actividad',
      brand: 'Marca',
      coords: 'Coordenadas',
      visit: 'Viajar a la planta',
      understood: '¡Entendido! ✓',
      fact: 'Dato clave',
      close: 'Cerrar',
    },
    prompt: {
      inspect: 'Inspeccionar',
    },
    toast: {
      stamp: 'Sello obtenido',
      inspected: 'Inspeccionaste',
      travelling: 'Llegando a',
    },
    rank: {
      new: 'Nuevo ingreso',
      apprentice: 'Aprendiz',
      builder: 'Constructor',
      expert: 'Experto',
      ambassador: 'Embajador Amrize',
    },
    search: {
      placeholder: '🔍 Buscar planta o ciudad…',
      all: 'Todas',
      noResults: 'Sin resultados',
      results: 'resultados',
      filterBy: 'Filtrar por tipo',
    },
  },

  // ---------------------------------------------------------------
  // Líneas de negocio
  // ---------------------------------------------------------------
  biz: {
    aggregates: {
      icon: '🪨',
      name: 'Agregados',
      tagline: 'La base de todo',
      description: 'Rocas trituradas y arena que forman la base del concreto, el asfalto y las carreteras.',
    },
    cement: {
      icon: '🟠',
      name: 'Cemento',
      tagline: 'El pegamento de la construcción',
      description: 'El "pegamento" del concreto, fabricado cociendo piedra caliza y arcilla a altísimas temperaturas.',
    },
    concrete: {
      icon: '🔵',
      name: 'Concreto',
      tagline: 'Listo para construir',
      description: 'Cemento + agua + agregados + aditivos, mezclados con precisión y enviados frescos a la obra.',
    },
    asphalt: {
      icon: '⚫',
      name: 'Asfalto',
      tagline: 'Caminos y carreteras',
      description: 'Mezcla de agregados con ligante asfáltico para pavimentar calles y autopistas.',
    },
    roofing: {
      icon: '🟤',
      name: 'Roofing y envolvente',
      tagline: 'De la fundación al techo',
      description: 'Membranas, tejas, aislantes, adhesivos y sellantes: todo lo que protege el edificio.',
    },
    logistics: {
      icon: '🚂',
      name: 'Distribución y logística',
      tagline: '1,000+ sitios conectados',
      description: 'Camiones, trenes y puertos que llevan el producto a cada obra de Norteamérica.',
    },
  },

  // ---------------------------------------------------------------
  // Estaciones educativas
  // ---------------------------------------------------------------
  stations: {
    cantera: {
      icon: '🪨',
      title: 'Cantera de caliza',
      text: 'Todo empieza aquí: se extraen caliza y arcilla, las materias primas del cemento. Se usan equipos controlados y planes de restauración para cuidar el entorno.',
      fact: 'El cemento se fabrica cociendo caliza y arcilla a temperaturas enormes.',
    },
    trituracion: {
      icon: '⚙️',
      title: 'Trituración y molienda de crudo',
      text: 'La roca se tritura y se muele hasta obtener una fina mezcla llamada "harina cruda". Antes de entrar al horno, las materias primas se homogeneizan para lograr la receta perfecta.',
      fact: 'La receta exacta de minerales define la calidad del cemento.',
    },
    prehorno: {
      icon: '🗼',
      title: 'Prehorno (Ciclones)',
      text: 'La harina cruda sube por torres de ciclones donde los gases calientes del horno la precalientan. ¡Aprovechar el calor = menos energía y menos CO₂!',
      fact: 'Los prehornos modernos recuperan el calor del horno para ahorrar energía.',
    },
    horno: {
      icon: '🔥',
      title: 'Horno rotativo (Kiln)',
      text: 'El corazón de la planta: un enorme horno giratorio donde la mezcla alcanza unos 1,450 °C. Nacen entonces bolitas incandescentes llamadas CLINKER.',
      fact: 'El horno rotativo puede medir más de 100 metros de largo y gira sin parar.',
    },
    molino: {
      icon: '🌀',
      title: 'Molienda de cemento',
      text: 'El clinker se muele junto con yeso (que regula el tiempo de fraguado). El resultado: el cemento en polvo que conoces en los sacos y silos.',
      fact: 'Una bolsa de cemento estándar pesa 42.5 kg — ¡y rinde para muchísimo concreto!',
    },
    silos: {
      icon: '🏢',
      title: 'Silos y despacho',
      text: 'El cemento se almacena en silos gigantes y se despacha a granel en camiones cisternas… o se ensaca. Desde aquí viaja a las plantas de concreto y a las obras.',
      fact: 'Amrize opera en el 100% de los estados de EE.UU. y provincias de Canadá.',
    },
    calidad: {
      icon: '🧪',
      title: 'Laboratorio de calidad',
      text: 'Cada día se toman muestras y se prueban: finura, resistencia, fraguado. El laboratorio garantiza que cada tonelada cumpla las normas.',
      fact: 'Las probetas de cemento se prueban a los 1, 7 y 28 días para medir resistencia.',
    },
    sostenibilidad: {
      icon: '🌱',
      title: 'Sostenibilidad en Amrize',
      text: 'La planta trabaja con combustibles alternos, materiales reciclados y eficiencia energética para reducir la huella de CO₂ por tonelada de cemento.',
      fact: 'Economía circular: residuos de otros procesos se convierten en combustible o materia prima.',
    },
    camion: {
      icon: '🚚',
      title: 'Camión mezclador (Ready-Mix)',
      text: 'Transporta concreto fresco de la planta a la obra. El tambor gira sin parar para que el concreto no fragüe durante el viaje.',
      fact: 'Entregar concreto fresco es una carrera contra el reloj: empieza a fraguar en el camión.',
    },
    'ag-extraccion': {
      icon: '🚜',
      title: 'Extracción y voladura',
      text: 'En la cantera se extrae la roca con palas y voladuras controladas. Cada turno se retira el material estéril y se recupera la vegetación.',
      fact: 'Las canteras modernas planifican la restauración del terreno para que la naturaleza vuelva.',
    },
    'ag-trituracion': {
      icon: '⚙️',
      title: 'Trituración',
      text: 'Trituradoras primarias y secundarias rompen la roca. La primaria reduce el tamaño de bloque y la secundaria afina la granulometría.',
      fact: 'Cada etapa de trituración multiplica la superficie de la roca, facilitando el transporte.',
    },
    'ag-zarandeo': {
      icon: '🔲',
      title: 'Zarandeo y clasificación',
      text: 'Las cribas vibran y separan la mezcla por tamaño: 3/4", 1/2", 1/4" y arena. Así cada obra recibe exactamente la granulometría que necesita.',
      fact: 'Una granulometría bien mezclada da concreto más fuerte y resistente.',
    },
    'ag-lavado': {
      icon: '💧',
      title: 'Lavado y clasificación de la arena',
      text: 'El agua arrastra el polvo, la arcilla y la materia orgánica de la arena. El agua de lavado se recircula para no desperdiciar este recurso.',
      fact: 'La arena lavada es esencial para concreto de alta resistencia y para pavimentos.',
    },
    'ag-almacen': {
      icon: '🚛',
      title: 'Acopio y despacho',
      text: 'Los agregados se apilan por tamaño en el patio y se despachan en camiones o vagones de tren hacia obras y plantas de concreto.',
      fact: 'Amrize tiene una red de canteras y patios con entrega justo a tiempo.',
    },
    'co-dosificacion': {
      icon: '🧮',
      title: 'Dosificación (receta)',
      text: 'La computadora de la planta pesa cada material: cemento, agua, arena y gravilla. La receta varía según la resistencia y el uso que pide la obra.',
      fact: 'Un diseño de mezcla busca el concreto más resistente con el menor costo.',
    },
    'co-mezclado': {
      icon: '🌀',
      title: 'Mezclado',
      text: 'El mezclador central combina los materiales hasta obtener una mezcla homogénea. El tiempo y la velocidad son exactos: ni un segundo de más.',
      fact: 'La mezcla debe entregarse fresca: una vez colocada, ya no se puede modificar.',
    },
    'co-transporte': {
      icon: '🚚',
      title: 'Transporte a la obra',
      text: 'El camión mezclador lleva el concreto fresco. El tambor gira durante el viaje para retardar el fraguado y así llegar con calidad a la obra.',
      fact: 'El concreto se considera fresco solo unas 90 minutos tras su fabricación.',
    },
    'co-colocacion': {
      icon: '🏗️',
      title: 'Colocación y vibrado',
      text: 'Se vacía el concreto en la forma, se vibra para eliminar burbujas de aire y se deja curar con agua para que alcance su resistencia final.',
      fact: 'Un buen vibrado puede aumentar la resistencia del concreto en un 20%.',
    },
    'co-calidad': {
      icon: '🧪',
      title: 'Control de calidad',
      text: 'Se mide el asentamiento (slump), se toman cilindros de prueba y se rompen a los 7 y 28 días para confirmar la resistencia diseñada.',
      fact: 'A los 28 días es cuando se evalúa la resistencia final del concreto.',
    },
    'as-secado': {
      icon: '🔥',
      title: 'Secado y calentamiento de agregados',
      text: 'Los agregados se secan y calientan hasta unos 150-180 °C para que se adhieran bien al ligante asfáltico.',
      fact: 'El agregado seco y caliente es la clave de una mezcla durable.',
    },
    'as-mezcla': {
      icon: '🌀',
      title: 'Mezcla en caliente',
      text: 'En el tambor mezclador se combina el agregado caliente con el asfalto (ligante). Todo se produce a más de 140 °C.',
      fact: 'El asfalto es viscoelástico: a temperatura alta fluye, y al enfriarse da rigidez.',
    },
    'as-transporte': {
      icon: '🚛',
      title: 'Transporte',
      text: 'Camiones cisterna con la mezcla caliente viajan a la obra. Hay que llegar antes de que la mezcla se enfríe demasiado.',
      fact: 'La mezcla asfáltica debe compactarse antes de que su temperatura baje de 80 °C.',
    },
    'as-extendido': {
      icon: '🛣️',
      title: 'Extendido',
      text: 'La extendedora coloca la mezcla en capas parejas sobre la superficie preparada, controlando el espesor.',
      fact: 'Un buen extendido evita la segregación: que la mezcla se separe al roule.',
    },
    'as-compactado': {
      icon: '🚜',
      title: 'Compactado',
      text: 'Rodillos vibratorios y neumáticos compactan la capa hasta la densidad necesaria. Un pavimento bien compactado dura décadas.',
      fact: 'La compactación es el 80% del trabajo: la clave de un asfalto duradero.',
    },
    'as-rap': {
      icon: '♻️',
      title: 'RAP — Pavimento Reciclado',
      text: 'El asfalto viejo se fresa y se reintroduce en la planta. Es uno de los mayores ejemplos de economía circular en la construcción.',
      fact: 'Hasta el 30% del RAP puede reutilizarse: menos recursos nuevos y menos residuos.',
    },
    'ro-fabricacion': {
      icon: '🏭',
      title: 'Fabricación de membranas',
      text: 'Las láminas de EPDM, TPO y PVC se fabrican en rollos continuos, se prueban y se enrollan para enviarse a las obras.',
      fact: 'Las membranas reflectantes bajan la temperatura de los techos hasta 20 °C.',
    },
    'ro-accesorios': {
      icon: '🧰',
      title: 'Accesorios y aislamiento',
      text: 'Adhesivos, sellantes, cinta, flashing y paneles aislantes acompañan a la membrana: sin ellos, el sistema no funciona.',
      fact: 'Un techo bien instalado incluye más de 20 accesorios diferentes.',
    },
    'ro-instalacion': {
      icon: '👷',
      title: 'Instalación en la azotea',
      text: 'Se limpia la superficie, se coloca el aislamiento y la membrana se termosella en las juntas y se fija en los bordes.',
      fact: 'El sellado correcto de cada junta es lo que garantiza la impermeabilidad.',
    },
    'ro-impermeabilidad': {
      icon: '🌧️',
      title: 'Impermeabilización y garantía',
      text: 'Se hacen pruebas de fugas con agua y se documenta la instalación. Las membranas de Amrize pueden durar décadas.',
      fact: 'Una envolvente bien sellada puede reducir el consumo de calefacción hasta un 20%.',
    },
    'lo-pedido': {
      icon: '📋',
      title: 'Pedido y coordinación',
      text: 'La obra pide su producto con tiempo. El sistema coordina cantidades, tiempos y camiones para llegar a cada obra.',
      fact: 'Una red de 1,000+ sitios permite entregas en toda Norteamérica.',
    },
    'lo-planificacion': {
      icon: '🗺️',
      title: 'Planificación de rutas',
      text: 'Se elige camión, tren o barco según la distancia y la urgencia, optimizando el combustible y el tiempo.',
      fact: 'La ruta óptima puede reducir hasta un 15% las emisiones de CO₂.',
    },
    'lo-despacho': {
      icon: '🚛',
      title: 'Despacho',
      text: 'Las terminales y patios cargan camiones y vagones con una programación ordenada para que ningún cliente espere.',
      fact: 'El concreto y el asfalto frescos no pueden esperar: se despachan por orden de entrega.',
    },
    'lo-entrega': {
      icon: '📦',
      title: 'Entrega en la obra',
      text: 'El material llega a tiempo y en la cantidad correcta, directo a la zona de descarga o a la bomba de concreto.',
      fact: 'La logística es invisible para el cliente… cuando funciona bien.',
    },
    'lo-reciclaje': {
      icon: '♻️',
      title: 'Reciclaje de envases',
      text: 'Los baldes de concreto, los sacos y los pallets se devuelven para reutilizarse o reciclarse.',
      fact: 'La economía circular reduce residuos y costos a la vez.',
    },
  },
};
