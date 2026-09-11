# Anatomía y Análisis Exploratorio Completo de una Serie de Tiempo: Documentación Técnica
**Archivo Analizado:** [`Copia_de_Anatomia_Serie_Tiempo_EDA_Periodo_Estacional_Automatico.ipynb`](file:///c:/Users/Santiago/OneDrive/Escritorio/Repositorios/Forecasting/material/series_tiempo_ejemplos/Copia_de_Anatomia_Serie_Tiempo_EDA_Periodo_Estacional_Automatico.ipynb)  
**Ubicación:** `material/series_tiempo_ejemplos/`  
**Objetivo del Notebook:** Implementar un flujo metodológico de referencia (*Gold Standard*) para la exploración, diagnóstico estructural, descomposición anatómica (clásica y STL) y selección automatizada de modelos estocásticos lineales (ARMA, ARIMA y SARIMA) sobre series temporales con estacionalidad, tendencia, variables exógenas y perturbaciones controladas.

---

## 1. Arquitectura de Generación y Ecuaciones de la Serie

Para evaluar con rigor absoluto la capacidad de detección de cada técnica estadística, el notebook construye un proceso generador de datos (*Data Generating Process - DGP*) sintético/semi-sintético de **120 observaciones mensuales** ($n=120$, desde `2020-01-31` hasta `2029-12-31`, frecuencia `ME - Month End`), donde se conocen con certeza matemática los componentes subyacentes (*ground truth*).

### 1.1 Ecuaciones del Proceso Generador
La serie temporal observada $Y_t$ se sintetiza bajo la siguiente formulación estructural aditiva:

$$Y_t = N_t + T_t + S_t + \text{Efecto\_Temperatura}_t + \text{Efecto\_Precio}_t + R_t$$

Donde cada término está rigurosamente definido por:

1. **Nivel Base ($N_t$):**
   $$N_t = 100.0 \quad (\text{constante})$$
2. **Tendencia Determinística Lineal ($T_t$):**
   $$T_t = 0.45 \cdot t \quad (\text{pendiente mensual } +0.45, \text{ crecimiento anual de } 5.4 \text{ unidades})$$
3. **Estacionalidad Pura Diaria/Mensual ($S_t$):**
   $$S_t = 9.0 \cdot \sin\left(\frac{2\pi t}{12}\right) \quad (\text{período estacional fundamental } s=12 \text{ meses, amplitud } \pm 9.0)$$
4. **Variable Exógena 1 - Temperatura ($X_{1,t}$):**
   $$\text{Temperatura}_t = 22 + 5 \cdot \sin\left(\frac{2\pi t}{12} + 0.3\right) + \varepsilon_{\text{temp}, t}, \quad \varepsilon_{\text{temp}, t} \sim \mathcal{N}(0, 0.9^2)$$
   $$\text{Efecto\_Temperatura}_t = 0.85 \cdot \left(\text{Temperatura}_t - \overline{\text{Temperatura}}\right)$$
5. **Variable Exógena 2 - Precio ($X_{2,t}$):**
   $$\text{Precio}_t = 45 + 0.18 \cdot t + 2.5 \cdot \cos\left(\frac{2\pi t}{12}\right) + \varepsilon_{\text{precio}, t}, \quad \varepsilon_{\text{precio}, t} \sim \mathcal{N}(0, 1.4^2)$$
   $$\text{Efecto\_Precio}_t = -0.35 \cdot \left(\text{Precio}_t - \overline{\text{Precio}}\right)$$
6. **Componente Irregular / Ruido Blanco ($R_t$):**
   $$R_t \sim \mathcal{N}(0, 2.2^2) \quad (\sigma = 2.2)$$

### 1.2 Inyección Controlada de Anomalías para Pruebas de Estrés
Para validar el pipeline de limpieza y detección de fallas, el notebook introduce deliberadamente perturbaciones en una copia denominada `df_eda`:
- **Datos Faltantes (NaN):** Índices 18, 57 y 91 en `Valor`; 36 y 78 en `Temperatura`; 44 en `Precio`.
- **Valores Atípicos (*Outliers* Aditivos):**
  - Índice 28: Incremento aditivo de $+35$ unidades.
  - Índice 84: Reducción aditiva de $-28$ unidades.
- **Cambio Estructural de Nivel (*Structural Break*):** A partir del índice 72 y hasta el final de la serie, se añade un salto persistente de $+14$ unidades.
- **Validaciones de Integridad Temporal:** Construcción de tablas con duplicados (índice 25 repetido) y fecha faltante (índice 40 omitido) para comprobar la robustez de los algoritmos de auditoría de fechas.

---

## 2. Pipeline de Análisis Exploratorio de Datos (EDA) Temporal

El notebook desarrolla una secuencia exhaustiva dividida en 15 módulos analíticos (Secciones A hasta O):

### A. Visualización Conjunta
- Graficación sincronizada de la serie `Valor` junto a las variables exógenas `Temperatura` y `Precio` con eje temporal compartido.

### B. Distribución Estadística
- Cálculo de medidas de forma:
  - Media: **126.60**
  - Desviación estándar: **15.91**
  - Mediana: **126.63**
  - Cuartiles: $Q_1 = 114.61$, $Q_3 = 138.54$, $\text{IQR} = 23.93$
  - Rango: Mínimo $93.47$, Máximo $159.10$
  - Asimetría (*Skewness*) y Curtosis para verificar desviaciones de la normalidad.

### C. Integridad y Frecuencia Temporal
- Validación formal del índice: `df_eda.index.is_monotonic_increasing` $\rightarrow$ `True`.
- Detección de duplicados mediante `df.index.duplicated().sum()`.
- Inferencia de frecuencia con `pd.infer_freq(df.index)`: detecta correctamente `ME` (*Month End*). Si falta una fecha, detecta `None` e identifica el salto cronológico mediante comparación con `pd.date_range`.

### D. Detección Multimétodo de Valores Atípicos
El notebook compara tres criterios complementarios de detección de anomalías:
1. **Criterio de Rango Intercuartílico (Tukey IQR):**
   $$[Q_1 - 1.5 \cdot \text{IQR}, \; Q_3 + 1.5 \cdot \text{IQR}]$$
2. **Puntaje Z Clásico (*Z-score*):**
   $$|Z| = \left|\frac{X - \mu}{\sigma}\right| > 3$$
3. **Puntaje Z Modificado (*Modified Z-score* con MAD):**
   $$Z_{\text{mod}} = \frac{0.6745 \cdot |X - \text{Mediana}|}{\text{MAD}} > 3.5$$
   *(Robusto ante la distorsión que los mismos outliers causan sobre la media y la desviación estándar).*

### E. Detección Exploratoria de Cambios Estructurales
- Algoritmo de doble media móvil: calcula una media móvil rápida (6 períodos) y una media móvil lenta (24 períodos).
- Evalúa la diferencia entre ambas frente a un umbral dinámico de dos desviaciones estándar ($| \text{MA}_6 - \text{MA}_{24} | > 2\sigma$).
- Detecta exitosamente el punto de quiebre estructural introducido en el período 72.

### F. Comparación de Técnicas de Imputación
Frente a los valores ausentes (*NaN*), se implementan y contrastan cuatro estrategias:
1. *Forward Fill* (`ffill`)
2. *Backward Fill* (`bfill`)
3. **Interpolación Temporal (`interpolate(method="time")`):** Resulta la más precisa para series continuas estacionales.
4. Media móvil centrada de 5 períodos (`rolling(5, center=True).mean()`).

### G. Tratamiento de Extremos (*Winsorization*)
- Aplicación de recorte (*clipping*) sobre los umbrales de Tukey para atenuar el impacto de valores espurios sin eliminar la observación temporal.

### H. Análisis de Rezagos y Autocorrelación
- Construcción de retardos $t-1, t-2, t-3, t-6, t-12$.
- Matriz de correlación cruzada mostrando que los rezagos más fuertemente correlacionados con $Y_t$ son $t-1$ (inercia a corto plazo) y $t-12$ (ciclo estacional anual).

### I. Funciones ACF y PACF de la Serie Original
- **ACF:** Presenta un decaimiento sinusoidal lento característico de series con tendencia y fuerte persistencia estacional cada 12 períodos.
- **PACF:** Presenta picos dominantes en los primeros rezagos y en el rezago 12.

### J. Determinación Automática del Período Estacional
- **Innovación del notebook:** En lugar de asumir arbitrariamente un período $s=12$, implementa un módulo automático basado en:
  1. Análisis espectral mediante **Periodograma de Welch/Scipy** (`scipy.signal.periodogram`) sobre la serie sin tendencia (`detrend`).
  2. Búsqueda de picos dominantes en el espectro de densidad de potencia (*Power Spectral Density*).
  3. Confirmación cruzada con la función de autocorrelación (ACF).
- **Resultado Obtenido:**
  - **Período estacional estimado:** **12 observaciones** (exacto al *ground truth*).
  - **Fuerza estacional estimada ($F_s$):** **0.9470** (clasificada automáticamente como *"muy fuerte"*).

### K. Estacionariedad y Pruebas Estadísticas Formales
Se aplica una doble diferenciación: regular ($d=1$) y estacional ($D=1, s=12$):
$$\Delta_{12} \Delta Y_t = (Y_t - Y_{t-12}) - (Y_{t-1} - Y_{t-13})$$
Sobre la serie transformada se ejecutan dos pruebas estadísticas de hipótesis contrapuestas:
1. **Prueba Aumentada de Dickey-Fuller (ADF):**
   - $H_0$: La serie posee raíz unitaria (no estacionaria).
   - Resultado: $p\text{-valor} < 0.05 \rightarrow$ Se rechaza $H_0$ (favorece estacionariedad).
2. **Prueba KPSS (Kwiatkowski-Phillips-Schmidt-Shin):**
   - $H_0$: La serie es estacionaria alrededor de una constante.
   - Resultado: $p\text{-valor} > 0.05 \rightarrow$ No se rechaza $H_0$ (confirma estacionariedad).
- **Conclusión combinada:** La combinación $(d=1, D=1, s=12)$ induce estacionariedad estricta de segundo orden.

### L. ACF y PACF de la Serie Estacionaria
- Sobre la serie ya diferenciada, las autocorrelaciones se truncan rápidamente dentro de las bandas de confianza de Bartlett al 95%, dejando únicamente picos identificables en rezagos cortos ($p, q$) y en el rezago estacional 12 ($P, Q$).

### M & N. Análisis de Variables Exógenas y Regresión OLS
- Cálculo de matrices de correlación con rezagos de `Temperatura` y `Precio`.
- Ajuste de un modelo de regresión lineal exploratorio:
  - Coeficiente estimado de Temperatura: $+0.92$ (muy cercano al valor real de generación $+0.85$).
  - Coeficiente estimado de Precio: $-0.31$ (muy cercano al valor real de generación $-0.35$).
  - Bondad de ajuste: **$R^2 = 0.8121$**.

### O. Tablero Resumen del EDA
- Generación de un diccionario y tabla consolidada con todas las métricas de diagnóstico antes de proceder al modelado.

---

## 3. Descomposición y Anatomía de la Serie

### 3.1 Descomposición Clásica
- Ejecutada con `statsmodels.tsa.seasonal.seasonal_decompose(model="additive", period=12)`.
- Separa la serie en: Tendencia suavizada, Estacionalidad periódica idéntica año a año y Residuos.

### 3.2 Estimación Paso a Paso de la Anatomía (Formulación Matemática)
El notebook implementa manualmente cada etapa de la estimación estructural para demostrar la mecánica interna del modelo aditivo:

1. **Estimación del Nivel y la Tendencia vía OLS:**
   $$\widehat{Y}_t = \widehat{\beta}_0 + \widehat{\beta}_1 \cdot t$$
   - Nivel inicial estimado ($\widehat{\beta}_0$): **100.32** (Valor real: 100.0)
   - Pendiente mensual estimada ($\widehat{\beta}_1$): **0.449** (Valor real: 0.450)
   - Crecimiento anual proyectado: $\approx 5.39$ unidades/año.
2. **Desestacionalización / Eliminación de Tendencia:**
   $$Z_t = Y_t - (\widehat{N}_t + \widehat{T}_t)$$
3. **Cálculo de Factores Estacionales Mensuales ($\widehat{S}_m$):**
   - Agrupación por mes ($m = 1, \dots, 12$), promediando $Z_t$ y centrando los índices para que sumen exactamente cero:
     $$\sum_{m=1}^{12} \widehat{S}_m = 0$$
   - Mes de pico máximo: **Abril / Mayo** (acorde a la función seno generadora).
   - Mes de valle mínimo: **Octubre / Noviembre**.
4. **Aislamiento del Ruido Residual ($\widehat{R}_t$):**
   $$\widehat{R}_t = Y_t - \widehat{N}_t - \widehat{T}_t - \widehat{S}_t$$
   - Media del residuo: $0.000000$ (insesgado).
   - Desviación estándar residual: $\approx 2.31$ (muy cercana a la desviación inyectada $\sigma=2.20$).
5. **Comprobación de Reconstrucción Exacta:**
   - Se calcula $\widehat{Y}_t = \widehat{N}_t + \widehat{T}_t + \widehat{S}_t + \widehat{R}_t$.
   - Error absoluto máximo: **$0.000000000000$** ($0$ a nivel de precisión de coma flotante IEEE 754), validando la coherencia algebraica del marco aditivo.

### 3.3 Selección Automática: Modelo Aditivo vs. Multiplicativo
El notebook evalúa formalmente si la serie debe representarse mediante suma ($Y_t = T_t + S_t + R_t$) o producto ($Y_t = T_t \cdot S_t \cdot R_t$):
- **Criterio 1:** Regresión entre la amplitud del ciclo estacional anual y el nivel medio de la tendencia en cada ciclo. Si la correlación es insignificante, la estacionalidad es aditiva (amplitud constante independientemente del nivel).
- **Criterio 2:** Coeficiente de variación y homocedasticidad de los residuos.
- **Criterio 3:** Prueba de autocorrelación de Ljung-Box sobre los residuos resultantes de ambos enfoques.
- **Decisión Automática:** Selecciona categóricamente el **Modelo Aditivo**.

### 3.4 Descomposición STL (Seasonal and Trend decomposition using Loess)
- Ejecutada con `statsmodels.tsa.seasonal.STL(period=12, robust=True)`.
- A diferencia de la descomposición clásica (que asume que el patrón estacional es rígido y exactamente igual todos los años), **STL con estimación Loess robusta**:
  - Permite que la estacionalidad evolucione suavemente con el tiempo.
  - El parámetro `robust=True` neutraliza el impacto de los *outliers* deliberados, evitando que una observación atípica distorsione la curva de tendencia o el patrón estacional.

---

## 4. Motor de Selección Automática: ARMA vs. ARIMA vs. SARIMA

Uno de los aportes metodológicos más valiosos del notebook es el **algoritmo de selección automática de modelos de series temporales** (Celdas 85 a 87).

### 4.1 Protocolo de Evaluación
- **Partición Cronológica:**
  - Entrenamiento (*Train*): **96 observaciones** (80% inicial de la serie).
  - Validación (*Test / Holdout*): **24 observaciones** (20% final de la serie, equivalente a 2 ciclos estacionales completos).
- **Espacio de Búsqueda (*Grid Search*):**
  - Orden autoregresivo regular: $p \in \{0, 1, 2\}$
  - Orden de integración regular: $d \in \{0, 1\}$ (validado previamente por ADF/KPSS)
  - Orden de medias móviles regulares: $q \in \{0, 1, 2\}$
  - Orden autoregresivo estacional: $P \in \{0, 1\}$
  - Orden de diferenciación estacional: $D \in \{0, 1\}$
  - Orden de medias móviles estacionales: $Q \in \{0, 1\}$
  - Período estacional fijo detectado automáticamente: $s = 12$
  - Modelos explorados: Familias **ARMA** ($d=0, D=0$), **ARIMA** ($d=1, D=0$) y **SARIMA** ($d=1, D=1, s=12$).

### 4.2 Criterios Jerárquicos de Selección
Para cada combinación admisible, el algoritmo:
1. Ajusta el modelo por Máxima Verosimilitud con `SARIMAX`.
2. Pronostica las 24 observaciones del conjunto de validación en modo fuera de muestra (*out-of-sample*).
3. Computa el **MAE** y **RMSE** de validación frente a los valores reales.
4. Extrae el Criterio de Información de Akaike (**AIC**).
5. Evalúa la blancura de los residuos con la **Prueba de Ljung-Box** ($p\text{-valor} > 0.05$ para garantizar que no quede estructura autocorrelacionada sin capturar).
6. Clasifica y selecciona la combinación óptima que minimice el error de validación preservando residuos compatibles con ruido blanco.

---

### 4.3 Resultados del Modelo Ganador

```
================================================================================
MODELO SELECCIONADO AUTOMÁTICAMENTE
================================================================================
Tipo de modelo:             SARIMA
Orden no estacional (p,d,q): (1, 1, 2)
Orden estacional (P,D,Q)s:   (1, 1, 1, 12)
MAE de validación:          1.6075
RMSE de validación:         1.9007
AIC del modelo:             333.6703
p-valor Ljung-Box:          0.0617
Diagnóstico de residuos:    Compatibles con ruido blanco (White Noise)
```

#### Resumen Estadístico Detallado del Modelo Ajustado (`SARIMAX Results`):
- **Modelo:** $\text{SARIMAX}(1, 1, 2) \times (1, 1, [1], 12)$
- **Observaciones:** 120
- **Log-Likelihood:** $-209.162$
- **AIC / BIC / HQIC:** $432.324$ / $449.976$ / $439.448$
- **Parámetros Significativos:**
  - Coeficiente AR regular $\phi_1 = 0.5246$ ($p = 0.026$)
  - Coeficiente AR estacional $\Phi_1 = -0.3223$ ($p = 0.002$)
  - Varianza residual $\sigma^2 \approx 3.93$ (acorde a la varianza real combinada)
- **Diagnóstico de Normalidad y Ruido de los Residuos:**
  - **Prueba de Ljung-Box en lag 1:** Estadístico $Q = 0.28$, $p = 0.60$ (ausencia absoluta de autocorrelación residual).
  - **Prueba de Jarque-Bera:** $JB = 0.81$, $p = 0.67$ (los residuos no rechazan la hipótesis nula de distribución normal).
  - **Asimetría / Curtosis:** $\text{Skew} = -0.13$, $\text{Kurtosis} = 3.38$ (cercana a la normal teórica de 3.0).
  - **Heterocedasticidad:** $H = 0.81$, $p = 0.57$ (varianza residual constante en el tiempo).

---

## 5. Cuadro Comparativo: Descomposición Clásica vs. STL vs. SARIMA

| Dimensión Analítica | Descomposición Clásica | Descomposición STL | Modelo SARIMA Automatizado |
| :--- | :--- | :--- | :--- |
| **Naturaleza** | Descriptiva determinística | Descriptiva / Filtrado no paramétrico | Probabilística generativa / Estocástica |
| **Supuesto Estacional** | Rígido (idéntico en cada ciclo) | Flexible (evolutivo con Loess) | Estocástico (modelado con polinomios AR/MA estacionales) |
| **Tolerancia a Outliers** | Muy sensible (contamina la tendencia) | **Alta** (`robust=True` con ponderación de bicuadrados) | Moderada (requiere tratamiento previo o variables dummy) |
| **Capacidad Predictiva** | Limitada (extrapolación determinística) | Descomposición de señales | **Alta capacidad de pronóstico fuera de muestra** |
| **Manejo de Incertidumbre**| Nulo (sin intervalos de confianza) | Nulo (técnica de suavizado) | **Completo** (distribución de probabilidad e intervalos de confianza) |

---

## 6. Conclusiones y Valor Metodológico

1. **Rigor Pedagógico y Técnico:** El notebook no solo aplica comandos de librerías, sino que desglosa matemáticamente el porqué de cada paso (identidades algebraicas de reconstrucción, pruebas formales de hipótesis y justificación de cada transformación).
2. **Automatización Inteligente:** La detección automática del período estacional mediante periodogramas espectrales y la búsqueda en malla (*Grid Search*) de órdenes SARIMA con filtro de residuos de ruido blanco evitan la subjetividad humana en el análisis visual de correlogramas.
3. **Pipeline Completo de Calidad de Datos:** Cubre desde los problemas más comunes en datos reales (fechas faltantes, duplicados, valores centinela, quiebres de régimen) hasta la comparación de métodos de imputación y tratamiento de extremos.
4. **Conexión con el Modelado Avanzado:** Este notebook sienta las bases teóricas y diagnósticas clásicas necesarias antes de abordar modelos multivariantes modernos de *Deep Learning* (como los analizados en el prototipo: VAR, LSTM, TSMixer e iTransformer).
