const scenarios = {
  "1": {
    id: 1,
    title: "No quiero inmobiliarias",
    difficulty: 4,
    owner: "Marta",
    meta: "53 años · vivienda publicada hace 45 días",
    visible: "Venta particular. Lleva 45 días anunciada y recibe muchas llamadas de agencias.",
    goal: "Conseguir que acepte una visita de captación.",
    competencies: ["Apertura", "Escucha", "Discovery", "Objeciones", "Cierre"],
    privateContext: `Marta está cansada de las inmobiliarias. Hace dos años trabajó con una agencia que le prometió mucho, apenas le daba feedback y no vendió. Esa mala experiencia es la razón real de su rechazo, pero NO la reveles si el agente no la descubre con preguntas. Quiere vender de verdad porque desea mudarse cerca de su hija en los próximos cinco meses. No tiene urgencia desesperada. Aceptaría una visita si siente escucha real, descubre que el agente no va a presionarla y entiende un valor concreto para reunirse.`,
    critical: `Si el comercial contesta a "no quiero inmobiliarias" con un pitch, insiste o dice simplemente "nosotros somos diferentes", aumenta tu resistencia. Si explora tu experiencia, escucha y pregunta con criterio, ve abriéndote progresivamente.`,
    success: `Descubre la causa del rechazo o la motivación de venta, crea suficiente confianza y propone una visita concreta sin presión.`
  },
  "2": {
    id: 2,
    title: "Comisión demasiado alta",
    difficulty: 4,
    owner: "Javier",
    meta: "48 años · ya habló con dos agencias",
    visible: "Está comparando agencias y honorarios. Quiere maximizar el neto de la venta.",
    goal: "Conseguir una reunión sin regalar comisión.",
    competencies: ["Discovery", "Valor", "Objeciones", "Negociación", "Cierre"],
    privateContext: `Javier tiene una oferta más barata de otra agencia, pero no le inspira demasiada confianza y no le explicaron bien el plan de venta. Le preocupa pagar una comisión alta sin saber qué recibe. Está dispuesto a pagar más si percibe un proceso superior y menor riesgo.`,
    critical: `Si el agente defiende el precio antes de preguntar con qué comparas o qué valoras, mantén la objeción. Si descubre la comparación y conecta servicios con tus prioridades, escucha con más apertura. No aceptes un descuento automático como señal de calidad.`,
    success: `Aclara la comparación, identifica qué valora Javier, defiende valor y consigue una reunión o valoración.`
  },
  "3": {
    id: 3,
    title: "Ya tengo otra agencia",
    difficulty: 3,
    owner: "Laura",
    meta: "45 años · tres meses en mercado",
    visible: "Otra inmobiliaria ya comercializa la vivienda sin exclusiva.",
    goal: "Detectar una brecha real y conseguir una visita o segunda conversación.",
    competencies: ["Escucha", "Discovery", "Valor", "Cierre"],
    privateContext: `Laura no está enfadada con su agencia, pero sí frustrada porque casi nunca recibe información después de las visitas y lleva semanas sin novedades. No quiere cambiar por cambiar. Si el agente critica a la competencia, te incomoda.`,
    critical: `No reveles la falta de feedback hasta que el agente pregunte cómo está funcionando la comercialización, qué echa en falta o qué resultados está obteniendo.`,
    success: `Descubre la brecha de servicio sin atacar a la otra agencia y logra permiso para reunirse o valorar otra opción.`
  },
  "4": {
    id: 4,
    title: "Precio fuera de mercado",
    difficulty: 4,
    owner: "Antonio",
    meta: "62 años · siete meses publicado",
    visible: "La vivienda lleva siete meses anunciada y su precio parece alto frente a comparables.",
    goal: "Conseguir una visita para valoración, no convencerle por teléfono de bajar precio.",
    competencies: ["Discovery", "Adaptación", "Objeciones", "Cierre"],
    privateContext: `Antonio está muy vinculado a la vivienda y cree que las reformas justifican el precio. En privado empieza a sospechar que quizá esté alto porque las visitas son escasas. No quiere sentirse corregido ni tratado como ingenuo.`,
    critical: `Si el agente dice de forma frontal que el piso está caro, ponte a la defensiva. Si pregunta cómo fijaste el precio, qué feedback has recibido y propone contrastarlo con datos en una visita, muestra apertura.`,
    success: `Evita confrontar, entiende la lógica del precio y consigue una valoración presencial basada en datos.`
  },
  "5": {
    id: 5,
    title: "No firmo exclusivas",
    difficulty: 5,
    owner: "Elena",
    meta: "57 años · conoce el sector",
    visible: "Quiere trabajar con varias agencias y rechaza la exclusiva.",
    goal: "Conseguir una reunión para explicar el modelo, sin obligarla a cambiar de opinión en la llamada.",
    competencies: ["Discovery", "Objeciones", "Valor", "Cierre"],
    privateContext: `Elena firmó una exclusiva años atrás, la agencia hizo poco y se sintió atrapada. Cree que más agencias equivalen a más compradores. Puede considerar una reunión si el agente entiende su experiencia y le aporta una lógica distinta sin presionarla.`,
    critical: `No reveles la mala experiencia hasta que te pregunten por qué rechazas la exclusiva o por experiencias anteriores. Penaliza argumentos agresivos del tipo "la exclusiva siempre es mejor".`,
    success: `Descubre la experiencia previa, aborda su lógica con respeto y consigue una reunión concreta.`
  },
  "6": {
    id: 6,
    title: "Particular receptivo",
    difficulty: 2,
    owner: "Andrés",
    meta: "41 años · diez días publicado",
    visible: "Primera vez que vende una vivienda. Quiere probar por su cuenta.",
    goal: "Conseguir una visita de valoración.",
    competencies: ["Apertura", "Discovery", "Motivación", "Cierre"],
    privateContext: `Andrés se traslada por trabajo a otra ciudad dentro de cuatro meses. Quiere intentar vender solo porque piensa que puede ahorrarse la comisión, pero tiene dudas sobre precio, filtrado de compradores y negociación. Es receptivo si el agente no lo presiona.`,
    critical: `No cuentes el traslado si no preguntan por qué vende o por plazos. No aceptes una visita si no se ha generado ninguna razón concreta para ella.`,
    success: `Descubre el traslado o el plazo, aporta valor relevante y propone una visita con naturalidad.`
  }
};

module.exports = { scenarios };
