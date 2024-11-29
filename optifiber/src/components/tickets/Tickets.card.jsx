import styleCard from './css/ticketsCard.module.css';
import styleTable from './css/ticketsCard.module.css';

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
        <div className={`card d-flex mt-3 ${styleCard['card-container']}`}>

            <div className={`d-flex justify-content-between align-items-end ${styleCard['header']}`}>
                <span className={`me-2 ${styleCard['title']}`}>Tickets</span>
                <div className={styleCard['group']}>
                    <input required type="text"
                        className={styleCard['input']}
                        onChange={handleInputSearch} />
                    <span className={styleCard['highlight']} />
                    <span className={styleCard['bar']} />
                    <label className={styleCard['place-holder']}>
                        <i className="bi bi-search"></i>
                        Buscar...
                    </label>
                </div>
            </div>
            
            <div className="card-body">
                <table className="table table-hover justify-content-center">
                    <thead className={styleCard['head-table']}>
                        <tr>
                            <th>Folio</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody className={`text-wrap ${styleCard['table-body']}`}>
                        {filteredName.map((item) => (
                            <tr className={styleTable['selected-row']}
                                key={item._id} onClick={() => onSelected(item)}>
                                <td>{item.Folio}</td>
                                <td>{`${item.Client.Name.FirstName} 
                                        ${item.Client.Name.SecondName || ''} 
                                        ${item.Client.LastName.FatherLastName} 
                                        ${item.Client.LastName.MotherLastName}`}</td>
                                <td>{item.CreateDate.split("T")[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TicketsCard