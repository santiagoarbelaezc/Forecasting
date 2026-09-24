import re

html_path = 'src/app/app.component.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Upgrade Header to wide 2-column hero on xl screens
old_header = r'<section id="section-header" class="article-section pt-2 pb-8 border-b border-gray-100">.*?</section>'
new_header = """<section id="section-header" class="article-section pt-2 pb-8 border-b border-gray-100">
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Title, Authors, Buttons -->
          <div class="xl:col-span-8 space-y-4">
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <span class="pill-badge pill-green">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                Seminario de Investigación 2026
              </span>
              <span class="pill-badge">Series Multivariadas</span>
              <span class="pill-badge">Modelos Arq</span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight">
              Estudio comparativo de VAR, LSTM, TSMixer e iTransformer para el pronóstico de series de tiempo meteorológicas multivariadas
            </h1>

            <p class="text-sm sm:text-base text-gray-500 font-medium">
              Investigación aplicada en Inteligencia Artificial y Modelado Predictivo
            </p>

            <div class="flex flex-wrap items-center gap-2 pt-1">
              <span class="pill-badge bg-gray-100 text-gray-800 font-medium">Mira Miguel</span>
              <span class="pill-badge bg-gray-100 text-gray-800 font-medium">Arbelaez Santiago</span>
              <span class="pill-badge bg-gray-100 text-gray-800 font-medium">Isaza Juan</span>
              <span class="pill-badge text-gray-500">Facultad de Ingeniería · Repositorio Forecasting</span>
            </div>

            <div class="flex items-center gap-3 flex-wrap pt-3">
              <a href="#section-abstract" class="btn-dark">Resumen</a>
              <a href="#section-marco-conceptual" class="btn-outline">&lt;/&gt; Modelos</a>
              <a href="#section-comparativa" class="btn-outline">Comparativa</a>
              <button (click)="openCitation()" class="btn-outline">Citar</button>
              <button (click)="downloadPdf()" class="btn-blue">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Descargar PDF
              </button>
            </div>
          </div>

          <!-- Right: Executive Highlight Card filling wide space -->
          <div class="xl:col-span-4 subtle-card p-6 bg-gray-50/70 border border-gray-200/80 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-900">Resumen Técnico</span>
              <span class="pill-badge pill-green text-[10px]">Pre-Print</span>
            </div>
            <div class="space-y-2.5 text-xs text-gray-600 leading-relaxed">
              <div class="flex items-center justify-between py-1.5 border-b border-gray-200/60">
                <span class="text-gray-500">Modelos Evaluados</span>
                <span class="font-bold text-gray-900">VAR · LSTM · TSMixer · iTransformer</span>
              </div>
              <div class="flex items-center justify-between py-1.5 border-b border-gray-200/60">
                <span class="text-gray-500">Muestreo Temporal</span>
                <span class="font-bold text-gray-900">Cadencia estricta cada 10 min</span>
              </div>
              <div class="flex items-center justify-between py-1.5 border-b border-gray-200/60">
                <span class="text-gray-500">Metodología Guía</span>
                <span class="font-bold text-emerald-700">CRISP-DM</span>
              </div>
              <div class="flex items-center justify-between py-1.5">
                <span class="text-gray-500">Validación Experimental</span>
                <span class="font-bold text-blue-700">Partición cronológica sin fuga</span>
              </div>
            </div>
          </div>

        </div>
      </section>"""

content = re.sub(old_header, new_header, content, flags=re.DOTALL)

# 2. Upgrade VAR to side-by-side on wide screens
old_var = r'<div id="section-var" class="subtle-card p-6 sm:p-8 space-y-4">.*?</div>\s*</div>\s*</div>'
new_var = """<div id="section-var" class="subtle-card p-6 sm:p-8 space-y-4">
            <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span class="pill-badge pill-green">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                Modelo Estadístico Lineal
              </span>
              <span class="text-xs text-gray-400 font-mono">III.A</span>
            </div>

            <h3 class="text-xl font-bold font-headline text-gray-900">Vector Autoregression (VAR)</h3>

            <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div class="xl:col-span-7 space-y-4 article-body">
                <p>
                  Vector Autoregression (VAR) es un modelo estadístico diseñado para representar la dependencia temporal conjunta de un conjunto de variables. A diferencia de los modelos autorregresivos univariados, en los que una variable se explica principalmente a partir de sus propios valores pasados, VAR considera simultáneamente los valores históricos de todas las variables incluidas en el sistema. De esta manera, cada variable puede depender tanto de sus propios valores anteriores como de los valores pasados de las demás variables.
                </p>

                <p>
                  Para un conjunto de \\(K\\) variables y un orden autorregresivo \\(p\\), la serie se representa mediante el vector \\(y_t\\), expresado formalmente como:
                </p>

                <div class="equation-card">
                  <div class="font-mono text-sm sm:text-base text-gray-900" [innerHTML]="math.eqVAR"></div>
                  <span class="text-xs font-mono text-gray-400 font-bold ml-4 whitespace-nowrap">(1)</span>
                </div>

                <p>
                  donde \\(c\\) corresponde al término constante, \\(A_i\\) son matrices de coeficientes que cuantifican la influencia dinámica de los rezagos históricos sobre el estado actual, y \\(\\varepsilon_t\\) representa el vector de ruido blanco o error.
                </p>
              </div>

              <div class="xl:col-span-5 figure-wrapper m-0">
                <div class="figure-img-container" (click)="openLightbox('/images/fig1_var.png', 'Fig. 1. Estructura conceptual del modelo arquitectónico VAR')">
                  <img src="/images/fig1_var.png" alt="Estructura conceptual del modelo arquitectónico VAR" class="max-h-72 w-auto object-contain rounded">
                </div>
                <div class="figure-caption">
                  <span><strong>Fig. 1.</strong> Estructura conceptual de VAR.</span>
                  <span class="text-xs text-blue-600 font-medium cursor-pointer hover:underline" (click)="openLightbox('/images/fig1_var.png', 'Fig. 1. Estructura conceptual del modelo arquitectónico VAR')">
                    Ampliar
                  </span>
                </div>
              </div>
            </div>
          </div>"""

content = re.sub(r'<div id="section-var".*?</div>\s*</div>\s*</div>\s*</div>', new_var, content, flags=re.DOTALL)

# 3. Upgrade LSTM to side-by-side on wide screens
new_lstm = """<div id="section-lstm" class="subtle-card p-6 sm:p-8 space-y-4">
            <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span class="pill-badge pill-blue">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                Red Neuronal Recurrente (RNN)
              </span>
              <span class="text-xs text-gray-400 font-mono">III.B</span>
            </div>

            <h3 class="text-xl font-bold font-headline text-gray-900">Long Short-Term Memory (LSTM)</h3>

            <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div class="xl:col-span-7 space-y-4 article-body">
                <p>
                  Las redes Long Short-Term Memory (LSTM) pertenecen a la familia de redes neuronales recurrentes (<em>Recurrent Neural Networks</em>, RNN), diseñadas para procesar información secuencial manteniendo un estado que se actualiza a medida que se recorren los diferentes instantes de una serie. <span [innerHTML]="math.lstmStateText"></span>
                </p>

                <div class="equation-card">
                  <div class="font-mono text-sm sm:text-base text-gray-900" [innerHTML]="math.eqRNN"></div>
                  <span class="text-xs font-mono text-gray-400 font-bold ml-4 whitespace-nowrap">(2)</span>
                </div>

                <p>
                  LSTM introduce una celda de memoria regulada por compuertas:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 my-2">
                  <div class="equation-card m-0 py-2.5 px-3">
                    <div class="font-mono text-xs text-gray-900" [innerHTML]="math.eqLSTM_f"></div>
                    <span class="text-[11px] font-mono text-gray-400 font-bold ml-2">(3)</span>
                  </div>
                  <div class="equation-card m-0 py-2.5 px-3">
                    <div class="font-mono text-xs text-gray-900" [innerHTML]="math.eqLSTM_i"></div>
                    <span class="text-[11px] font-mono text-gray-400 font-bold ml-2">(4)</span>
                  </div>
                  <div class="equation-card m-0 py-2.5 px-3">
                    <div class="font-mono text-xs text-gray-900" [innerHTML]="math.eqLSTM_c_tilde"></div>
                    <span class="text-[11px] font-mono text-gray-400 font-bold ml-2">(5)</span>
                  </div>
                  <div class="equation-card m-0 py-2.5 px-3">
                    <div class="font-mono text-xs text-gray-900" [innerHTML]="math.eqLSTM_c"></div>
                    <span class="text-[11px] font-mono text-gray-400 font-bold ml-2">(6)</span>
                  </div>
                  <div class="equation-card m-0 py-2.5 px-3">
                    <div class="font-mono text-xs text-gray-900" [innerHTML]="math.eqLSTM_o"></div>
                    <span class="text-[11px] font-mono text-gray-400 font-bold ml-2">(7)</span>
                  </div>
                  <div class="equation-card m-0 py-2.5 px-3">
                    <div class="font-mono text-xs text-gray-900" [innerHTML]="math.eqLSTM_h"></div>
                    <span class="text-[11px] font-mono text-gray-400 font-bold ml-2">(8)</span>
                  </div>
                </div>
              </div>

              <div class="xl:col-span-5 figure-wrapper m-0">
                <div class="figure-img-container" (click)="openLightbox('/images/fig2_lstm.png', 'Fig. 2. Estructura conceptual del modelo arquitectónico LSTM')">
                  <img src="/images/fig2_lstm.png" alt="Estructura conceptual del modelo arquitectónico LSTM" class="max-h-72 w-auto object-contain rounded">
                </div>
                <div class="figure-caption">
                  <span><strong>Fig. 2.</strong> Celda de memoria LSTM y compuertas.</span>
                  <span class="text-xs text-blue-600 font-medium cursor-pointer hover:underline" (click)="openLightbox('/images/fig2_lstm.png', 'Fig. 2. Estructura conceptual del modelo arquitectónico LSTM')">
                    Ampliar
                  </span>
                </div>
              </div>
            </div>
          </div>"""

content = re.sub(r'<div id="section-lstm".*?</div>\s*</div>\s*</div>\s*</div>', new_lstm, content, flags=re.DOTALL)

# 4. Upgrade TSMixer to side-by-side on wide screens
new_tsmixer = """<div id="section-tsmixer" class="subtle-card p-6 sm:p-8 space-y-4">
            <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span class="pill-badge bg-amber-50 text-amber-800 border border-amber-200">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block"></span>
                Arquitectura All-MLP
              </span>
              <span class="text-xs text-gray-400 font-mono">III.C</span>
            </div>

            <h3 class="text-xl font-bold font-headline text-gray-900">TSMixer</h3>

            <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div class="xl:col-span-7 space-y-4 article-body">
                <p>
                  <strong>TSMixer</strong> es una arquitectura basada exclusivamente en capas de perceptrones multicapa (<em>Multi-Layer Perceptrons</em>, MLP) que aborda el pronóstico de series de tiempo mediante la mezcla independiente de información a lo largo de las dimensiones temporal y de características.
                </p>

                <p>
                  La entrada de TSMixer se representa como una matriz <span [innerHTML]="math.tsmixerMatrix"></span>, donde \\(L\\) denota la longitud de la ventana histórica (dimensión temporal) y \\(K\\) el número de variables meteorológicas. El procesamiento se divide en dos bloques principales:
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
                  <div class="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <h4 class="text-sm font-bold text-gray-900 mb-1">Time Mixing Block</h4>
                    <p class="text-xs text-gray-600 leading-relaxed mb-0">
                      Aplica un MLP transversal a lo largo de la dimensión temporal (\\(L\\)) para combinar patrones dinámicos en la secuencia.
                    </p>
                  </div>
                  <div class="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <h4 class="text-sm font-bold text-gray-900 mb-1">Feature Mixing Block</h4>
                    <p class="text-xs text-gray-600 leading-relaxed mb-0">
                      Aplica un MLP sobre la dimensión de características (\\(K\\)) para capturar correlaciones multivariadas cruzadas.
                    </p>
                  </div>
                </div>
              </div>

              <div class="xl:col-span-5 figure-wrapper m-0">
                <div class="figure-img-container" (click)="openLightbox('/images/fig3_tsmixer.png', 'Fig. 3. Estructura conceptual del modelo arquitectónico TSMixer')">
                  <img src="/images/fig3_tsmixer.png" alt="Estructura conceptual del modelo arquitectónico TSMixer" class="max-h-80 w-auto object-contain rounded">
                </div>
                <div class="figure-caption">
                  <span><strong>Fig. 3.</strong> Arquitectura TSMixer (Time & Feature Mixing).</span>
                  <span class="text-xs text-blue-600 font-medium cursor-pointer hover:underline" (click)="openLightbox('/images/fig3_tsmixer.png', 'Fig. 3. Estructura conceptual del modelo arquitectónico TSMixer')">
                    Ampliar
                  </span>
                </div>
              </div>
            </div>
          </div>"""

content = re.sub(r'<div id="section-tsmixer".*?</div>\s*</div>\s*</div>\s*</div>', new_tsmixer, content, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied 2-column wide layout enhancements.")
