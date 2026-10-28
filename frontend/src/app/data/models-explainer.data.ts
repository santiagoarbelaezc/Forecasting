export interface ExplainerStep {
  title: string;
  desc: string;
  badge: string;
}

export interface ModelExplainer {
  id: string;
  name: string;
  acronym: string;
  type: 'estadistico' | 'deep-learning';
  tagline: string;
  analogia: string;
  imageSrc: string;
  imageCaption: string;
  formula: string;
  keyPoints: string[];
  steps: ExplainerStep[];
  parametros: string;
  ventajas: string[];
  limitaciones: string[];
  rolEnEstudio: string;
  performanceBadge: string;
}

export const MODELS_EXPLAINER_DATA: ModelExplainer[] = [
  // --- ESTADÍSTICOS ---
  {
    id: 'var',
    name: 'Vector Autoregression',
    acronym: 'VAR',
    type: 'estadistico',
    tagline: 'Orquesta de series temporales donde cada instrumento responde al ritmo de los demás.',
    analogia: 'Imagina una reunión de expertos en una mesa redonda: lo que dice el economista influye en lo que dirá el meteorólogo dos minutos después, y viceversa.',
    imageSrc: '/images/models/model_var.jpg',
    imageCaption: 'Diagrama didáctico de VAR: interacción cruzada lineal de variables X1, X2, X3 en instantes t-1 y t-2 generando el vector de predicción t.',
    formula: 'y_t = c + A_1 y_{t-1} + A_2 y_{t-2} + ... + A_p y_{t-p} + ε_t',
    keyPoints: [
      'Modelo econométrico multivariado clásico con formulación matemática analítica y transparente.',
      'Cada variable en el tiempo t se predice a partir de rezagos pasados de ella misma y de todas las demás.',
      'Excelente cuando las dinámicas son lineales y las variables están fuertemente acopladas físicamente.'
    ],
    steps: [
      {
        badge: 'Paso 1: Rezagos',
        title: 'Captura de Ventana Histórica (p)',
        desc: 'Toma las observaciones pasadas de las 22 variables en los p instantes previos (p = 16 ≈ 2 h 40 min según criterio AIC).'
      },
      {
        badge: 'Paso 2: Matrices A',
        title: 'Multiplicación Matricial Lineal',
        desc: 'Aplica matrices de coeficientes A₁...Aₚ que ponderan cómo cada variable pasada afecta a cada variable futura.'
      },
      {
        badge: 'Paso 3: Recursión',
        title: 'Proyección Recursiva Multipaso',
        desc: 'Predice el instante t+1 y retroalimenta esta predicción para proyectar los pasos subsiguientes hasta completar el horizonte de 96 pasos.'
      }
    ],
    parametros: '7.766 coeficientes estimables (p = 16 con término constante)',
    ventajas: [
      'Excelente en variables termodinámicas de baja no-linealidad (Temperatura de rocío, Concentración de vapor, Humedad específica).',
      'Muy superior a las redes neuronales en Presión atmosférica (RMSE 2,55 mbar vs 4,28 mbar en TSMixer).',
      'No requiere GPU para ajustarse ni sufre de problemas de estocasticidad en entrenamiento.'
    ],
    limitaciones: [
      'Crecimiento cuadrático de parámetros O(p · K²): con muchas variables o muchos rezagos sufre sobreparametrización.',
      'Sensible a la colinealidad física entre variables duplicadas.',
      'Error global elevado en radiación solar y temperatura donde existen fuertes no-linealidades (RMSE global 151,84).'
    ],
    rolEnEstudio: 'Ganador en 5 de las 22 variables (temperatura de rocío, presión de vapor real, humedad específica, concentración de vapor y duración de lluvia).',
    performanceBadge: '5 / 22 Variables Líder'
  },
  {
    id: 'arima',
    name: 'AutoRegressive Integrated Moving Average',
    acronym: 'ARIMA',
    type: 'estadistico',
    tagline: 'El termómetro que recuerda su propio pasado y corrige sus propios errores de ayer.',
    analogia: 'Es como un conductor que ajusta el volante mirando cuánto giró en los últimos metros (AR) y corrigiendo el pequeño desvío que cometió en la última curva (MA).',
    imageSrc: '/images/models/model_arima.jpg',
    imageCaption: 'Diagrama didáctico de ARIMA(p,d,q): paso de diferenciación (I), componente autorregresivo (AR) y media móvil de errores residuales (MA).',
    formula: 'Φ(B)(1 - B)^d Y_t = c + Θ(B)ε_t',
    keyPoints: [
      'Modelo univariado por excelencia: procesa cada una de las 22 variables por separado de forma completamente aislada.',
      'Compuesto por tres partes: AR (inercia histórica), I (diferenciación para estacionariedad) y MA (corrección de shocks).',
      'Parámetros mínimos (88 en total para las 22 series), lo que evita totalmente el sobreajuste.'
    ],
    steps: [
      {
        badge: 'Paso 1: (I) Diferenciación',
        title: 'Estabilización de Tendencia (d=1)',
        desc: 'Resta cada valor con su inmediato anterior (Y_t - Y_{t-1}) para convertir series con deriva o tendencia en series estacionarias.'
      },
      {
        badge: 'Paso 2: (AR) Autorregresión',
        title: 'Ponderación de Valores Pasados (p=2)',
        desc: 'Calcula la influencia lineal de los dos últimos valores inmediatos de la propia serie temporal.'
      },
      {
        badge: 'Paso 3: (MA) Media Móvil',
        title: 'Amortiguación de Errores (q=2)',
        desc: 'Modela la perturbación aleatoria considerando los errores de predicción cometidos en los instantes precedentes.'
      }
    ],
    parametros: '88 parámetros en total (4 parámetros entrenables por serie × 22 series)',
    ventajas: [
      'El modelo más parsimonioso y ligero de todo el estudio.',
      'Ganador absoluto en Presión atmosférica (RMSE 2,516 mbar) y en Precipitación en mm (0,0269 mm).',
      'Inmune a la interferencia o ruido cruzado proveniente de otras variables no relacionadas.'
    ],
    limitaciones: [
      'Completamente ciego a las interacciones multivariadas (ej. no sabe que si sube el sol, subirá la temperatura).',
      'Pobre desempeño en radiación solar (correlación r = 0,01 con observaciones reales).',
      'Proyección recursiva que tiende a converger rápidamente hacia la media.'
    ],
    rolEnEstudio: 'Benchmark univariado de referencia. Demostró que para variables atmosféricas muy suaves (presión), la simplicidad univariada supera a las redes de millones de pesos.',
    performanceBadge: '2 / 22 Variables Líder (Presión & Precipitación)'
  },
  {
    id: 'arimax',
    name: 'ARIMA con Variables Exógenas',
    acronym: 'ARIMAX',
    type: 'estadistico',
    tagline: 'La inercia propia de una serie enriquecida con la fuerza de señales ambientales externas.',
    analogia: 'Es predecir el consumo de energía de una casa no solo con el consumo de días pasados, sino inyectando directamente el pronóstico de la temperatura exterior como variable exógena.',
    imageSrc: '/images/models/model_arimax.jpg',
    imageCaption: 'Diagrama didáctico de ARIMAX: serie objetivo endógena Y(t) procesada con ARIMA más matriz exógena X(t) con coeficientes de transferencia β.',
    formula: 'Y_t = β_1 X_{1,t} + β_2 X_{2,t} + ... + \\frac{Θ(B)}{Φ(B)(1-B)^d} ε_t',
    keyPoints: [
      'Ampliación conceptual del modelo ARIMA tradicional para admitir regresores externos.',
      'Separa la causa física externa (señal exógena X) de la dinámica interna estocástica de la serie (ARIMA).',
      'Permite responder preguntas de causa-efecto: ¿cuánto aumenta la temperatura de registro si la radiación solar sube 100 W/m²?'
    ],
    steps: [
      {
        badge: 'Paso 1: Exógenas',
        title: 'Inyección de Señales Conductoras',
        desc: 'Se identifican variables externas que condicionan la variable meta (ej. radiación solar y velocidad de viento sobre temperatura).'
      },
      {
        badge: 'Paso 2: Regresión β',
        title: 'Función de Transferencia Lineal',
        desc: 'Calcula coeficientes de ponderación beta que capturan el impacto directo contemporáneo o retardado de las exógenas.'
      },
      {
        badge: 'Paso 3: Residuo ARIMA',
        title: 'Ajuste Estocástico de Residuos',
        desc: 'El error residual de la regresión se modela con un proceso ARIMA(p,d,q) para capturar cualquier autocorrelación remanente.'
      }
    ],
    parametros: 'k coeficientes beta + parámetros ARIMA(p,d,q)',
    ventajas: [
      'Combina la robustez de ARIMA con la capacidad de incorporar factores causales conocidos.',
      'Mucho más eficiente y fácil de interpretar que un VAR completo de 22 ecuaciones simultáneas.',
      'Ideal cuando se tiene pronósticos confiables o deterministas de variables inductoras (ej. posición solar astronómica).'
    ],
    limitaciones: [
      'Requiere conocer o pronosticar las variables exógenas X en el horizonte futuro para poder predecir Y.',
      'Asume relaciones lineales entre las variables exógenas y la variable respuesta.',
      'No modela la retroalimentación bidireccional (asume que X afecta a Y, pero que Y no afecta a X).'
    ],
    rolEnEstudio: 'Referencia conceptual de puente entre el enfoque univariado aislado de ARIMA y el enfoque acoplado masivo de VAR.',
    performanceBadge: 'Referencia Conceptual'
  },

  // --- DEEP LEARNING ---
  {
    id: 'itransformer',
    name: 'iTransformer (Inverted Transformer)',
    acronym: 'iTransformer',
    type: 'deep-learning',
    tagline: 'Invierte las reglas del juego: convierte cada variable en un token para que la atención descubra sus secretos cruzados.',
    analogia: 'En vez de traducir una película cuadro por cuadro (atención temporal), iTransformer toma la pista de audio completa, la de video y la de subtítulos como tres pistas completas y aprende cómo interactúan entre sí.',
    imageSrc: '/images/models/model_itransformer.jpg',
    imageCaption: 'Diagrama didáctico de iTransformer: Inverted Embedding de variables completas en tokens, atención Multi-Head cruzada entre variables y proyección lineal directa.',
    formula: 'Token_i = Embedding(X_{:, i}) \\quad \\rightarrow \\quad MultiHeadAttention(Q_{tokens}, K_{tokens}, V_{tokens})',
    keyPoints: [
      'Arquitectura estado del arte ganadora absoluta del estudio comparativo.',
      'Inversión paradigmática: en lugar de tokens temporales O(L²), cada una de las 22 variables completas es un token (22 tokens).',
      'La atención multi-cabeza modela directamente la correlación no lineal entre variables físicas.',
      'Proyección lineal feed-forward directa al horizonte de 96 pasos en una sola pasada.'
    ],
    steps: [
      {
        badge: 'Paso 1: Inverted Embedding',
        title: 'Incrustación por Variable (96 → 64)',
        desc: 'Toda la serie temporal de 96 pasos de cada variable se proyecta a un vector denso de dimensión 64. Las 22 variables se convierten en 22 tokens.'
      },
      {
        badge: 'Paso 2: Self-Attention',
        title: 'Atención Cruzada Multi-Cabeza',
        desc: '4 capas de Transformer con 4 cabezas de atención evalúan cómo cada variable física condiciona a las demás (temperatura con radiación, humedad con presión).'
      },
      {
        badge: 'Paso 3: Proyección Directa',
        title: 'Head Lineal al Horizonte (64 → 96)',
        desc: 'Cada representación enriquecida se proyecta directamente a los 96 pasos futuros (16 horas) sin recurrencia ni acumulación de errores.'
      }
    ],
    parametros: '212.384 parámetros (4 capas encoder, dimensión 64, FFN 256, Pre-LN)',
    ventajas: [
      'Campeón indiscutible: menor error global (MAE 12,77, RMSE 47,26, nRMSE medio 0,76).',
      'Mejor modelo en 13 de 22 variables: reduce el RMSE en temperatura un 65% y en radiación un 71% frente a VAR.',
      'Altísima correlación en radiación solar (r = 0,64) y CO₂ (r = 0,70 en diagrama de Taylor).',
      'Complejidad computacional moderada: solo 212k parámetros frente a 1,36M en LSTM.'
    ],
    limitaciones: [
      'Suaviza las predicciones y subestima la variabilidad real (desviación típica predicha en CO₂: 12,76 vs 16,16 real).',
      'Superado por modelos estadísticos en variables muy persistentes como Presión atmosférica (RMSE 4,03 vs 2,51 mbar en ARIMA).',
      'Requiere ajuste fino de tasa de aprendizaje y dropout para evitar sobreajuste.'
    ],
    rolEnEstudio: 'Arquitectura ganadora global del artículo. Modelo recomendado por defecto para variables térmicas, de vapor y radiación solar.',
    performanceBadge: '🏆 Ganador Global (13 / 22 Variables)'
  },
  {
    id: 'lstm',
    name: 'Long Short-Term Memory',
    acronym: 'LSTM',
    type: 'deep-learning',
    tagline: 'La cinta transportadora recurrente con compuertas inteligentes que deciden qué recordar y qué olvidar.',
    analogia: 'Es como tomar notas durante una clase magistral de 16 horas: tachas lo que ya no sirve (compuerta de olvido), anotas lo novedoso (compuerta de entrada) y sintetizas el resumen para el examen (compuerta de salida).',
    imageSrc: '/images/models/model_lstm.jpg',
    imageCaption: 'Diagrama didáctico de la celda LSTM: flujo del Cell State C(t), compuerta de olvido f(t), compuerta de entrada i(t), candidato C~(t) y compuerta de salida o(t).',
    formula: 'C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t, \\quad h_t = o_t \\odot \\tanh(C_t)',
    keyPoints: [
      'Red neuronal recurrente icónica diseñada para aprender secuencias con dependencias temporales.',
      'Resuelve el desvanecimiento de gradiente mediante una línea directa de memoria (estado de celda).',
      'Estructura con el mayor volumen de parámetros del estudio (1,36 millones).'
    ],
    steps: [
      {
        badge: 'Paso 1: Forget Gate',
        title: 'Compuerta de Olvido (f_t)',
        desc: 'Una función sigmoide evalúa la entrada actual x_t y el estado previo h_{t-1} para decidir entre 0 (borrar) y 1 (mantener) la memoria anterior C_{t-1}.'
      },
      {
        badge: 'Paso 2: Input Gate',
        title: 'Compuerta de Entrada y Candidato',
        desc: 'Calcula qué nueva información se incorporará al estado de celda mediante un filtro sigmoide i_t y un candidato tanh C~_t.'
      },
      {
        badge: 'Paso 3: Output Gate',
        title: 'Generación del Estado Oculto (h_t)',
        desc: 'La compuerta o_t modula el estado de celda activado por tanh para emitir el nuevo vector oculto que alimenta a la siguiente capa.'
      }
    ],
    parametros: '1.355.840 parámetros (2 capas apiladas con 256 celdas ocultas + capa de salida)',
    ventajas: [
      'Capacidad teórica masiva para modelar dinámicas no lineales secuenciales complejas.',
      'Mejoró sustancialmente a VAR en variables de radiación solar y temperatura (RMSE global 78,06 vs 151,84).',
      'Históricamente el estándar de oro en predicción de secuencias meteorológicas.'
    ],
    limitaciones: [
      'No ganó en ninguna de las 22 variables del estudio.',
      'Sobreajuste severo en entrenamiento: la mejor época de validación fue la primera (época 1).',
      'Costo computacional y memoria elevados debido al paso secuencial paso a paso.'
    ],
    rolEnEstudio: 'Evidencia empírica de que mayor cantidad de parámetros (1,36M) no garantiza mejor pronóstico frente a arquitecturas modernas especializadas.',
    performanceBadge: 'Modelo Recurrente Base'
  },
  {
    id: 'tsmixer',
    name: 'TSMixer (All-MLP)',
    acronym: 'TSMixer',
    type: 'deep-learning',
    tagline: 'La potencia del Deep Learning sin atención ni recurrencia: pura mezcla lineal alternada ultraeficiente.',
    analogia: 'Es como batir un cóctel en dos direcciones: primero revuelves el tiempo de arriba a abajo, y luego mezclas los ingredientes de izquierda a derecha con saltos directos.',
    imageSrc: '/images/models/model_tsmixer.jpg',
    imageCaption: 'Diagrama didáctico de TSMixer: bloques alternados de Time Mixing (a través del tiempo) y Feature Mixing (a través de variables) con capas residuales y LayerNorm.',
    formula: 'Z = Norm(X + MLP_{time}(X^T)^T), \\quad Y = Norm(Z + MLP_{feat}(Z))',
    keyPoints: [
      'Arquitectura moderna creada por Google Cloud AI Research basada exclusivamente en MLPs.',
      'Desacopla formalmente dos problemas: la dinámica temporal (Time Mixing) de las correlaciones entre variables (Feature Mixing).',
      'Extremadamente ligera: solo 40.188 parámetros (33 veces más pequeña que LSTM).'
    ],
    steps: [
      {
        badge: 'Paso 1: Time Mixing',
        title: 'Mezcla en Dimensión Temporal',
        desc: 'Un MLP opera a lo largo de los 96 pasos de tiempo de cada variable individual para extraer patrones periódicos e inercia temporal.'
      },
      {
        badge: 'Paso 2: Conexión Residual',
        title: 'Suma de Salto y Normalización',
        desc: 'Añade la entrada original al resultado y aplica LayerNorm para garantizar estabilidad numérica sin gradientes desvanecidos.'
      },
      {
        badge: 'Paso 3: Feature Mixing',
        title: 'Mezcla en Dimensión de Variables',
        desc: 'Un segundo MLP opera sobre el eje de las 22 características para capturar relaciones termodinámicas cruzadas entre variables.'
      }
    ],
    parametros: '40.188 parámetros (2 bloques con 64 unidades ocultas, GELU, LayerNorm y dropout 0,1)',
    ventajas: [
      'Segundo mejor modelo en el ranking global (RMSE 55,06, nRMSE 0,84) superando holgadamente a LSTM, ARIMA y VAR.',
      'Ganador en Velocidad del Viento (RMSE 1,244 m/s) y en Dirección Coseno (0,508).',
      'Impresionante eficiencia computacional: entrenamiento ultrarrápido y mínimo consumo de memoria.'
    ],
    limitaciones: [
      'Presentó sesgo medio sistemático de ~7,7 puntos porcentuales en humedad relativa (RMSE 12,13 vs RMSE centrado 9,39).',
      'Quedó un 26% por detrás de iTransformer en MSE global.',
      'Al igual que las demás redes neuronales, no superó a los modelos estadísticos en Presión atmosférica.'
    ],
    rolEnEstudio: 'La sorpresa de eficiencia: el segundo mejor modelo general con menos del 3% de los parámetros de LSTM.',
    performanceBadge: '⚡ 2º Mejor Global (Más Eficiente)'
  }
];
