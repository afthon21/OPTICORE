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
      const res = await makeRequest(`/ticket/edit/${id}`, 'POST', { Archived: false });
      console.log('Respuesta desarchivar:', res);
      setTickets(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error unarchiving ticket:', error);
    }
  };

  return (
    <div className="archived-tickets-list mt-4">
      <h2 className="mb-4 text-center">
        <i className="bi bi-archive-fill me-2 text-primary"></i>
        Tickets Archivados
      </h2>
      {tickets.length === 0 ? (
        <div className="alert alert-info text-center">No hay tickets archivados.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle shadow-sm">
            <thead style={{ background: '#343a40', color: '#fff' }}>
              <tr>
                <th><i className="bi bi-hash"></i> Folio</th>
                <th><i className="bi bi-person"></i> Cliente</th>
                <th><i className="bi bi-calendar"></i> Fecha</th>
                <th><i className="bi bi-chat-left-text"></i> Asunto</th>
                <th><i className="bi bi-archive"></i> Estado</th>
                <th><i className="bi bi-arrow-repeat"></i> Acción</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket._id} style={{ background: '#f8f9fa' }}>
                  <td><span className="badge bg-secondary">{ticket.Folio}</span></td>
                  <td>
                    <span className="fw-bold text-dark">
                      {ticket.ClientName
                        ? ticket.ClientName
                        : (ticket.Client && ticket.Client.Name)
                          ? `${ticket.Client.Name.FirstName} ${ticket.Client.Name.SecondName || ''} ${ticket.Client.LastName.FatherLastName || ''} ${ticket.Client.LastName.MotherLastName || ''}`
                          : 'Sin cliente'}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {ticket.CreateDate ? new Date(ticket.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}
                    </span>
                  </td>
                  <td>{ticket.Issue || <span className="text-muted">Sin asunto</span>}</td>
                  <td>
                    <span className="badge bg-warning text-dark">Archivado</span>
                  </td>
                  <td>{ticket.CreateDate ? new Date(ticket.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}</td>
                  <td>{ticket.Issue || 'Sin asunto'}</td>
                  <td>
                    <button className="btn btn-outline-success btn-sm" onClick={() => handleUnarchive(ticket._id)}>
                      <i className="bi bi-arrow-bar-up me-1"></i> Desarchivar
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