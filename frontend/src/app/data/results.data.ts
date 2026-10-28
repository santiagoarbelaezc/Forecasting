export interface MetricVariable {
  name: string;
  unit: string;
  category: string;
  varVal: number;
  lstmVal: number;
  tsmixerVal: number;
  itransformerVal: number;
  arimaVal: number;
  winner: 'iTransformer' | 'VAR' | 'TSMixer' | 'ARIMA' | 'LSTM';
}

export const RESULT_CATEGORIES: string[] = [
    'Todas',
    'Térmicas',
    'Humedad y Vapor',
    'Presión y Densidad',
    'Viento y Dinámica',
    'Radiación Solar',
    'Precipitación y Lluvia',
    'Calidad del Aire'
  ];

export const WINNER_FILTERS: string[] = ['Todos', 'iTransformer', 'VAR', 'TSMixer', 'ARIMA'];

export const TABLE_VARIABLES: MetricVariable[] = [
    { name: 'Presión atmosférica', unit: 'mbar', category: 'Presión y Densidad', varVal: 2.553, lstmVal: 3.910, tsmixerVal: 4.279, itransformerVal: 4.030, arimaVal: 2.516, winner: 'ARIMA' },
    { name: 'Temperatura', unit: '°C', category: 'Térmicas', varVal: 6.212, lstmVal: 2.900, tsmixerVal: 2.437, itransformerVal: 2.154, arimaVal: 3.260, winner: 'iTransformer' },
    { name: 'Temperatura potencial', unit: 'K', category: 'Térmicas', varVal: 6.274, lstmVal: 2.989, tsmixerVal: 2.448, itransformerVal: 2.202, arimaVal: 6.396, winner: 'iTransformer' },
    { name: 'Temperatura de rocío', unit: '°C', category: 'Térmicas', varVal: 1.821, lstmVal: 1.905, tsmixerVal: 1.845, itransformerVal: 1.851, arimaVal: 1.855, winner: 'VAR' },
    { name: 'Humedad relativa', unit: '%', category: 'Humedad y Vapor', varVal: 24.62, lstmVal: 13.37, tsmixerVal: 12.13, itransformerVal: 10.19, arimaVal: 12.28, winner: 'iTransformer' },
    { name: 'Presión de vapor de saturación', unit: 'mbar', category: 'Humedad y Vapor', varVal: 5.541, lstmVal: 2.282, tsmixerVal: 1.851, itransformerVal: 1.476, arimaVal: 1.982, winner: 'iTransformer' },
    { name: 'Presión de vapor real', unit: 'mbar', category: 'Humedad y Vapor', varVal: 0.981, lstmVal: 1.037, tsmixerVal: 1.015, itransformerVal: 1.027, arimaVal: 0.996, winner: 'VAR' },
    { name: 'Déficit de presión de vapor', unit: 'mbar', category: 'Humedad y Vapor', varVal: 5.250, lstmVal: 1.966, tsmixerVal: 1.460, itransformerVal: 1.151, arimaVal: 1.514, winner: 'iTransformer' },
    { name: 'Humedad específica', unit: 'g/kg', category: 'Humedad y Vapor', varVal: 0.619, lstmVal: 0.659, tsmixerVal: 0.653, itransformerVal: 0.648, arimaVal: 0.630, winner: 'VAR' },
    { name: 'Concentración de vapor de agua', unit: 'mmol/mol', category: 'Humedad y Vapor', varVal: 0.989, lstmVal: 1.048, tsmixerVal: 1.051, itransformerVal: 1.036, arimaVal: 1.006, winner: 'VAR' },
    { name: 'Densidad del aire', unit: 'g/m³', category: 'Presión y Densidad', varVal: 27.76, lstmVal: 14.47, tsmixerVal: 13.96, itransformerVal: 12.31, arimaVal: 24.20, winner: 'iTransformer' },
    { name: 'Velocidad del viento', unit: 'm/s', category: 'Viento y Dinámica', varVal: 1.424, lstmVal: 1.312, tsmixerVal: 1.244, itransformerVal: 1.287, arimaVal: 1.412, winner: 'TSMixer' },
    { name: 'Velocidad máxima del viento', unit: 'm/s', category: 'Viento y Dinámica', varVal: 2.363, lstmVal: 2.056, tsmixerVal: 1.866, itransformerVal: 1.856, arimaVal: 2.027, winner: 'iTransformer' },
    { name: 'Precipitación', unit: 'mm', category: 'Precipitación y Lluvia', varVal: 0.0285, lstmVal: 0.0310, tsmixerVal: 0.0303, itransformerVal: 0.0308, arimaVal: 0.0269, winner: 'ARIMA' },
    { name: 'Duración de la lluvia', unit: 's', category: 'Precipitación y Lluvia', varVal: 100.41, lstmVal: 103.85, tsmixerVal: 102.79, itransformerVal: 102.69, arimaVal: 112.60, winner: 'VAR' },
    { name: 'Radiación de onda corta', unit: 'W/m²', category: 'Radiación Solar', varVal: 215.87, lstmVal: 106.27, tsmixerVal: 71.62, itransformerVal: 62.80, arimaVal: 106.48, winner: 'iTransformer' },
    { name: 'PAR', unit: 'µmol/m²/s', category: 'Radiación Solar', varVal: 424.25, lstmVal: 208.78, tsmixerVal: 136.68, itransformerVal: 119.75, arimaVal: 205.59, winner: 'iTransformer' },
    { name: 'PAR máxima', unit: 'µmol/m²/s', category: 'Radiación Solar', varVal: 518.04, lstmVal: 260.10, tsmixerVal: 178.07, itransformerVal: 140.98, arimaVal: 234.18, winner: 'iTransformer' },
    { name: 'Temperatura de registro', unit: '°C', category: 'Térmicas', varVal: 6.598, lstmVal: 3.262, tsmixerVal: 2.528, itransformerVal: 2.203, arimaVal: 4.420, winner: 'iTransformer' },
    { name: 'CO₂', unit: 'ppm', category: 'Calidad del Aire', varVal: 24.50, lstmVal: 17.26, tsmixerVal: 14.41, itransformerVal: 11.68, arimaVal: 13.72, winner: 'iTransformer' },
    { name: 'Dirección del viento (seno)', unit: '–', category: 'Viento y Dinámica', varVal: 0.457, lstmVal: 0.482, tsmixerVal: 0.462, itransformerVal: 0.453, arimaVal: 0.487, winner: 'iTransformer' },
    { name: 'Dirección del viento (coseno)', unit: '–', category: 'Viento y Dinámica', varVal: 0.611, lstmVal: 0.530, tsmixerVal: 0.508, itransformerVal: 0.513, arimaVal: 0.534, winner: 'TSMixer' }
  ];
