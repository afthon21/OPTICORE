import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

export default function Onus() {
  const [onus, setOnus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/network/onus')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener datos');
        return res.json();
      })
      .then((data) => setOnus(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getStatusText = (status) => {
    if (status === 'up' || status === 'Up') return 'Online';
    if (status === 'down' || status === 'Down') return 'Offline';
    return 'Desconocido';
  };

  const renderStatusIcon = (status) => {
    if (status === 'up' || status === 'Up') {
      return <CheckCircle color="success" />;
    }
    if (status === 'down' || status === 'Down') {
      return <Cancel color="error" />;
    }
    return null;
  };

  const renderActionsText = () => {
    return 'Config | Deactivate | Delete | Modify | Optical Info | Detail Info | Reboot';
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Cargando ONUs...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            ONUs Conectadas
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Index</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>In Octets</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Out Octets</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {onus.map((onu, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ backgroundColor: idx % 2 === 0 ? 'background.paper' : 'grey.100' }}
                  >
                    <TableCell>{onu.index}</TableCell>
                    <TableCell>{onu.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {renderStatusIcon(onu.status)}
                        <Typography sx={{ ml: 1 }}>{getStatusText(onu.status)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{onu.inOctets}</TableCell>
                    <TableCell>{onu.outOctets}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="primary">
                        {renderActionsText()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
