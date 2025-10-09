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
    <div className="d-flex justify-content-center align-content-center row">
      <div className={`d-flex justify-content-between align-items-end ${styleCard['header']}`}> 
        <span className={`me-2 ${styleCard['title']}`}>Tickets Archivados</span>
        <span className="text-primary"><i className="bi bi-archive-fill"></i></span>
      </div>
      <table className="table table-hover justify-content-center">
        <thead className={styleCard['head-table']}>
          <tr>
            <th>Folio</th>
            <th>Cliente</th>
            <th>Prioridad</th>
            <th>Asunto</th>
            <th>Técnico</th>
            <th>Creado por</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody className={`text-wrap ${styleCard['table-body']}`}>
          {tickets.length === 0 ? (
            <tr><td colSpan={9} className="text-center">No hay tickets archivados.</td></tr>
          ) : (
            tickets.map(ticket => (
              <tr key={ticket._id} className={styleTable['selected-row']}>
                <td>{ticket.Folio}</td>
                <td>{ticket.ClientName
                  ? ticket.ClientName
                  : (ticket.Client && ticket.Client.Name)
                    ? `${ticket.Client.Name.FirstName} ${ticket.Client.Name.SecondName || ''} ${ticket.Client.LastName.FatherLastName || ''} ${ticket.Client.LastName.MotherLastName || ''}`
                    : 'Sin cliente'}</td>
                <td>{ticket.Priority || '-'}</td>
                <td>{ticket.Issue || <span className="text-muted">Sin asunto</span>}</td>
                <td>{ticket.tecnico || '-'}</td>
                <td>{ticket.Admin?.UserName ?? 'Sin asignar'}</td>
                <td><span className="badge bg-warning text-dark">Archivado</span></td>
                <td>{ticket.CreateDate ? ticket.CreateDate.split("T")[0] : '-'}</td>
                <td>
                  <button className="btn btn-outline-success btn-sm" onClick={() => handleUnarchive(ticket._id)}>
                    <i className="bi bi-arrow-bar-up me-1"></i> Desarchivar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ArchivedTickets;