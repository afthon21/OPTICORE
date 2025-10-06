import { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest';
import { useLocation } from 'react-router-dom';
import { useRegion } from '../../hooks/RegionContext';
import { LoadFragment } from '../fragments/Load.fragment.jsx';
import Swal from 'sweetalert2';

function ArchivedPayments() {
  console.log('🔄 ArchivedPayments - Componente inicializado');
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);
  const { region } = useRegion();
  const location = useLocation();
  
  console.log('🔄 ArchivedPayments - Región:', region);
  console.log('🔄 ArchivedPayments - Location:', location.pathname);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Iniciando fetch de pagos...');
        console.log('🔍 API Base URL:', import.meta.env.VITE_API_BASE);
        console.log('🔍 Región actual:', region);
        
        if (!region) {
          console.warn('⚠️ No hay región definida, saltando fetch');
          setLoading(false);
          return;
        }

        const res = await makeRequest('/pay/all');
        console.log('📊 Respuesta completa de la API:', res);
        console.log('📊 Tipo de respuesta:', typeof res);
        console.log('📊 Es array:', Array.isArray(res));
        
        if (!res) {
          console.warn('⚠️ No se obtuvieron datos de la API');
          setPayments([]);
          setDebugInfo({ 
            totalPayments: 0, 
            archivedCount: 0, 
            region: region,
            apiResponse: false,
            error: 'No hay datos de la API'
          });
          setLoading(false);
          return;
        }

        // Convertir a array si no lo es
        const paymentsArray = Array.isArray(res) ? res : [];
        console.log('📊 Cantidad total de pagos:', paymentsArray.length);

        // Debug: Mostrar algunos pagos de ejemplo
        if (paymentsArray.length > 0) {
          console.log('📊 Ejemplo de pago (primero):', paymentsArray[0]);
          console.log('📊 Campos del primer pago:', Object.keys(paymentsArray[0]));
        }

        // Filtrar pagos archivados
        const archivedPayments = paymentsArray.filter(p => {
          const isArchived = p.Archived === true;
          const hasClient = !!p.Client;
          const hasLocation = !!p.Client?.Location;
          const paymentRegion = p.Client?.Location?.State;
          const matchesRegion = paymentRegion === region;
          
          console.log(`🔍 Pago ${p.Folio}: Archivado=${isArchived}, TieneCliente=${hasClient}, TieneUbicacion=${hasLocation}, Region=${paymentRegion}, Coincide=${matchesRegion}`);
          
          return isArchived && matchesRegion;
        });
        
        console.log('✅ Pagos archivados encontrados:', archivedPayments.length);
        console.log('✅ Datos de pagos archivados:', archivedPayments);
        
        setDebugInfo({
          totalPayments: paymentsArray.length,
          archivedCount: archivedPayments.length,
          region: region,
          apiResponse: true,
          samplePayment: paymentsArray[0] || null
        });
        
        setPayments(archivedPayments);
        
      } catch (error) {
        console.error('❌ Error en fetchPayments:', error);
        setError(`Error al cargar pagos: ${error.message}`);
        setDebugInfo({
          totalPayments: 0,
          archivedCount: 0,
          region: region,
          apiResponse: false,
          error: error.message
        });
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [makeRequest, region]);

  const handleUnarchive = async (id) => {
    const payment = payments.find(p => p._id === id);
    const clientName = `${payment.Client?.Name?.FirstName || ''} ${payment.Client?.Name?.SecondName || ''} ${payment.Client?.LastName?.FatherLastName || ''} ${payment.Client?.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim();
    
    const result = await Swal.fire({
      title: '¿Desarchivar pago?',
      text: `¿Estás seguro de que quieres desarchivar el pago de ${clientName} (Folio: ${payment.Folio})?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, desarchivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (result.isConfirmed) {
      try {
        const response = await makeRequest(`/pay/unarchive/${id}`);
        console.log('Respuesta del desarchivado:', response);

        // Actualizar lista local
        setPayments(prev => prev.filter(p => p._id !== id));

        await Swal.fire({
          title: '¡Éxito!',
          text: 'El pago ha sido desarchivado correctamente',
          icon: 'success',
          toast: true,
          position: 'top',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });

      } catch (error) {
        console.error('Error al desarchivar:', error);
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo desarchivar el pago',
          icon: 'error',
          toast: true,
          position: 'top',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const formatAmount = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // Estados de carga
  if (loading) {
    return <LoadFragment />;
  }

  if (error) {
    return (
      <div className="container-fluid d-flex justify-content-center mt-5">
        <div className="text-center">
          <h5 className="text-danger">Error</h5>
          <p className="text-muted">{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="container-fluid d-flex justify-content-center mt-5">
        <div className="text-center">
          <h5>No hay pagos archivados</h5>
          <p className="text-muted">Los pagos archivados aparecerán aquí</p>
          {region && (
            <small className="text-info">
              Región actual: {region}
            </small>
          )}
          {!region && (
            <div className="alert alert-warning mt-3">
              <strong>⚠️ Atención:</strong> No se ha detectado una región. 
              Asegúrate de estar logueado correctamente.
            </div>
          )}
          
          {/* Información de debug */}
          {debugInfo && (
            <div className="mt-4">
              <details className="text-start">
                <summary className="btn btn-outline-info btn-sm">
                  Información de Debug
                </summary>
                <div className="mt-2 p-3 bg-light rounded">
                  <p><strong>Total de pagos:</strong> {debugInfo.totalPayments || 'No disponible'}</p>
                  <p><strong>Pagos archivados encontrados:</strong> {debugInfo.archivedCount || 0}</p>
                  <p><strong>Región actual:</strong> {debugInfo.region || 'No definida'}</p>
                  <p><strong>Respuesta de API:</strong> {debugInfo.apiResponse ? 'Exitosa' : 'Fallida'}</p>
                  <p><strong>URL actual:</strong> {location.pathname}</p>
                  {debugInfo.error && (
                    <p><strong>Error:</strong> <span className="text-danger">{debugInfo.error}</span></p>
                  )}
                  {debugInfo.samplePayment && (
                    <details className="mt-2">
                      <summary>Ver ejemplo de pago</summary>
                      <pre className="mt-2 p-2 bg-dark text-light rounded" style={{fontSize: '12px', overflow: 'auto'}}>
                        {JSON.stringify(debugInfo.samplePayment, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-12">
          <h4 className="mb-3">Pagos Archivados ({payments.length})</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Folio</th>
                  <th>Cliente</th>
                  <th>Método</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  const clientName = `${payment.Client?.Name?.FirstName || ''} ${payment.Client?.Name?.SecondName || ''} ${payment.Client?.LastName?.FatherLastName || ''} ${payment.Client?.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim();
                  
                  return (
                    <tr key={payment._id}>
                      <td>{payment.Folio || 'N/A'}</td>
                      <td>{clientName || 'N/A'}</td>
                      <td>{payment.Method || 'N/A'}</td>
                      <td>{formatAmount(payment.Amount)}</td>
                      <td>{formatDate(payment.CreateDate)}</td>
                      <td>
                        <span className={`badge ${
                          payment.Status === 'Exitoso' ? 'bg-success' :
                          payment.Status === 'En proceso' ? 'bg-warning' :
                          payment.Status === 'Pendiente' ? 'bg-secondary' :
                          payment.Status === 'Rechazado' ? 'bg-danger' :
                          payment.Status === 'Vencido' ? 'bg-dark' : 'bg-light'
                        }`}>
                          {payment.Status || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleUnarchive(payment._id)}
                          title="Desarchivar pago"
                        >
                          <i className="fas fa-undo"></i> Desarchivar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArchivedPayments;