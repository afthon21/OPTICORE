import styleCard from './css/ticketsCard.module.css';
import styleTable from './css/ticketsCard.module.css';

import { useState } from 'react';

function TicketsCard({ tickets = [], onSelected }) {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const handleInputSearch = (e) => {  
        setSearch(e.target.value);
    };

    // Filtro por estado, folio, fecha y cliente
    const filteredName = tickets.filter(ticket => {
        const folio = ticket.Folio?.toString().toLowerCase() || '';
        const estado = ticket.Status?.toLowerCase() || '';
        const fecha = ticket.CreateDate?.split("T")[0] || '';
        
        let clientName = `${ticket.Client.Name.FirstName} 
            ${ticket.Client.Name.SecondName || ''} 
            ${ticket.Client.LastName.FatherLastName}  
            ${ticket.Client.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim()
            .toLowerCase();

        const searchLower = search.toLowerCase();

        return (
            clientName.includes(searchLower) ||
            folio.includes(searchLower) ||
            estado.includes(searchLower) ||
            fecha.includes(searchLower)
        );
    });

    // Realiza el filtro y ordenamiento al dar click
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortOrder === 'asc'
            ? <i className="bi bi-arrow-up ms-1" />
            : <i className="bi bi-arrow-down ms-1" />;
    };

    const sortedTickets = [...filteredName].sort((a, b) => {
        const getClientName = (client) => (
            `${client.Name.FirstName} 
            ${client.Name.SecondName || ''} 
            ${client.LastName.FatherLastName} 
            ${client.LastName.MotherLastName}`
                .replace(/\s+/g, ' ').trim().toLowerCase()
        );

        let valueA, valueB;

        switch (sortField) {
            case 'cliente':
                valueA = getClientName(a.Client);
                valueB = getClientName(b.Client);
                break;
            case 'folio':
                valueA = a.Folio?.toString().toLowerCase();
                valueB = b.Folio?.toString().toLowerCase();
                break;
            case 'estado':
                valueA = a.Status?.toLowerCase();
                valueB = b.Status?.toLowerCase();
                break;
            case 'fecha':
                valueA = a.CreateDate?.split("T")[0];
                valueB = b.CreateDate?.split("T")[0];
                break;
            default:
                return 0;
        }

        return sortOrder === 'asc'
            ? valueA.localeCompare(valueB, 'es', { sensitivity: 'base' })
            : valueB.localeCompare(valueA, 'es', { sensitivity: 'base' });
    });

    return (
        <div className="d-flex justify-content-center align-content-center row">

            <div className={`d-flex justify-content-between align-items-end ${styleCard['header']}`}>
                <span className={`me-2 ${styleCard['title']}`}>Tickets</span>
                <div className={styleCard['group']}>
                    <input 
                        required 
                        type="text"
                        className={styleCard['input']}
                        onChange={handleInputSearch} 
                    />
                    <span className={styleCard['highlight']} />
                    <span className={styleCard['bar']} />
                    <label className={styleCard['place-holder']}>
                        <i className="bi bi-search me-1"></i>
                        Buscar...
                    </label>
                </div>
            </div>
            
            <table className="table table-hover justify-content-center">
                <thead className={styleCard['head-table']}>
                    <tr>
                        <th 
                            onClick={() => handleSort('folio')} 
                            style={{ cursor: 'pointer' }}
                        >
                            Folio {getSortIcon('folio')}
                        </th>
                        <th 
                            onClick={() => handleSort('cliente')} 
                            style={{ cursor: 'pointer' }}
                        >
                            Cliente {getSortIcon('cliente')}
                        </th>
                        <th>Prioridad</th>
                        <th>Asunto</th>
                        <th>Técnico</th>
                        <th>Creado por</th>
                        <th 
                            onClick={() => handleSort('estado')} 
                            style={{ cursor: 'pointer' }}
                        >
                            Estado {getSortIcon('estado')}
                        </th>
                        <th 
                            onClick={() => handleSort('fecha')} 
                            style={{ cursor: 'pointer' }}
                        >
                            Fecha {getSortIcon('fecha')}
                        </th>
                    </tr>
                </thead>
                
                <tbody className={`text-wrap ${styleCard['table-body']}`}>
                    {sortedTickets.map((item) => (
                        <tr 
                            className={`${styleTable['selected-row']}`}
                            key={item._id} 
                            onClick={() => onSelected(item)}
                            data-bs-toggle="modal" 
                            data-bs-target="#TicketModal"
                        >
                            <td>{item.Folio}</td>
                            <td>{`${item.Client.Name.FirstName} 
                                    ${item.Client.Name.SecondName || ''} 
                                    ${item.Client.LastName.FatherLastName} 
                                    ${item.Client.LastName.MotherLastName}`}</td>
                            <td>{item.Priority}</td>
                            <td>{item.Issue}</td>
                            <td>{item.tecnico || ''}</td>
                            <td>
                                {item.Admin?.UserName ?? 'Sin asignar'}
                            </td>
                            <td>{item.Status}</td>
                            <td>{item.CreateDate.split("T")[0]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
}

export default TicketsCard;
