import styleCard from './css/ticketsCard.module.css';
import styleTable from './css/ticketsCard.module.css';

import { useState } from 'react';

function TicketsCard({ tickets = [], onSelected }) {
    const [search, setSearch] = useState('')
    const [sortField, setSortField]=useState('')
    const [sortOrder,setSortOrder]=useState('')

    const handleInputSearch = (e) => {  
        setSearch(e.target.value);
    };
    //Filtro por estado, folio y fecha
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
    //Realiza el ordenamiento
    const handleSort=(field)=>{
            if (sortField===field){
                setSortOrder(sortOrder==='asc' ? 'desc' : 'asc');
            }
            else {
                setSortField(field);
                setSortOrder('asc');
            }
    };

      const sortedTickets = [...filteredName].sort((a, b) => {
        const getClientName = (client) => (
            `${client.Name.FirstName} ${client.Name.SecondName || ''} ${client.LastName.FatherLastName} ${client.LastName.MotherLastName}`
                .replace(/\s+/g, ' ').trim().toLowerCase()
        );
        let valueA,ValueB;
        switch (sortField){
            case 'cliente':
                valueA=getClientName(a.Client);
                ValueB=getClientName(b.Client);
                break;
            case 'folio':
                valueA=a.Folio?.toString().toLowerCase();
                ValueB=b.Folio?.toString().toLowerCase();
                break;
            case 'estado':
                valueA=a.Status?.toLowerCase();
                ValueB=b.Status?.toLowerCase();
                break;
            case 'fecha':
                valueA=a.CreateDate?.split("T")[0];
                ValueB=b.CreateDate?.split("T")[0];
                break;
            default:
                return 0;
        }
    return sortOrder === 'asc'
        ? valueA.localeCompare(ValueB, 'es', { sensitivity: 'base' })
        : ValueB.localeCompare(valueA, 'es', { sensitivity: 'base' });
    });

    return (
        <div className="d-flex justify-content-center align-content-center row">

            <div className={`d-flex justify-content-between align-items-end ${styleCard['header']}`}>
                <span className={`me-2 ${styleCard['title']}`}>Tickets</span>
                <div className={styleCard['group']}>
                    <input required type="text"
                        className={styleCard['input']}
                        onChange={handleInputSearch} />
                    <span className={styleCard['highlight']} />
                    <span className={styleCard['bar']} />
                    <label className={styleCard['place-holder']}>
                        <i className="bi bi-search me-1"></i>
                        Buscar...
                    </label>
                </div>
            </div>
            
            {/* modificaciones click */}
                <table className="table table-hover justify-content-center">
                    <thead className={styleCard['head-table']}>
                        <tr>
                            <th onClick={()=>handleSort('folio')}style={{ cursor: 'pointer' }}
                                >Folio</th>
                            <th onClick={()=>handleSort('cliente')}style={{ cursor: 'pointer' }}
                                >Cliente</th>
                            <th>Prioridad</th>
                            <th>Asunto</th>
                            <th onClick={()=>handleSort('estado')}style={{ cursor: 'pointer' }}
                                >Estado</th>
                            <th onClick={()=>handleSort('fecha')}style={{ cursor: 'pointer' }}
                                >Fecha</th>
                        </tr>
                    </thead>
                    
                    <tbody className={`text-wrap ${styleCard['table-body']}`}>
                        {sortedTickets.map((item) => (
                            <tr className={`${styleTable['selected-row']}`}
                                key={item._id} onClick={() => onSelected(item)}
                                data-bs-toggle="modal" data-bs-target="#TicketModal">
                                <td>{item.Folio}</td>
                                <td>{`${item.Client.Name.FirstName} 
                                        ${item.Client.Name.SecondName || ''} 
                                        ${item.Client.LastName.FatherLastName} 
                                        ${item.Client.LastName.MotherLastName}`}
                                </td>
                                <td>{item.Priority}</td>
                                <td>{item.Issue}</td>
                                <td>{item.Status}</td>
                                <td>{item.CreateDate.split("T")[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            
        </div>
    );
}

export default TicketsCard