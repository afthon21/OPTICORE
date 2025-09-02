import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Grid, Divider } from '@mui/material';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

export default function NetworkHealth() {
  const [healthHistory, setHealthHistory] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({
    model: '',
    mac: '',
    ip: '',
    firmware: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/network/device-info')
      .then(res => res.json())
      .then(data => setDeviceInfo(data));
  }, []);

  useEffect(() => {
    const fetchHealth = () => {
      fetch('http://localhost:3000/api/network/network-health-history')
        .then(res => res.json())
        .then(data => setHealthHistory(data));
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 60000); // cada minuto
    return () => clearInterval(interval);
  }, []);

  // Prepara los datos para la gráfica
  const scatterData = {
    datasets: [
      {
        label: 'Salud',
        data: healthHistory.map((point, idx) => ({
          x: idx, // Puedes usar idx o convertir el timestamp a hora
          y: point.health,
        })),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Network Health (últimas 24h)' },
    },
    scales: {
      x: {
        title: { display: true, text: 'Muestra (cada 5 min)' },
        min: 0,
        max: 288, // 24h si es cada 5 min
      },
      y: {
        title: { display: true, text: 'Salud (%)' },
        min: 0,
        max: 100,
      },
    },
  };

  // Calcula el valor actual y promedio para mostrarlo en la tarjeta
  const currentHealth = healthHistory.length > 0 ? healthHistory[healthHistory.length - 1].health : 99;
  const avgHealth = healthHistory.length > 0
    ? (healthHistory.reduce((sum, p) => sum + p.health, 0) / healthHistory.length).toFixed(1)
    : 99;

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NetworkCheckIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5">Network Health</Typography>
                  <Typography variant="h4" color="primary">{currentHealth}%</Typography>
                  <Typography variant="body2" color="text.secondary">/ {avgHealth}% Avg</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                {/* Imagen del dispositivo */}
                <img
                  src="/device.png"
                  alt="Dispositivo OLT"
                  style={{ width: 80, marginBottom: 8 }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
                {/* Si no tienes imagen, puedes mostrar un icono */}
                {/* <DeviceHubIcon sx={{ fontSize: 60, color: '#888', mb: 1 }} /> */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {deviceInfo.model || 'V-SOL OLT'}
                </Typography>
                <Typography variant="body2">MAC: {deviceInfo.mac || 'Desconocido'}</Typography>
                <Typography variant="body2">IP: {deviceInfo.ip || 'Desconocida'}</Typography>
                <Typography variant="body2">Firmware: {deviceInfo.firmware || 'Desconocido'}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Scatter data={scatterData} options={scatterOptions} height={300} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}