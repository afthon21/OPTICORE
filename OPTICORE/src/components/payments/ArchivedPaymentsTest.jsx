import { useEffect, useState } from 'react';
import { useRegion } from '../../hooks/RegionContext';

function ArchivedPaymentsTest() {
  const [status, setStatus] = useState('Inicializando...');
  const { region } = useRegion();

  useEffect(() => {
    console.log('🧪 TEST - Componente de prueba cargado');
    console.log('🧪 TEST - Región:', region);
    setStatus(`Cargado correctamente. Región: ${region || 'No definida'}`);
  }, [region]);

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-12">
          <div className="alert alert-info">
            <h4>🧪 Componente de Prueba - Pagos Archivados</h4>
            <p><strong>Estado:</strong> {status}</p>
            <p><strong>Región actual:</strong> {region || 'No definida'}</p>
            <p><strong>URL:</strong> {window.location.pathname}</p>
            <hr />
            <p>Si puedes ver este mensaje, la ruta funciona correctamente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArchivedPaymentsTest;