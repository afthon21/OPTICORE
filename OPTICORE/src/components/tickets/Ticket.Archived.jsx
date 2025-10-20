import React, { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest';
import styleCard from './css/ticketsCard.module.css';

function ArchivedTickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await makeRequest('/ticket/archived');
        setTickets(res || []);
      } catch (error) {
        console.error(error);
        setTickets([]);
      }
    };
    fetchTickets();
  }, [makeRequest]);

  const handleUnarchive = async (id) => {
    try {
      await makeRequest(`/ticket/edit/${id}`, 'POST', { Archived: false });
      setTickets(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error desarchivando ticket:', error);
    }
  };

  const handleInputSearch = (e) => setSearch(e.target.value);

  const filteredTickets = tickets.filter(ticket => {
    const clientName =
      ticket.ClientName ||
      (ticket.Client?.Name
        ? `${ticket.Client.Name.FirstName || ''} ${ticket.Client.Name.SecondName || ''} ${ticket.Client.LastName.FatherLastName || ''} ${ticket.Client.LastName.MotherLastName || ''}`
            .replace(/\s+/g, ' ')
            .trim()
        : 'Sin cliente');
    return (
      (ticket.Folio && ticket.Folio.toString().includes(search)) ||
      clientName.toLowerCase().includes(search.toLowerCase()) ||
      (ticket.Issue && ticket.Issue.toLowerCase().includes(search.toLowerCase()))
    );
  });

 return (
  <div className="container-fluid mt-4">
    {/* Encabezado y buscador */}
    <div className={`d-flex justify-content-between align-items-end flex-wrap mb-3 ${styleCard['header']}`}>
      <span className={`fs-4 fw-semibold ${styleCard['title']}`}>Tickets Archivados</span>
      <div style={{ maxWidth: '250px' }}>
        
      </div>
    </div>

    {/* Tabla */}
    <div className="table-responsive">
      <table className="table table-hover align-middle text-center shadow-sm border rounded-3 w-100">
        <thead className={styleCard['head-table']}>
          <tr>
            <th>Folio</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Asunto</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody className={`text-wrap ${styleCard['table-body']}`}>
          {filteredTickets.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted py-3">
                No hay tickets archivados.
              </td>
            </tr>
          ) : (
            filteredTickets.map(ticket => {
              const clientName =
                ticket.ClientName ||
                (ticket.Client?.Name
                  ? `${ticket.Client.Name.FirstName || ''} ${ticket.Client.Name.SecondName || ''} ${ticket.Client.LastName.FatherLastName || ''} ${ticket.Client.LastName.MotherLastName || ''}`
                      .replace(/\s+/g, ' ')
                      .trim()
                  : 'Sin cliente');

              return (
                <tr key={ticket._id} className={styleCard['selected-row']} style={{ cursor: 'pointer' }}>
                  <td>
                    <span className="badge bg-secondary">{ticket.Folio || 'N/A'}</span>
                  </td>
                  <td className="fw-semibold">{clientName}</td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {ticket.CreateDate
                        ? new Date(ticket.CreateDate).toLocaleDateString('es-ES')
                        : 'Sin fecha'}
                    </span>
                  </td>
                  <td>{ticket.Issue || <span className="text-muted">Sin asunto</span>}</td>
                  <td>
                    <span className="badge bg-warning text-dark">Archivado</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={e => {
                        e.stopPropagation();
                        handleUnarchive(ticket._id);
                      }}
                    >
                      <i className="bi bi-arrow-bar-up me-1"></i>
                      Desarchivar
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default ArchivedTickets;
