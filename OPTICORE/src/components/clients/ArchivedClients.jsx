import { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function ArchivedClients() {
  const [clients, setClients] = useState([]);
  const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);
  const location = useLocation();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await makeRequest('/client/all');
        console.log('Todos los clientes:', res); // Debug
        const archivedClients = (res || []).filter(c => c.Archived === true);
        console.log('Clientes archivados encontrados:', archivedClients); // Debug
        setClients(archivedClients);
      } catch (error) {
        console.error('Error al obtener clientes:', error); // Debug mejorado
        setClients([]);
      }
    };
    fetchClients();
  }, [makeRequest]);

  // Refrescar cuando se navega a esta página (útil cuando se llega desde archivado)
  useEffect(() => {
    const refetchClients = async () => {
      try {
        const res = await makeRequest('/client/all');
        console.log('Refrescando clientes archivados'); // Debug
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
          // Mantenerse en esta página (Archivados) después de desarchivar
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
    <div className="archived-clients-list mt-4">
      <h2 className="mb-4">Clientes Archivados</h2>
      {clients.length === 0 ? (
        <p>No hay clientes archivados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client._id}>
                  <td>
                    <strong>{client.Name.FirstName} {client.Name.SecondName} {client.LastName.FatherLastName} {client.LastName.MotherLastName}</strong>
                  </td>
                  <td>{client.Email}</td>
                  <td>{Array.isArray(client.PhoneNumber) ? client.PhoneNumber.join(', ') : client.PhoneNumber}</td>
                  <td>
                    {client.Location ? (
                      <span>
                        {client.Location.State}, {client.Location.Municipality}, {client.Location.Address}
                      </span>
                    ) : 'Sin dirección'}
                  </td>
                  <td>
                    <button className="btn btn-outline-success btn-sm" onClick={() => handleUnarchive(client._id)}>
                      Desarchivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ArchivedClients;