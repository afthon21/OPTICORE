import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrar los componentes necesarios
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const RadioChart = ({ data: chartDataProp }) => {
  // Datos dinámicos de Radio Frecuencia o datos de ejemplo por defecto
  const defaultData = {
    labels: ['10 Megas', '15 Megas', '20 Megas'],
    data: [45, 32, 23]
  };
  
  const dataToUse = chartDataProp || defaultData;
  
  const data = {
    labels: dataToUse.labels,
    datasets: [
      {
        label: 'Clientes por Plan',
        data: dataToUse.data,
        backgroundColor: [
          '#FF9F40',
          '#9966FF',
          '#FF6384'
        ],
        borderColor: [
          '#FF9F40',
          '#9966FF',
          '#FF6384'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 10,
          usePointStyle: true,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        enabled: false, // Deshabilitar tooltip para evitar duplicación
      },
      datalabels: {
        display: true,
        color: 'white',
        font: {
          weight: 'bold',
          size: 12
        },
        formatter: (value, context) => {
          return value + '%';
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '180px', position: 'relative' }}>
      <Pie data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

export default RadioChart;