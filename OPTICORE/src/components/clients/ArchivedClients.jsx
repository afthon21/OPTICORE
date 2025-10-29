import React, { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest';

function ArchivedClients() {
  const [clients, setClients] = useState([]);
  const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await makeRequest('/client/all');
        setClients((res || []).filter(c => c.Archived === true));
      } catch (err) {
        console.error('Error fetching archived clients:', err);
        setClients([]);
      }
    };
    fetchClients();
  }, [makeRequest]);

  const handleUnarchive = async (id) => {
    try {
      await makeRequest(`/client/edit/${id}`, {
        method: 'POST',
        body: JSON.stringify({ Archived: false }),
        headers: { 'Content-Type': 'application/json' }
      });
      setClients(prev => prev.filter(c => c._id !== id));
    } catch (error) {
        console.error('Error unarchiving client:', error);
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