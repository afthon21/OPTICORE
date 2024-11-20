import styleSearch from './css/ticketsCard.module.css';
import styleTable from './css/ticketsCard.module.css';
import styleCardHeader from './css/ticketsCard.module.css';

import { useState } from 'react';

function TicketsCard({ tickets = [], onSelected }) {
    const [search, setSearch] = useState('')

    const handleInputSearch = (e) => {
        setSearch(e.target.value);
    }

    const filteredName = tickets.filter(ticket => {
        let clientName = `${ticket.Client.Name.FirstName} 
        ${ticket.Client.Name.SecondName || ''} 
        ${ticket.Client.LastName.FatherLastName}  
        ${ticket.Client.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();

        return clientName.toLowerCase().includes(search.toLowerCase())
    });


    return (
        <>
            <div className="card shadow d-flex" style={{ width: '25rem' }}>
                <div className={`card-header ${styleCardHeader.header}`}>
                    <span>Tickets</span>
                    <div className={styleSearch.group}>
                        <input required type="text"
                            className={styleSearch.input}
                            onChange={handleInputSearch} />
                        <span className={styleSearch.highlight} />
                        <span className={styleSearch.bar} />
                        <label className={styleSearch['place-holder']}>
                            <i className="bi bi-search"></i>
                             Buscar...
                        </label>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-hover  table-sm d-block">
                        <thead>
                            <tr>
                                <th>Folio</th>
                                <th>Cliente</th>
                            </tr>
                        </thead>
                        <tbody className="text-wrap" style={{ fontSize: "0.8em" }}>
                            {filteredName.map((item) => (
                                <tr className={styleTable['selected-row']}
                                    key={item._id} onClick={() => onSelected(item)}>
                                    <td>{item.Folio}</td>
                                    <td>{`${item.Client.Name.FirstName} 
                                        ${item.Client.Name.SecondName || ''} 
                                        ${item.Client.LastName.FatherLastName} 
                                        ${item.Client.LastName.MotherLastName}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default TicketsCard