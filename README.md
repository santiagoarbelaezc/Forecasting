<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0056b3,100:001f3f&height=120&section=header&animation=fadeIn" />
</div>

<h1 align="center">📈 Time Series Forecasting</h1>

<h3 align="center">🔬 Modelado y Predicción de Series Temporales Multivariadas</h3>

<p align="center">
  Proyecto de investigación y experimentación enfocado en el análisis, entrenamiento y evaluación<br>
  comparativa de modelos estadísticos tradicionales y arquitecturas modernas de Deep Learning.
</p>

---

## 🎯 **Descripción**

**Forecasting** es un espacio de experimentación académica orientado al pronóstico de series temporales (con aplicación en datos meteorológicos y climáticos). El repositorio reúne el análisis exploratorio de datos (EDA), la preparación de datasets multivariados y la implementación comparativa de diferentes enfoques de predicción: desde modelos econométricos multivariados hasta redes neuronales recurrentes y modelos basados en atención.

---

## ✨ **Arquitecturas y Enfoques**

- **📊 VAR (Vector Autoregression):** Modelo estadístico multivariado clásico para capturar dinámicas lineales conjuntas entre variables.
- **🔁 LSTM (Long Short-Term Memory):** Red neuronal recurrente (RNN) especializada en capturar dependencias temporales y secuencias a largo plazo.
- **⚡ TSMixer:** Arquitectura basada en perceptrones multicapa (MLP-based) diseñada para procesar interacciones temporales y de características con alta eficiencia.
- **🔮 iTransformer:** Arquitectura avanzada que invierte los mecanismos de auto-atención en Transformers para modelar variaciones entre series temporales de manera individual.

---

## 🛠️ **Stack Tecnológico**

<div align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white" />
</div>

---

## 📂 **Estructura del Proyecto**

```text
Forecasting/
├── arquitecturas/                 # Modelos y experimentación por arquitectura
│   ├── LSTM/                      # Redes recurrentes LSTM
│   ├── TSMixer/                   # Modelos basados en MLP
│   ├── VAR/                       # Vector Autoregressive clásico
│   └── iTransformer/              # Arquitectura iTransformer
│
├── material/                      # Recursos y cuadernos de referencia
│   └── series_tiempo_ejemplos/    # Análisis exploratorio y estacionalidad
│
├── seminario/                     # Entorno principal del seminario / investigación
│   ├── dataset/                   # Datos climáticos (weather.xlsx) y diccionarios
│   ├── documentacion/             # Documentos y reportes técnicos
│   └── Prototipo.ipynb            # Pipeline experimental y prototipado
│
└── README.md                      # Documentación del proyecto
```

---

## 🚀 **Instalación y Configuración**

### 1. **Clonar el Repositorio**
```bash
git clone https://github.com/santiagoarbelaezc/Forecasting.git
cd Forecasting
```

### 2. **Crear y Activar Entorno Virtual**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 3. **Instalar Dependencias y Ejecutar**
```bash
pip install numpy pandas scikit-learn torch statsmodels jupyter openpyxl
jupyter notebook
```

---

## 👥 **Desarrolladores**

<div align="center">
  <h3>Juan Manuel Isaza</h3>
  <p>Estudiante de Ingeniería de Sistemas – Universidad del Quindío</p>

  <br>

  <h3>Miguel Angel Mira</h3>
  <p>Estudiante de Ingeniería de Sistemas – Universidad del Quindío</p>

  <br>

  <h3>Santiago Arbelaez Contreras</h3>
  <p>Junior Full Stack Developer<br>Estudiante de Ingeniería de Sistemas – Universidad del Quindío</p>

  <a href="https://github.com/santiagoarbelaezc">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <img width="10" />
  <a href="https://www.linkedin.com/in/santiago-arbelaez-contreras-9830b5290/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <img width="10" />
  <a href="https://santiagoarbelaez.me/">
    <img src="https://img.shields.io/badge/Sitio_Web-6C63FF?style=for-the-badge&logo=sparkles&logoColor=white" />
  </a>
</div>

<br>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0056b3,100:001f3f&height=90&section=footer&animation=fadeIn" />
</div>
