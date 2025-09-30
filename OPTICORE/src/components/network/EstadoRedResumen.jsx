import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';

export default function EstadoRedResumen() {
  const [deviceInfo, setDeviceInfo] = useState({
    model: '',
    mac: '',
    ip: '',
    firmware: ''
  });

  // Estados para Network Health
  const [currentHealth, setCurrentHealth] = useState(85);
  const [avgHealth, setAvgHealth] = useState(78);

  useEffect(() => {
    fetch('http://localhost:3000/api/network/device-info')
      .then(res => res.json())
      .then(data => setDeviceInfo(data));
  }, []);

  return (
    <Box>
      {/* Network Health Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <NetworkCheckIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Box>
          <Typography variant="h5">Network Health</Typography>
          <Typography variant="h4" color="primary">{currentHealth}%</Typography>
          <Typography variant="body2" color="text.secondary">/ {avgHealth}% Avg</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />

      {/* Device Info Section */}
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
    </Box>
  );
}
