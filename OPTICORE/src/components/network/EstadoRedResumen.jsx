import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';

export default function EstadoRedResumen() {
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

  return (
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
  );
}
