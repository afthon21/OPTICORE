import React, { useState } from 'react';
import { Box, ButtonGroup, Button, Typography } from '@mui/material';
import NetworkHealth from './NetworkHealth';
import OltPorts from './OltPorts';
import Logs from './Logs';

export default function FibraOptica() {
  const [view, setView] = useState('salud');

  const renderView = () => {
    switch (view) {
      case 'salud':
        return <NetworkHealth />;
      case 'trafico':
        return <OltPorts />;
         default:
        return <NetworkHealth />;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Monitor de Fibra Óptica
      </Typography>

      {/* Toggle Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ButtonGroup variant="contained">
          <Button
            onClick={() => setView('salud')}
            color={view === 'salud' ? 'primary' : 'inherit'}
          >
            Salud de Red
          </Button>
          <Button
            onClick={() => setView('trafico')}
            color={view === 'trafico' ? 'primary' : 'inherit'}
          >
            Tráfico de Red
          </Button>
        
        </ButtonGroup>
      </Box>

      {/* Condicionalmente muestra los componentes */}
      {renderView()}
    </Box>
  );
}
