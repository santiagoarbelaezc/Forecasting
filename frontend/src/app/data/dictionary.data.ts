export interface DictionaryEntry {
  id: string;
  term: string;
  category: 'Modelos' | 'Variables Meteorológicas' | 'Conceptos Estadísticos' | 'Métricas' | 'Deep Learning' | 'Metodología';
  shortDesc: string;
  extendedDesc: string;
  unitOrFormula?: string;
  inThisStudy?: string;
  relatedSectionId?: string;
  tags: string[];
}

export const DICTIONARY_DATA: DictionaryEntry[] = [
  // --- MODELOS ---
  {
    id: 'var',
    term: 'VAR (Vector Autoregression)',
    category: 'Modelos',
    shortDesc: 'Modelo econométrico y estadístico multivariado lineal que captura la interdependencia mutua entre múltiples series temporales a través de rezagos.',
    extendedDesc: 'En un modelo VAR de orden p, cada variable es modelada como una combinación lineal de sus propios valores pasados y de los valores pasados de todas las demás variables del sistema. Proporciona una formulación matemática transparente pero sufre de crecimiento cuadrático de parámetros con el número de variables.',
    unitOrFormula: 'y_t = c + A_1 y_{t-1} + ... + A_p y_{t-p} + ε_t',
    inThisStudy: 'Ajustado con orden p = 16 (≈ 2 h 40 min) seleccionado por AIC. Logró el mejor desempeño en 5 variables relacionadas con humedad/vapor y duración de lluvia.',
    relatedSectionId: 'section-var',
    tags: ['Estadístico', 'Multivariado', 'Lineal', 'Rezagos']
  },
  {
    id: 'arima',
    term: 'ARIMA (AutoRegressive Integrated Moving Average)',
    category: 'Modelos',
    shortDesc: 'Modelo estadístico univariado clásico compuesto por términos autorregresivos (p), diferenciación para estacionariedad (d) y media móvil de errores pasados (q).',
    extendedDesc: 'ARIMA(p, d, q) asume que los valores futuros son una combinación lineal de valores pasados y errores residuales de pronósticos previos, previa diferenciación para eliminar tendencias no estacionarias.',
    unitOrFormula: 'ARIMA(p, d, q)',
    inThisStudy: 'Configurado como 22 modelos ARIMA(2,1,2) independientes (uno por variable). Superó a las arquitecturas neuronales en Presión atmosférica y Precipitación.',
    relatedSectionId: 'section-modelos-config',
    tags: ['Estadístico', 'Univariado', 'Benchmark', 'Box-Jenkins']
  },
  {
    id: 'arimax',
    term: 'ARIMAX (ARIMA con Variables Exógenas)',
    category: 'Modelos',
    shortDesc: 'Extensión de ARIMA que incorpora variables explicativas externas (exógenas) contemporáneas o retardadas para mejorar la predicción de la serie objetivo.',
    extendedDesc: 'Permite que una serie primaria dependa tanto de su propia dinámica temporal interna como de factores ambientales externos que actúan como inductores directos (ej. temperatura influenciada por radiación solar).',
    unitOrFormula: 'Y_t = β X_t + ARIMA(p,d,q)',
    inThisStudy: 'Analizado como referencia conceptual para ilustrar cómo los modelos estadísticos univariados pueden incorporar variables externas sin llegar a la formulación matricial completa de un VAR.',
    relatedSectionId: 'section-marco-conceptual',
    tags: ['Estadístico', 'Exógenas', 'Transfer Function', 'Referencia']
  },
  {
    id: 'lstm',
    term: 'LSTM (Long Short-Term Memory)',
    category: 'Modelos',
    shortDesc: 'Red neuronal recurrente (RNN) con compuertas reguladoras de memoria diseñada para recordar información a largo plazo y mitigar el desvanecimiento de gradiente.',
    extendedDesc: 'Cuenta con tres compuertas principales (olvido, entrada y salida) y una línea de transporte llamada "estado de celda" que preserva gradientes constantes a lo largo de pasos de tiempo extensos.',
    unitOrFormula: 'f_t, i_t, C_t, o_t, h_t',
    inThisStudy: 'Red de 2 capas apiladas con 256 unidades ocultas (1.355.840 parámetros). Genera 96 pasos en salida directa. Mostró sobreajuste temprano (mejor época: 1).',
    relatedSectionId: 'section-lstm',
    tags: ['Deep Learning', 'Recurrente', 'Compuertas', 'Memoria']
  },
  {
    id: 'tsmixer',
    term: 'TSMixer (All-MLP Architecture)',
    category: 'Modelos',
    shortDesc: 'Arquitectura moderna de Deep Learning basada exclusivamente en perceptrones multicapa (MLPs) que desacopla la mezcla temporal de la mezcla de variables.',
    extendedDesc: 'Aplica secuencialmente transformaciones Time Mixing (MLP sobre pasos temporales) y Feature Mixing (MLP sobre canales de variables) con capas residuales y LayerNorm, alcanzando alto rendimiento con costo computacional mínimo.',
    unitOrFormula: 'Time-Mixing MLP + Feature-Mixing MLP',
    inThisStudy: 'Dos bloques apilados con 64 unidades ocultas (solo 40.188 parámetros). Segundo mejor modelo global (nRMSE medio 0,84) y ganador en velocidad de viento y dirección coseno.',
    relatedSectionId: 'section-tsmixer',
    tags: ['Deep Learning', 'MLP', 'Eficiente', 'Ligero']
  },
  {
    id: 'itransformer',
    term: 'iTransformer (Inverted Transformer)',
    category: 'Modelos',
    shortDesc: 'Arquitectura basada en Transformers que invierte las dimensiones de atención: cada serie de tiempo individual completa se procesa como un token de entrada.',
    extendedDesc: 'Al tratar cada variable en toda la ventana histórica como un token mediante Inverted Embedding, la atención multi-cabeza modela explícitamente las correlaciones e interacciones entre diferentes variables físicas.',
    unitOrFormula: 'Attention(Q, K, V) sobre tokens de variables',
    inThisStudy: 'Encoder de 4 capas con 4 cabezas de atención (212.384 parámetros). Modelo ganador global absoluto (RMSE 47,26, nRMSE 0,76) dominando 13 de las 22 variables.',
    relatedSectionId: 'section-itransformer',
    tags: ['Deep Learning', 'Transformer', 'Atención Invertida', 'Ganador']
  },

  // --- VARIABLES METEOROLÓGICAS ---
  {
    id: 'var-presion',
    term: 'Presión Atmosférica (p)',
    category: 'Variables Meteorológicas',
    shortDesc: 'Fuerza ejercida por el peso de la columna de aire sobre la superficie terrestre.',
    extendedDesc: 'Presenta alta persistencia física y variaciones suaves. Los modelos estadísticos sencillos capturan su dinámica mejor que las redes complejas.',
    unitOrFormula: 'mbar (milibares / hPa)',
    inThisStudy: 'Ganador: ARIMA (RMSE 2,516 mbar) y VAR (2,553 mbar). Las redes neuronales tuvieron un RMSE ~60% mayor debido al suavizado excesivo.',
    tags: ['Presión', 'Persistencia', 'Estadístico']
  },
  {
    id: 'var-temp',
    term: 'Temperatura del Aire (T)',
    category: 'Variables Meteorológicas',
    shortDesc: 'Medición de la energía cinética promedio de las moléculas del aire ambiente.',
    extendedDesc: 'Exhibe ciclos diurnos (día/noche) y estacionales (anuales) de gran amplitud.',
    unitOrFormula: '°C (grados Celsius)',
    inThisStudy: 'Ganador: iTransformer (RMSE 2,154 °C, reducción del 65% frente a VAR).',
    tags: ['Térmica', 'Ciclo Diurno', 'Ciclo Anual']
  },
  {
    id: 'var-pot-temp',
    term: 'Temperatura Potencial (θ)',
    category: 'Variables Meteorológicas',
    shortDesc: 'Temperatura que adquiriría una masa de aire si se llevara adiabáticamente a una presión estándar de 1000 mbar.',
    extendedDesc: 'Variable termodinámica conservativa útil para estudiar la estabilidad atmosférica.',
    unitOrFormula: 'K (Kelvin)',
    inThisStudy: 'Ganador: iTransformer (RMSE 2,202 K).',
    tags: ['Térmica', 'Termodinámica']
  },
  {
    id: 'var-dew-temp',
    term: 'Temperatura de Rocío (Tdew)',
    category: 'Variables Meteorológicas',
    shortDesc: 'Temperatura a la cual el aire debe enfriarse para que el vapor se condense en gotas líquidas.',
    extendedDesc: 'Indicador directo del contenido absoluto de humedad presente en la masa de aire.',
    unitOrFormula: '°C (grados Celsius)',
    inThisStudy: 'Ganador: VAR (RMSE 1,821 °C), aunque la diferencia con los otros 4 modelos fue inferior al 4%.',
    tags: ['Humedad', 'Termodinámica']
  },
  {
    id: 'var-rh',
    term: 'Humedad Relativa (rh)',
    category: 'Variables Meteorológicas',
    shortDesc: 'Porcentaje de vapor de agua presente en el aire respecto al máximo que podría retener a esa temperatura.',
    extendedDesc: 'Inversamente proporcional a la temperatura diurna. Presenta un fuerte ciclo de 24 horas.',
    unitOrFormula: '% (porcentaje)',
    inThisStudy: 'Ganador: iTransformer (RMSE 10,19%, mejora del 59% respecto a VAR con 24,62%).',
    tags: ['Humedad', 'Ciclo Diurno']
  },
  {
    id: 'var-vps',
    term: 'Presión de Vapor de Saturación (VPmax)',
    category: 'Variables Meteorológicas',
    shortDesc: 'Presión máxima ejercida por el vapor de agua en equilibrio termodinámico a una temperatura dada.',
    extendedDesc: 'Función exponencial no lineal de la temperatura calculada mediante la relación de Clausius-Clapeyron.',
    unitOrFormula: 'mbar',
    inThisStudy: 'Ganador: iTransformer (RMSE 1,476 mbar frente a 5,541 mbar en VAR).',
    tags: ['Vapor', 'No Lineal']
  },
  {
    id: 'var-vpd',
    term: 'Déficit de Presión de Vapor (VPD)',
    category: 'Variables Meteorológicas',
    shortDesc: 'Diferencia entre la presión de vapor saturada y la real; fuerza impulsora de la evaporación y transpiración vegetal.',
    extendedDesc: 'Mide la "sed" de la atmósfera. Clave en agronomía y balances hidrológicos.',
    unitOrFormula: 'mbar',
    inThisStudy: 'Ganador: iTransformer (RMSE 1,151 mbar).',
    tags: ['Vapor', 'Evapotranspiración']
  },
  {
    id: 'var-swr',
    term: 'Radiación de Onda Corta (SWDR)',
    category: 'Variables Meteorológicas',
    shortDesc: 'Flujo de radiación solar incidente (directa y difusa) proveniente del sol sobre el suelo.',
    extendedDesc: 'Cero estricto durante la noche con picos intensos en el mediodía solar modulados por nubosidad.',
    unitOrFormula: 'W/m² (Watts por metro cuadrado)',
    inThisStudy: 'Ganador: iTransformer (RMSE 62,80 W/m² frente a 215,87 W/m² de VAR, reducción del 71%). Correlación de 0,64 vs 0,21 en VAR.',
    tags: ['Radiación', 'Solar', 'Ciclo Diurno']
  },
  {
    id: 'var-par',
    term: 'PAR (Radiación Fotosintéticamente Activa)',
    category: 'Variables Meteorológicas',
    shortDesc: 'Fracción del espectro de luz solar (400 a 700 nm) que los organismos fotosintéticos pueden aprovechar.',
    extendedDesc: 'Estrechamente acoplada a la radiación solar global incidente.',
    unitOrFormula: 'µmol/m²/s',
    inThisStudy: 'Ganador: iTransformer (RMSE 119,75 µmol/m²/s frente a 424,25 de VAR).',
    tags: ['Radiación', 'Biología']
  },
  {
    id: 'var-co2',
    term: 'Concentración de CO₂',
    category: 'Variables Meteorológicas',
    shortDesc: 'Proporción de dióxido de carbono presente en el aire atmosférico local.',
    extendedDesc: 'Afectado por respiración biológica nocturna, fotosíntesis diurna e inversiones térmicas locales.',
    unitOrFormula: 'ppm (partes por millón)',
    inThisStudy: 'Ganador: iTransformer (RMSE 11,68 ppm, correlación 0,70 en diagrama de Taylor).',
    tags: ['Gases', 'Calidad de Aire']
  },
  {
    id: 'var-precip',
    term: 'Precipitación y Lluvia',
    category: 'Variables Meteorológicas',
    shortDesc: 'Volumen de agua líquida caída en el intervalo de 10 minutos.',
    extendedDesc: 'Serie fuertemente esparsa con gran cantidad de ceros (mediana y tercer cuartil iguales a 0). Reto mayor para funciones de pérdida MSE.',
    unitOrFormula: 'mm (milímetros) y s (segundos)',
    inThisStudy: 'Ganador en mm: ARIMA (0,0269 mm). Ganador en duración: VAR (100,41 s). nRMSE > 0,98 para todos los modelos.',
    tags: ['Lluvia', 'Esparsa', 'Difícil']
  },
  {
    id: 'var-viento',
    term: 'Velocidad y Dirección del Viento',
    category: 'Variables Meteorológicas',
    shortDesc: 'Magnitud vectorial de movimiento del aire y descomposición trigonométrica (seno y coseno) de su orientación.',
    extendedDesc: 'La transformación circular en seno y coseno evita la discontinuidad artificial entre 359° y 1°.',
    unitOrFormula: 'm/s (velocidad) y adimensional [-1, 1] (seno/coseno)',
    inThisStudy: 'Ganador en velocidad media: TSMixer (1,244 m/s). Ganador en velocidad máxima: iTransformer (1,856 m/s).',
    tags: ['Dinámica', 'Viento', 'Vectores']
  },

  // --- CONCEPTOS ESTADÍSTICOS ---
  {
    id: 'estacionariedad',
    term: 'Estacionariedad en Series Temporales',
    category: 'Conceptos Estadísticos',
    shortDesc: 'Propiedad en la cual la media, la varianza y la estructura de autocorrelación no varían a lo largo del tiempo.',
    extendedDesc: 'Requisito fundamental para la validez de modelos autorregresivos lineales tradicionales como VAR y ARMA.',
    unitOrFormula: 'E[y_t] = μ, Var(y_t) = σ^2',
    inThisStudy: 'Se contrastó mediante la prueba ADF para validar el ajuste de VAR en niveles.',
    relatedSectionId: 'section-analisis-estadistico',
    tags: ['Estadística', 'Propiedad', 'ADF']
  },
  {
    id: 'prueba-adf',
    term: 'Prueba de Dickey-Fuller Aumentada (ADF)',
    category: 'Conceptos Estadísticos',
    shortDesc: 'Contraste estadístico de hipótesis para determinar si una serie temporal contiene una raíz unitaria (es no estacionaria).',
    extendedDesc: 'La hipótesis nula H0 postula la presencia de raíz unitaria. Si p < 0,05 se rechaza H0, concluyendo que la serie es estacionaria.',
    unitOrFormula: 'Δy_t = α + β t + γ y_{t-1} + Σ δ_s Δy_{t-s} + ε_t',
    inThisStudy: 'Se rechazó la hipótesis nula al 5% en las 21 series originales (p < 0,05), respaldando el modelado de VAR sin necesidad de diferenciación.',
    relatedSectionId: 'section-analisis-estadistico',
    tags: ['Hipótesis', 'Raíz Unitaria', 'Validación']
  },
  {
    id: 'aic',
    term: 'Criterio de Información de Akaike (AIC)',
    category: 'Conceptos Estadísticos',
    shortDesc: 'Métrica de selección de modelos que premia el ajuste de bondad mientras penaliza fuertemente la cantidad de parámetros para prevenir sobreajuste.',
    extendedDesc: 'Calcula AIC = 2k - 2ln(L), donde k es el número de parámetros y L es la verosimilitud máxima.',
    unitOrFormula: 'AIC = 2k - 2 ln(L)',
    inThisStudy: 'Utilizado para seleccionar el orden óptimo de rezagos en VAR, fijando p = 16 (≈ 2 h 40 min).',
    relatedSectionId: 'section-modelos-config',
    tags: ['Optimización', 'Parsimonia', 'Rezagos']
  },
  {
    id: 'sliding-window',
    term: 'Ventana Deslizante (Sliding Window)',
    category: 'Conceptos Estadísticos',
    shortDesc: 'Técnica de partición que extrae secuencias consecutivas de longitud fija L como entrada y H como horizonte de predicción con paso fijo.',
    extendedDesc: 'Permite transformar una serie temporal continua en un conjunto de entrenamiento supervisado de pares (X, Y).',
    unitOrFormula: 'Entrada L=96 pasos (16h) → Salida H=96 pasos (16h)',
    inThisStudy: 'Generó 36.704 ventanas de entrenamiento, 7.713 de validación y 7.714 de prueba sin cruzar fronteras cronológicas.',
    relatedSectionId: 'section-preproc',
    tags: ['Preparación', 'Supervisado', 'CRISP-DM']
  },
  {
    id: 'direct-vs-recursive',
    term: 'Estrategia Directa vs. Recursiva',
    category: 'Conceptos Estadísticos',
    shortDesc: 'Diferencia en cómo se proyectan múltiples pasos hacia el futuro.',
    extendedDesc: 'La estrategia directa proyecta los H pasos simultáneamente en una sola pasada de red neuronal (sin acumulación de errores paso a paso). La estrategia recursiva predice t+1 y retroalimenta la predicción como entrada para t+2.',
    unitOrFormula: 'Directa: f(X) = [Y_1 ... Y_H] | Recursiva: y_{t+1} = f(y_t)',
    inThisStudy: 'LSTM, TSMixer e iTransformer utilizaron estrategia directa (96 pasos); VAR y ARIMA emplearon estrategia recursiva.',
    relatedSectionId: 'section-modelos-config',
    tags: ['Estrategia', 'Multipaso', 'Acumulación de Error']
  },

  // --- MÉTRICAS ---
  {
    id: 'mae',
    term: 'Error Absoluto Medio (MAE)',
    category: 'Métricas',
    shortDesc: 'Promedio aritmético de las magnitudes absolutas de las diferencias entre valores observados y pronosticados.',
    extendedDesc: 'Pesa todos los errores proporcionalmente sin elevarlos al cuadrado, siendo robusto ante valores atípicos esporádicos.',
    unitOrFormula: 'MAE = (1/N) Σ |y_i - ŷ_i|',
    inThisStudy: 'iTransformer obtuvo el menor MAE global (12,77), frente a 17,65 de TSMixer y 50,78 de VAR.',
    relatedSectionId: 'section-evaluacion-metricas',
    tags: ['Métrica', 'Robustez', 'Global']
  },
  {
    id: 'rmse',
    term: 'Raíz del Error Cuadrático Medio (RMSE)',
    category: 'Métricas',
    shortDesc: 'Raíz cuadrada del promedio de errores al cuadrado. Penaliza de forma cuadrática y severa los errores grandes.',
    extendedDesc: 'Tiene las mismas unidades físicas que la variable evaluada, facilitando su interpretación directa en °C, mbar, etc.',
    unitOrFormula: 'RMSE = √[(1/N) Σ (y_i - ŷ_i)^2]',
    inThisStudy: 'Métrica central del artículo. iTransformer lideró con RMSE 47,26.',
    relatedSectionId: 'section-evaluacion-metricas',
    tags: ['Métrica', 'Penalización', 'Estándar']
  },
  {
    id: 'nrmse',
    term: 'RMSE Normalizado (nRMSE)',
    category: 'Métricas',
    shortDesc: 'Cociente entre el RMSE de una variable y su desviación estándar observada en el conjunto de prueba.',
    extendedDesc: 'Elimina el sesgo de escala física. Un nRMSE < 1 indica que el modelo predice mejor que simplemente usar la media histórica constante.',
    unitOrFormula: 'nRMSE_j = RMSE_j / σ_j',
    inThisStudy: 'Promedio de 22 variables: iTransformer 0,76; TSMixer 0,84; LSTM 0,98; ARIMA 1,01; VAR 1,61.',
    relatedSectionId: 'section-evaluacion-metricas',
    tags: ['Métrica', 'Invariante a Escala', 'Normalización']
  },
  {
    id: 'taylor-diagram',
    term: 'Diagrama de Taylor',
    category: 'Métricas',
    shortDesc: 'Gráfico bidimensional polar que resume simultáneamente el coeficiente de correlación, la desviación estándar y el RMSE centrado.',
    extendedDesc: 'Basado en la descomposición geométrica del error: RMSE² = RMSEc² + sesgo². Permite ver si un modelo capta el patrón pero falla en amplitud o fase.',
    unitOrFormula: 'RMSE^2 = RMSE_c^2 + sesgo^2',
    inThisStudy: 'Figura 13 del artículo para la variable CO₂, demostrando que iTransformer alcanza correlación 0,70 pero subestima la amplitud real (12,76 vs 16,16).',
    relatedSectionId: 'section-resultados',
    tags: ['Visualización', 'Correlación', 'Amplitud']
  },

  // --- DEEP LEARNING ---
  {
    id: 'inverted-embedding',
    term: 'Inverted Embedding (Incrustación Invertida)',
    category: 'Deep Learning',
    shortDesc: 'Técnica de iTransformer donde la serie temporal completa de una variable a lo largo del tiempo se proyecta como un único vector de token.',
    extendedDesc: 'Invierte el enfoque convencional de NLP donde cada paso de tiempo t era un token. Permite que la atención capture la matriz de covarianza y dependencias multivariadas cruzadas.',
    unitOrFormula: 'Token_i = LinearProjection(X_{:, i})',
    inThisStudy: 'Proyección de 96 pasos temporales históricos hacia vectores de dimensión 64 por variable.',
    relatedSectionId: 'section-itransformer',
    tags: ['iTransformer', 'Token', 'Atención']
  },
  {
    id: 'residual-connections',
    term: 'Conexiones Residuales (Skip Connections)',
    category: 'Deep Learning',
    shortDesc: 'Rutas que suman la entrada de una capa directamente a su salida: F(x) + x.',
    extendedDesc: 'Permiten que los gradientes fluyan sin atenuación hacia las primeras capas durante la retropropagación, facilitando el entrenamiento de arquitecturas profundas.',
    unitOrFormula: 'Salida = F(x) + x',
    inThisStudy: 'Presentes en todos los bloques de TSMixer e iTransformer con normalización previa (Pre-LN).',
    relatedSectionId: 'section-tsmixer',
    tags: ['Arquitectura', 'Gradientes', 'Estabilidad']
  },
  {
    id: 'adamw',
    term: 'Optimizador AdamW',
    category: 'Deep Learning',
    shortDesc: 'Variante de Adam que desacopla la regularización por decaimiento de pesos (weight decay) de las actualizaciones de gradiente adaptativo.',
    extendedDesc: 'Mejora sustancialmente la generalización frente a Adam estándar en modelos de aprendizaje profundo.',
    unitOrFormula: 'Decaimiento de pesos = 10^-4',
    inThisStudy: 'Utilizado para entrenar LSTM, TSMixer e iTransformer con recorte de gradiente de norma 1,0.',
    relatedSectionId: 'section-modelos-config',
    tags: ['Optimizador', 'Gradiente', 'Generalización']
  },

  // --- METODOLOGÍA ---
  {
    id: 'crisp-dm',
    term: 'Metodología CRISP-DM',
    category: 'Metodología',
    shortDesc: 'Estándar metodológico (Cross-Industry Standard Process for Data Mining) para estructurar proyectos de ciencia de datos y minería predictiva.',
    extendedDesc: 'Comprende 6 fases cíclicas: Comprensión del negocio, Comprensión de los datos, Preparación de los datos, Modelado, Evaluación y Despliegue.',
    inThisStudy: 'Figura 7 del artículo. Guía las etapas experimentales desde el análisis exploratorio hasta la evaluación comparativa en ventanas de prueba.',
    relatedSectionId: 'section-desarrollo',
    tags: ['Metodología', 'Estándar', 'Ingeniería']
  },
  {
    id: 'particion-cronologica',
    term: 'Partición Cronológica (Train / Val / Test)',
    category: 'Metodología',
    shortDesc: 'División estricta de datos en el tiempo sin barajado aleatorio para evitar fuga de información del futuro hacia el pasado (data leakage).',
    extendedDesc: 'En series temporales el barajado viola la causalidad temporal. Las particiones deben respetar el orden real de ocurrencia.',
    inThisStudy: '70% entrenamiento (36.895 obs), 15% validación (7.904 obs) y 15% prueba (7.905 obs).',
    relatedSectionId: 'section-preproc',
    tags: ['Validación', 'Causalidad', 'Sin Fuga']
  }
];
