export interface ArticleSection { id: string; num: string; title: string; children?: { id: string; num: string; title: string }[]; }

export const ARTICLE_SECTIONS: ArticleSection[] = [
  { id: 'section-header', num: '00', title: 'Encabezado & Autores' },
  { id: 'section-abstract', num: '01', title: 'Resumen (Abstract) & Términos' },
  { id: 'section-introduccion', num: 'I.', title: 'Introducción' },
  { id: 'section-estado-arte', num: 'II.', title: 'Estado del Arte' },
  { 
    id: 'section-marco-conceptual', 
    num: 'III.', 
    title: 'Marco Conceptual',
    children: [
      { id: 'section-var', num: 'A.', title: 'Vector Autoregression (VAR)' },
      { id: 'section-lstm', num: 'B.', title: 'Long Short-Term Memory (LSTM)' },
      { id: 'section-tsmixer', num: 'C.', title: 'TSMixer (All-MLP)' },
      { id: 'section-itransformer', num: 'D.', title: 'iTransformer (Inverted Attention)' }
    ]
  },
  { id: 'section-comparativa', num: '⚖️', title: 'Matriz Comparativa de Modelos' },
  { 
    id: 'section-desarrollo', 
    num: 'IV.', 
    title: 'Desarrollo Experimental (CRISP-DM)',
    children: [
      { id: 'section-dataset', num: 'A.', title: 'Conjunto de Datos Meteorológicos' },
      { id: 'section-preproc', num: 'B.', title: 'Preparación de Datos (Tabla I)' },
      { id: 'section-analisis-estadistico', num: 'C.', title: 'Análisis Exploratorio y ADF' },
      { id: 'section-modelos-config', num: 'D.', title: 'Modelos & Configuración (Tabla II)' },
      { id: 'section-evaluacion-metricas', num: 'E.', title: 'Protocolo de Evaluación & Métricas' },
      { id: 'section-resultados', num: 'F.', title: 'Resultados (Tablas III & IV, Figs. 12-13)' }
    ]
  },
  { id: 'section-conclusiones', num: 'V.', title: 'Conclusiones' },
  { id: 'section-futuros', num: 'VI.', title: 'Trabajo Futuro' },
  { id: 'section-referencias', num: 'VII.', title: 'Referencias Bibliográficas' }
];
