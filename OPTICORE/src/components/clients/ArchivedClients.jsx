import { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import styleCard from './css/clientsCard.module.css';

function ArchivedClients() {
  const [clients, setClients] = useState([]);
  const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);
  const location = useLocation();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await makeRequest('/client/all');
        console.log('Todos los clientes:', res); 
        const archivedClients = (res || []).filter(c => c.Archived === true);
        console.log('Clientes archivados encontrados:', archivedClients); 
        setClients(archivedClients);
      } catch (error) {
        console.error('Error al obtener clientes:', error); 
        setClients([]);
      }
    };
    fetchClients();
  }, [makeRequest]);

  
  useEffect(() => {
    const refetchClients = async () => {
      try {
        const res = await makeRequest('/client/all');
        console.log('Refrescando clientes archivados'); 
        const archivedClients = (res || []).filter(c => c.Archived === true);
        setClients(archivedClients);
      } catch (error) {
        console.error('Error al refrescar:', error);
      }
    };
    refetchClients();
  }, [location.pathname, makeRequest]);

  const handleUnarchive = async (id) => {
    const client = clients.find(c => c._id === id);
    const clientName = `${client.Name.FirstName} ${client.Name.SecondName || ''} ${client.LastName.FatherLastName} ${client.LastName.MotherLastName}`.replace(/\s+/g, ' ').trim();
    
    const result = await Swal.fire({
      title: '¿Desarchivar cliente?',
      text: `¿Estás seguro de que quieres desarchivar a ${clientName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, desarchivar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        console.log('Desarchivando cliente:', id); // Debug
        const updated = await makeRequest(`/client/unarchive/${id}`, 'POST');
        if (updated) {
          setClients(prev => prev.filter(c => c._id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Cliente desarchivado',
            text: `${clientName} ha sido desarchivado exitosamente`,
            timer: 1500,
            position: 'top',
            showConfirmButton: false,
            toast: true
          });
         
        }
      } catch (error) {
          console.error('Error unarchiving client:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo desarchivar el cliente',
            timer: 1500,
            showConfirmButton: false,
            position: 'top',
            toast: true
          });
      }
    }
  };

return (
  <div className="container-fluid mt-4">
    {/* Encabezado */}
    <div className={`d-flex justify-content-between align-items-end flex-wrap mb-3 ${styleCard['header']}`}>
      <span className={`fs-4 fw-semibold ${styleCard['title']}`}>Clientes Archivados</span>
      <span className="text-primary">
        <i className="bi bi-people-fill"></i>
      </span>
    </div>

    <div className="table-responsive">
      <table className="table table-hover align-middle text-center shadow-sm border rounded-3 w-100">
        <thead className={styleCard['head-table']}>
          <tr>
            <th>Folio</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Paquete</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody className={`text-wrap ${styleCard['table-body']}`}>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted py-3">
                No hay clientes archivados.
              </td>
            </tr>
          ) : (
            clients.map(client => (
              <tr key={client._id} className={styleCard['selected-row']}>
                <td>{client._id}</td>
                <td>
                  <strong>
                    {`${client.Name.FirstName} ${client.Name.SecondName || ''} ${client.LastName.FatherLastName || ''} ${client.LastName.MotherLastName || ''}`
                      .replace(/\s+/g, ' ')
                      .trim()}
                  </strong>
                </td>
                <td>
                  {Array.isArray(client.PhoneNumber)
                    ? client.PhoneNumber.join(', ')
                    : client.PhoneNumber || 'N/A'}
                </td>
                <td className="text-muted">
                  {Array.isArray(client.Packages) && client.Packages.length > 0
                    ? client.Packages.map(p => `${p.name || p.folio || 'Paquete'}${p.folio ? ` (${p.folio})` : ''}`).join(', ')
                    : 'Sin paquete'}
                </td>
                <td>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleUnarchive(client._id)}
                  >
                    <i className="bi bi-arrow-bar-up me-1"></i>
                    Desarchivar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default ArchivedClients;