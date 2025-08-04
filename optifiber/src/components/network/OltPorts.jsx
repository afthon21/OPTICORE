import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Typography, Button, Box, List, ListItem, ListItemButton, ListItemText, Stack
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CloseIcon from '@mui/icons-material/Close';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function OltPorts() {
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trafficHistories, setTrafficHistories] = useState({ ethernet: [], pon: [] });
  const [error, setError] = useState(false);
  const [portHistories, setPortHistories] = useState({});
  const [selectedPort, setSelectedPort] = useState(null);
  const [portType, setPortType] = useState('ethernet');

  useEffect(() => {
    const fetchData = () => {
      fetch(`http://localhost:4000/api/olt-ports-snmp?type=${portType}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPorts(data);
            setError(false);
            setLoading(false);

            const totalInBps = data.reduce((sum, port) => sum + (port.inBps || 0), 0);
            const totalOutBps = data.reduce((sum, port) => sum + (port.outBps || 0), 0);

            setTrafficHistories(prev => {
              const next = [...(prev[portType] || []), {
                time: new Date().toLocaleTimeString(),
                inBps: totalInBps,
                outBps: totalOutBps,
              }];
              return {
                ...prev,
                [portType]: next.length > 20 ? next.slice(-20) : next,
              };
            });

            setPortHistories(prev => {
              const next = { ...prev };
              data.forEach(port => {
                const key = `${portType}-${port.port}`;
                const history = next[key] || [];
                const newPoint = {
                  time: new Date().toLocaleTimeString(),
                  inBps: port.inBps,
                  outBps: port.outBps,
                };
                next[key] = [...history, newPoint].slice(-20);
              });
              return next;
            });
          } else {
            setPorts([]);
            setError(true);
            setLoading(false);
          }
        })
        .catch(err => {
          setPorts([]);
          setError(true);
          setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [portType]);

  if (loading) return <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Cargando...</Typography>;

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>
          Se perdió la conexión con la OLT.
        </Typography>
      </Box>
    );
  }

  const currentHistory = trafficHistories[portType] || [];

  const generalTrafficData = {
    labels: currentHistory.map(point => point.time),
    datasets: [
      {
        label: 'Entrada (MBps)',
        data: currentHistory.map(point => point.inBps / (1024 * 1024)),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Salida (MBps)',
        data: currentHistory.map(point => point.outBps / (1024 * 1024)),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.3,
      },
    ],
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'row', p: 2 }}>
      <Box sx={{ flexGrow: 1, pr: 2, overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          Estado de Puertos OLT
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'center' }}>
          <Button variant={portType === 'ethernet' ? 'contained' : 'outlined'} onClick={() => { setSelectedPort(null); setPortType('ethernet'); }}>
            Puertos Ethernet
          </Button>
          <Button variant={portType === 'pon' ? 'contained' : 'outlined'} onClick={() => { setSelectedPort(null); setPortType('pon'); }}>
            Puertos PON
          </Button>
        </Stack>

        <Box sx={{ maxWidth: '100%', height: 'calc(100vh - 160px)' }}>
          {selectedPort && portHistories[`${portType}-${selectedPort}`] ? (
            <>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShowChartIcon sx={{ mr: 1 }} />
                Tráfico Puerto {selectedPort} ({portType.toUpperCase()})
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<CloseIcon />}
                  sx={{ ml: 2 }}
                  onClick={() => setSelectedPort(null)}
                >
                  Cerrar gráfica
                </Button>
              </Typography>
              <Line
                data={{
                  labels: portHistories[`${portType}-${selectedPort}`].map(p => p.time),
                  datasets: [
                    {
                      label: 'Entrada (MBps)',
                      data: portHistories[`${portType}-${selectedPort}`].map(p => p.inBps / (1024 * 1024)),
                      borderColor: 'rgba(54, 162, 235, 1)',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      fill: false,
                      tension: 0.3,
                    },
                    {
                      label: 'Salida (MBps)',
                      data: portHistories[`${portType}-${selectedPort}`].map(p => p.outBps / (1024 * 1024)),
                      borderColor: 'rgba(255, 99, 132, 1)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      fill: false,
                      tension: 0.3,
                    },
                  ],
                }}
                options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
              />
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Tráfico General ({portType.toUpperCase()}) (MBps)
              </Typography>
              <Line
                data={generalTrafficData}
                options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
              />
            </>
          )}
        </Box>
      </Box>

      <Box sx={{ width: 280, borderLeft: '1px solid #ddd', pl: 2, overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Puertos {portType.toUpperCase()}
        </Typography>
        <List>
          {ports.map(port => (
            <ListItem key={port.port} disablePadding>
              <ListItemButton onClick={() => setSelectedPort(port.port)} selected={selectedPort === port.port}>
                <ListItemText
                  primary={`Puerto ${port.port} - ${port.name}`}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: port.status === 'Up' ? 'green' : 'red',
                        }}
                      />
                      Estado: {port.status} | Velocidad:{' '}
                      {port.speed && port.speed > 0
                        ? port.speed >= 1000000000
                          ? (port.speed / 1000000000).toFixed(2) + ' Gbps'
                          : (port.speed / 1000000).toFixed(0) + ' Mbps'
                        : 'Sin enlace'}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}