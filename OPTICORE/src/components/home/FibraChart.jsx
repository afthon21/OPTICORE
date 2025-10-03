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

const FibraChart = ({ data: chartDataProp }) => {
  // Datos dinámicos de Fibra Óptica o datos de ejemplo por defecto
  const defaultData = {
    labels: ['50 Megas', '100 Megas', '200 Megas', '300 Megas'],
    data: [35, 28, 22, 15]
  };
  
  const dataToUse = chartDataProp || defaultData;
  
  const data = {
    labels: dataToUse.labels,
    datasets: [
      {
        label: 'Clientes por Plan',
        data: dataToUse.data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0'
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0'
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

export default FibraChart;