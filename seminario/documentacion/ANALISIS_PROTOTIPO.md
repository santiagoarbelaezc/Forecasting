# Informe Técnico y Análisis Detallado: Prototipo.ipynb
**Pronóstico Multivariante de Variables Meteorológicas con Modelos Estadísticos y Deep Learning**

---

## 1. Identificación del Proyecto y Metadatos

- **Archivo Analizado:** [`Prototipo.ipynb`](file:///c:/Users/Santiago/OneDrive/Escritorio/Repositorios/Forecasting/seminario/Prototipo.ipynb)
- **Área Temática:** Seminario de Investigación / Machine Learning & Deep Learning para Series Temporales (*Time Series Forecasting*).
- **Equipo de Trabajo / Autores:**
  - Juan Manuel Isaza Vergara
  - Miguel Ángel Mira Ortega
  - Santiago Arbelaez Contreras
- **Fecha de Ejecución del Notebook:** Septiembre de 2026.
- **Objetivo Principal:** Diseñar, implementar, entrenar y comparar sistemáticamente arquitecturas estadísticas y de aprendizaje profundo (VAR, LSTM, TSMixer e iTransformer) para el pronóstico multivariante simultáneo a mediano plazo (16 horas hacia el futuro) sobre un conjunto extenso de variables meteorológicas.

---

## 2. Descripción y Comprensión de los Datos

### 2.1 Fuente y Características Generales
- **Origen de los datos:** Registro meteorológico continuo obtenido mediante conexión a Google Sheets (`sheet_id = "11pubePt1wQMoobkDQnpj8PLK_84-2mzFXhg0-dP5mUs"`), complementado con un diccionario de metadatos (`sheet_id = "10wVHlCK9AnE0ht9eRRBMsEEMz1dWae2rDCXFooHGP_4"`).
- **Volumen inicial:** 52,696 registros temporales y 22 columnas originales.
- **Frecuencia de muestreo:** 10 minutos por observación (aproximadamente un año completo de mediciones meteorológicas continuas).

### 2.2 Diccionario de Variables y Normalización Semántica
El notebook realiza una estandarización de los nombres de columnas para facilitar su procesamiento y trazabilidad física:

| Variable Original | Nombre Estandarizado | Unidad de Medida | Descripción Física |
| :--- | :--- | :--- | :--- |
| `date` | `fecha` | Timestamp | Marca temporal de la observación |
| `p (mbar)` | `presion_atmosferica` | mbar | Presión atmosférica barométrica |
| `T (degC)` | `temperatura` | °C | Temperatura ambiente del aire |
| `Tpot (K)` | `temperatura_potencial` | K | Temperatura potencial adiabática |
| `Tdew (degC)` | `temperatura_rocio` | °C | Temperatura de punto de rocío |
| `rh (%)` | `humedad_relativa` | % | Humedad relativa del aire |
| `VPmax (mbar)` | `presion_vapor_saturacion` | mbar | Presión de vapor de saturación |
| `VPact (mbar)` | `presion_vapor_actual` | mbar | Presión de vapor real |
| `VPdef (mbar)` | `deficit_presion_vapor` | mbar | Déficit de presión de vapor |
| `sh (g/kg)` | `humedad_especifica` | g/kg | Humedad específica del aire |
| `H2OC (mmol/m³)` | `concentracion_vapor_agua` | mmol/m³ | Concentración volumétrica de vapor de agua |
| `rho (g/m³)` | `densidad_aire` | g/m³ | Densidad del aire |
| `wv (m/s)` | `velocidad_viento` | m/s | Velocidad media del viento |
| `max. wv (m/s)` | `velocidad_viento_maxima` | m/s | Ráfaga máxima de viento |
| `wd (deg)` | `direccion_viento` | Grados (0°–360°) | Dirección cardinal del viento (transformada cíclicamente) |
| `rain (mm)` | `precipitacion` | mm | Lluvia acumulada por intervalo |
| `raining (s)` | `duracion_lluvia` | s | Tiempo efectivo con registro de lluvia |
| `SWDR (W/m²)` | `radiacion_onda_corta` | W/m² | Radiación solar de onda corta descendente |
| `PAR (µmol/m²/s)` | `radiacion_fotosinteticamente_activa` | µmol/m²/s | Radiación fotosintéticamente activa |
| `max. PAR (µmol/m²/s)`| `radiacion_fotosinteticamente_activa_maxima`| µmol/m²/s | Pico máximo de radiación fotosintética |
| `Tlog (degC)` | `temp_registro` | °C | Temperatura interna del registrador (datalogger) |
| `CO2 (ppm)` | `concentracion_co2` | ppm | Concentración ambiental de dióxido de carbono |

---

## 3. Análisis Exploratorio de Datos (EDA)

1. **Estadística Descriptiva:**
   - Inspección de medidas de tendencia central, dispersión (desviación estándar), mínimos, cuartiles y máximos.
2. **Análisis de Componentes Temporales:**
   - **Estacionalidad:** Fuerte ciclo diurno (24 horas) en temperatura, radiación solar y déficit de presión de vapor, combinado con modulaciones sinópticas y estacionales a largo plazo.
   - **Tendencia y Nivel:** Identificación de variaciones de nivel asociadas a la marcha estacional (invierno/verano).
3. **Prueba de Estacionariedad (Augmented Dickey-Fuller - ADF):**
   - Se evaluó formalmente la hipótesis de raíz unitaria para cada una de las series temporales con `statsmodels.tsa.stattools.adfuller`.
   - Se cuantificaron los estadísticos de prueba y los $p$-valores correspondientes para determinar el grado de estacionariedad antes del modelado estadístico (VAR).

---

## 4. Limpieza de Datos y Feature Engineering

El notebook implementa un pipeline riguroso de calidad de datos para garantizar la integridad temporal:

1. **Detección y Tratamiento de Valores Centinela / Outliers:**
   - Se identificaron valores `-9999` en columnas críticas (`velocidad_viento`, `radiacion_fotosinteticamente_activa_maxima`, `concentracion_co2`), los cuales correspondían a códigos de error o pérdida de señal de los sensores meteorológicos.
   - Se reemplazaron explícitamente por `np.nan` para su tratamiento como valores faltantes.
2. **Eliminación de Duplicados Temporales:**
   - Se auditaron las marcas temporales detectando 2 registros duplicados que fueron eliminados preservando la coherencia cronológica.
3. **Auditoría de Regularidad de la Malla Temporal:**
   - Se calculó la diferencia sucesiva de fechas ($\Delta t = t_i - t_{i-1}$).
   - Se descubrió un único salto irregular entre las `09:30` y las `11:10` del **29 de mayo de 2020**, equivalente a 9 observaciones ausentes respecto al paso esperado de 10 minutos.
4. **Reindexación e Imputación de Frecuencia:**
   - Mediante la función personalizada `completar_e_imputar(df, frecuencia='10min')`:
     - Se generó una cuadrícula temporal continua completa a intervalos exactos de 10 minutos.
     - Se realizó imputación diferenciada según la física de la variable (interpolación lineal para variables termodinámicas continuas como temperatura y presión; llenado coherente para variables de evento discontinuas como lluvia).
5. **Ingeniería de Características Cíclicas (Dirección del Viento):**
   - La variable angular `direccion_viento` (en grados de 0 a 360) presenta discontinuidad en el salto $359^\circ \rightarrow 0^\circ$.
   - Se descompuso trigonométricamente en componentes ortogonales continuas:
     $$\mathrm{viento}_{\sin} = \sin\left(\frac{\theta \cdot \pi}{180}\right) \quad (\text{variable } \texttt{dir\_viento\_sen})$$
     $$\mathrm{viento}_{\cos} = \cos\left(\frac{\theta \cdot \pi}{180}\right) \quad (\text{variable } \texttt{dir\_viento\_cos})$$
     donde $\theta$ representa la dirección angular en grados sexagesimales.
   - Con esto, el dataset final consolidó **22 variables numéricas continuas** preparadas para modelado.

---

## 5. Particionamiento y Protocolo Experimental

### 5.1 División Cronológica (Prevención de Fuga de Información / Data Leakage)
Para respetar la causalidad natural de las series de tiempo, no se utilizó barajado aleatorio (*random shuffle*), sino una partición cronológica estricta:
- **Entrenamiento (Train):** 70% (~36,895 registros)
- **Validación (Validation):** 15% (~7,906 registros)
- **Prueba (Test):** 15% (~7,906 registros)

### 5.2 Estandarización de Variables
- Se utilizó `StandardScaler` de `scikit-learn`.
- **Regla de oro metodológica:** El escalador se ajustó (`fit`) exclusivamente sobre el conjunto de entrenamiento. Luego se aplicó la transformación (`transform`) a los conjuntos de validación y prueba, garantizando cero contaminación (*zero data leakage*).

### 5.3 Ventanas Temporales Supervisadas (*Sliding Windows*)
- **Longitud de contexto histórico (Lookback / Input Length):** $L = 96$ observaciones
  $$96 \times 10 \text{ min} = 960 \text{ min} = 16 \text{ horas}$$
- **Horizonte de pronóstico (Prediction Horizon):** $H = 96$ observaciones
  $$96 \times 10 \text{ min} = 960 \text{ min} = 16 \text{ horas}$$
- **Estructura tensorial generada:**
  - Tensores de entrada: $X \in \mathbb{R}^{N \times 96 \times 22}$
  - Tensores objetivo: $Y \in \mathbb{R}^{N \times 96 \times 22}$
  - Ventanas de test generadas: **7,714 ventanas** de evaluación exhaustiva.
- **Preparación en PyTorch:** Creación de `TensorDataset` y `DataLoader` con `batch_size = 64`.

---

## 6. Arquitecturas de Modelado Implementadas

El prototipo evalúa cuatro familias distintas de modelado predictivo multivariante:

### 6.1 Modelo Estadístico Base: VAR (Vector Autoregression)
- **Librería:** `statsmodels.tsa.api.VAR`
- **Fundamento:** Modelo autoregresivo vectorial lineal donde cada una de las 22 variables en el instante $t$ se modela como una combinación lineal ponderada de los rezagos de sí misma y de las restantes 21 variables meteorológicas.
- **Selección de Rezagos:** Búsqueda automática optimizada por Criterio de Información de Akaike (AIC) hasta un máximo de 96 retardos (`maxlags=96`).
- **Orden Óptimo Seleccionado:** **$\text{VAR}(16)$**, correspondiente a $16 \times 10\text{ min} = 160\text{ min} = 2\text{ horas y }40\text{ minutos}$ de memoria autoregresiva.
- **Pronóstico Multietapa:** Generación iterativa recursiva de los 96 pasos futuros sobre las 7,714 ventanas de prueba.

### 6.2 Modelo Recurrente: LSTM (`LSTMForecaster`)
- **Arquitectura:** Red neuronal recurrente basada en Long Short-Term Memory.
- **Capas:** 2 capas LSTM apiladas (`num_layers=2`).
- **Dimensión Oculta:** `hidden_size=128`.
- **Regularización:** `dropout=0.1`.
- **Mecanismo de Proyección:** Toma el último estado oculto temporal $h_L \in \mathbb{R}^{B \times 128}$ y lo proyecta mediante una capa densa `Linear(128, 96 * 22)` que posteriormente se redimensiona a $(B, 96, 22)$.

### 6.3 Modelo Basado en MLP: TSMixer (`TSMixer`)
- **Fundamento:** Arquitectura basada completamente en perceptrones multicapa (MLP) sin operadores de recurrencia ni autoatención densa (Chen et al., Google Research).
- **Estructura del Bloque (`TSMixerBlock`):**
  1. **Mezcla Temporal (*Time-Mixing*):** Transpone el tensor a $(B, C, L)$ y aplica transformaciones lineales sobre la dimensión de tiempo ($96 \rightarrow 96$) con activación GELU, Dropout y conexión residual.
  2. **Mezcla de Canales/Variables (*Channel-Mixing*):** Transpone de vuelta a $(B, L, C)$ y proyecta a través de la dimensión de variables ($22 \rightarrow \text{hidden\_dim} \rightarrow 22$) con conexión residual.
- **Hiperparámetros:** 2 bloques TSMixer, `hidden_dim=64`, `dropout=0.1`, proyección temporal final de $96 \rightarrow 96$.

### 6.4 Modelo de Última Generación: iTransformer (`iTransformer`)
- **Fundamento:** Arquitectura Inverted Transformer (Liu et al., ICLR 2024).
- **Innovación Conceptual:** En un Transformer tradicional, cada paso de tiempo $t$ contiene un vector de todas las variables. En el **iTransformer**, se **invierte** la perspectiva:
  - Cada variable meteorológica completa a lo largo de sus 96 pasos de historia se embebe como un **único token** de dimensión $d_{\text{model}} = 128$.
  - Por lo tanto, entran 22 tokens (uno por variable), y la capa de **Multi-Head Self-Attention** modela directamente la correlación e interdependencia física entre las variables meteorológicas, evitando la dispersión del cálculo atencional sobre el tiempo.
- **Hiperparámetros:**
  - $d_{\text{model}} = 128$
  - Número de cabezas de atención ($n_{\text{heads}}$) = 4
  - Dimensión Feed-Forward ($d_{\text{ff}}$) = 256
  - Capas Transformer Encoder = 2
  - `dropout = 0.1`
  - Proyección de salida: Capa lineal que expande el vector latente de cada variable directamente a los $H=96$ pasos futuros.

---

## 7. Entrenamiento y Optimización

- **Función de Pérdida:** Error Cuadrático Medio (`torch.nn.MSELoss()`).
- **Optimizador:** Adam (`torch.optim.Adam`).
- **Tasas de Aprendizaje:**
  - LSTM: $\eta = 1 \times 10^{-3}$
  - TSMixer: $\eta = 1 \times 10^{-3}$
  - iTransformer: $\eta = 5 \times 10^{-4}$
- **Control de Sobreajuste:** *Early Stopping* monitoreando la pérdida de validación con una paciencia de 5 épocas (`patience=5`, máximo 10 épocas).
- **Convergencia Observada:**
  - **LSTM:** Se detuvo en la época 6 (Train Loss: 0.1713, Val Loss: 0.5647).
  - **TSMixer:** Se detuvo en la época 6 (Train Loss: 0.2467, Val Loss: 0.5573).
  - **iTransformer:** Se detuvo en la época 7 (Train Loss: 0.2425, Val Loss: 0.4391 - la pérdida de validación más baja entre todas las redes).

---

## 8. Evaluación y Resultados Experimentales

Todas las predicciones estandarizadas fueron revertidas a sus escalas físicas originales mediante la función inversa de `StandardScaler` (`inverse_transform`), evaluando el desempeño real sobre las **7,714 ventanas de prueba** en las **22 variables** y los **96 horizontes temporales**.

### 8.1 Métricas Globales Consolidadas

| Posición | Modelo | MAE Global | MSE Global | RMSE Global | Estado / Rendimiento |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 🥇 **1°** | **iTransformer** | **13.82** | **2,447.79** | **49.48** | **Mejor modelo global con diferencia significativa** |
| 🥈 **2°** | **TSMixer** | 16.59 | 2,963.62 | 54.44 | Desempeño muy sólido y eficiente |
| 🥉 **3°** | **LSTM** | 21.76 | 5,294.53 | 72.76 | Limitado por pérdida de memoria a 96 pasos |
| 4° | **VAR** | 50.78 | 23,055.20 | 151.84 | Fuerte degradación acumulada en horizontes largos |

---

### 8.2 Desglose de RMSE por Variable y Modelo Ganador

| # | Variable Meteorológica | RMSE (VAR) | RMSE (LSTM) | RMSE (TSMixer) | RMSE (iTransformer) | Modelo Ganador |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| 1 | `presion_atmosferica` | **2.553** | 3.973 | 3.996 | 4.343 | **VAR** |
| 2 | `temperatura` | 6.212 | 3.056 | 2.288 | **2.275** | **iTransformer** |
| 3 | `temperatura_potencial` | 6.274 | 3.109 | 2.426 | **2.291** | **iTransformer** |
| 4 | `temperatura_rocio` | **1.822** | 1.866 | 1.949 | 2.016 | **VAR** |
| 5 | `humedad_relativa` | 24.619 | 13.729 | 10.204 | **9.967** | **iTransformer** |
| 6 | `presion_vapor_saturacion` | 5.541 | 2.177 | 1.734 | **1.554** | **iTransformer** |
| 7 | `presion_vapor_actual` | **0.981** | 1.046 | 1.055 | 1.189 | **VAR** |
| 8 | `deficit_presion_vapor` | 5.250 | 1.848 | 1.421 | **1.173** | **iTransformer** |
| 9 | `humedad_especifica` | **0.619** | 0.656 | 0.680 | 0.752 | **VAR** |
| 10 | `concentracion_vapor_agua` | **0.989** | 1.052 | 1.065 | 1.200 | **VAR** |
| 11 | `densidad_aire` | 27.757 | 14.772 | 12.684 | **12.205** | **iTransformer** |
| 12 | `velocidad_viento` | 1.424 | 1.346 | **1.307** | 1.307 | **TSMixer** |
| 13 | `velocidad_viento_maxima` | 2.363 | 2.097 | 1.958 | **1.892** | **iTransformer** |
| 14 | `precipitacion` | **0.029** | 0.032 | 0.031 | 0.030 | **VAR** |
| 15 | `duracion_lluvia` | **100.408** | 105.146 | 102.685 | 102.956 | **VAR** |
| 16 | `radiacion_onda_corta` | 215.868 | 100.960 | 71.112 | **66.112** | **iTransformer** |
| 17 | `radiacion_fotosinteticamente_activa` | 424.251 | 195.368 | 136.017 | **125.863** | **iTransformer** |
| 18 | `radiacion_fotosinteticamente_activa_maxima` | 518.043 | 237.206 | 175.002 | **150.329** | **iTransformer** |
| 19 | `temp_registro` | 6.598 | 3.312 | 2.334 | **2.273** | **iTransformer** |
| 20 | `concentracion_co2` | 24.499 | 17.945 | 12.528 | **11.868** | **iTransformer** |
| 21 | `dir_viento_sen` | 0.457 | 0.479 | **0.451** | 0.461 | **TSMixer** |
| 22 | `dir_viento_cos` | 0.611 | 0.522 | **0.503** | 0.524 | **TSMixer** |

---

### 8.3 Conteo de Variables Ganadas por Modelo

- **iTransformer:** **12 variables ganadas** (54.5% del total). Dominio abrumador en variables termodinámicas clave (temperatura, humedad relativa, presión de vapor de saturación, radiación solar diurna y concentración de CO2).
- **VAR:** **7 variables ganadas** (31.8% del total). Desempeño sobresaliente en series altamente persistentes con dinámica de variación muy lenta (presión barométrica, punto de rocío) o series casi nulas/esparsas (precipitación y duración de lluvia, donde la inercia lineal evita sobreajustes).
- **TSMixer:** **3 variables ganadas** (13.6% del total). Destacado en variables de viento altamente estocásticas y de alta frecuencia (`velocidad_viento`, `dir_viento_sen`, `dir_viento_cos`).
- **LSTM:** **0 variables ganadas** (0%). Superado sistemáticamente tanto por las arquitecturas modernas de deep learning como por el modelo autorregresivo base.

---

### 8.4 Comportamiento del Error en Función del Horizonte Temporal

El análisis del RMSE en función de los pasos futuros ($1 \le h \le 96$):
1. **Horizontes Cortos ($h \le 6$, primeras 1–2 horas):**
   - El modelo estadístico VAR es altamente competitivo y en ocasiones supera levemente a las redes neuronales debido a su fuerte persistencia autoregresiva directa.
2. **Horizontes Medios y Largos ($h > 12$ hasta $h=96$, 2 a 16 horas):**
   - El error de VAR crece exponencialmente, especialmente en variables cíclicas no lineales (radiación y temperatura), sufriendo inestabilidad en la extrapolación recursiva.
   - **iTransformer** y **TSMixer** mantienen curvas de crecimiento del error extremadamente controladas y estables gracias a sus proyecciones directas multietapa y captura de relaciones multivariantes.

---

### 8.5 Análisis con Diagramas de Taylor (*Taylor Diagrams*)

En la sección final del notebook, se implementa y calcula el diagrama de Taylor para contrastar simultáneamente:
1. **Coeficiente de correlación de Pearson ($r$):**
   - Para `temperatura`, iTransformer ($r \approx 0.820$) y TSMixer ($r \approx 0.822$) superan notablemente a LSTM ($r \approx 0.727$) y a VAR ($r \approx 0.530$).
   - En radiación solar, iTransformer lidera con $r \approx 0.643$, mientras VAR se desploma a $r \approx 0.209$.
2. **Desviación Estándar Normalizada ($\sigma_{\text{pred}} / \sigma_{\text{real}}$):**
   - Muestra la capacidad del modelo para conservar la variabilidad y amplitud natural de la señal física sin amortiguarla en exceso. iTransformer y TSMixer se posicionan cercanos al radio unitario ($1.0$).
3. **Error Cuadrático Medio Centrado (RMSEc):**
   - Visualiza la distancia geométrica al punto de referencia ("Real"). En todas las variables termodinámicas principales, el punto de iTransformer se ubica más próximo al valor observado.

---

## 9. Conclusiones y Hallazgos Principales

1. **Superioridad del Inverted Transformer (iTransformer):**
   - El enfoque de representar cada serie temporal completa como un token y permitir que la atención capture la correlación física entre variables resulta ser el paradigma más efectivo para forecasting multivariante meteorológico, reduciendo el RMSE global a **49.48**.
2. **TSMixer como Alternativa de Alta Eficiencia:**
   - La arquitectura basada puramente en MLPs (TSMixer) ofrece un desempeño muy cercano a iTransformer (RMSE global de **54.44**), con menor complejidad computacional y superando a los demás modelos en las componentes cinemáticas del viento.
3. **Decadencia del LSTM para Horizontes Extensos:**
   - Las arquitecturas recurrentes tradicionales sufren del cuello de botella de comprimir 16 horas de historia en un único vector de estado y proyectarlo a 96 pasos futuros, quedando relegadas en todas las variables.
4. **Utilidad de los Modelos Estadísticos Lineales (VAR):**
   - VAR demuestra ser una referencia fundamental: para variables de evolución muy lenta (presión barométrica) y horizontes inmediatos, su simplicidad supera a los modelos profundos. Sin embargo, fracasa ante dinámicas solares fuertemente no lineales.
5. **Rigor Metodológico del Prototipo:**
   - El flujo de trabajo documentado en el notebook destaca por su excelencia técnica: particionamiento cronológico sin fuga de datos, imputación física de datos anómalos (-9999) e intervalos faltantes, transformación angular del viento, evaluación en escala original y análisis multidimensional mediante métricas de error y diagramas de Taylor.
