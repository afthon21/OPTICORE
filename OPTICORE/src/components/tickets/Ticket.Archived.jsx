import React, { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest';
import { useParams } from 'react-router-dom';

function ArchivedTickets() {
  const [tickets, setTickets] = useState([]);
  const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);
  const { adminId } = useParams();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await makeRequest('/ticket/archived');
        setTickets(res || []);
      } catch (error) {
        setTickets([]);
      }
    };
    fetchTickets();
  }, [makeRequest]);

  const handleUnarchive = async (id) => {
    try {
      await makeRequest(`/ticket/edit/${id}`, {
        method: 'POST',
        body: JSON.stringify({ Archived: false }),
        headers: { 'Content-Type': 'application/json' }
      });
      setTickets(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error unarchiving ticket:', error);
    }
  };

  return (
    <div className="archived-tickets-list mt-4">
      <h2 className="mb-4">Tickets Archivados</h2>
      {tickets.length === 0 ? (
        <p>No hay tickets archivados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Folio</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Asunto</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket._id}>
                  <td>{ticket.Folio}</td>
                  <td>
                    {ticket.ClientName
                      ? ticket.ClientName
                      : (ticket.Client && ticket.Client.Name)
                        ? `${ticket.Client.Name.FirstName} ${ticket.Client.Name.SecondName || ''} ${ticket.Client.LastName.FatherLastName || ''} ${ticket.Client.LastName.MotherLastName || ''}`
                        : 'Sin cliente'}
                  </td>
                  <td>{ticket.CreateDate ? new Date(ticket.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}</td>
                  <td>{ticket.Issue || 'Sin asunto'}</td>
                  <td>
                    <button className="btn btn-outline-success btn-sm" onClick={() => handleUnarchive(ticket._id)}>
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

export default ArchivedTickets;