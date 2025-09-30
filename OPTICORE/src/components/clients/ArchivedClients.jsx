import React, { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest';
import { useParams } from 'react-router-dom';

function ArchivedClients() {
  const [clients, setClients] = useState([]);
  const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);
  const { adminId } = useParams();
  

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await makeRequest('/client/all');
        setClients((res || []).filter(c => c.Archived === true));
      } catch (error) {
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
    <div className="archived-clients-list">
      <h2>Clientes Archivados</h2>
      {/* Puedes mostrar el adminId si lo necesitas: <div>Admin: {adminId}</div> */}
      {clients.length === 0 ? (
        <p>No hay clientes archivados.</p>
      ) : (
        <ul className="list-group">
          {clients.map(client => (
            <li key={client._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{client.Name.FirstName} {client.Name.SecondName} {client.LastName.FatherLastName} {client.LastName.MotherLastName}</strong><br/>
                <span>{client.Email}</span>
              </div>
              <button className="btn btn-outline-success btn-sm" onClick={() => handleUnarchive(client._id)}>
                Desarchivar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ArchivedClients;