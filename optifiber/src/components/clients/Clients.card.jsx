import styleCard from './css/clientsCard.module.css';
import styleTable from './css/clientsCard.module.css';

import { useState } from 'react';

function ClientsCard({ clients = [], onSelected }) {
    const [search, setSearch] = useState('')

    const handleInputSearch = (e) => {
        setSearch(e.target.value);
    }

    const filteredName = clients.filter(client => {
        let clientName = `${client.Name.FirstName} 
        ${client.Name.SecondName || ''} 
        ${client.LastName.FatherLastName}  
        ${client.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();

        return clientName.toLowerCase().includes(search.toLowerCase())
    });

    return (
        <div className={`card d-flex mt-3 ${styleCard['card-container']}`}>

            <div className={`d-flex justify-content-between align-items-end ${styleCard['header']}`}>
                <span className={`me-2 ${styleCard['title']}`}>Clientes</span>
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
                            <th>Nombre</th>
                        </tr>
                    </thead>
                    <tbody className={`text-wrap ${styleCard['table-body']}`}>
                        {filteredName.map((item) => (
                            <tr 
                                className={styleTable['selected-row']}
                                key={item._id} 
                                onClick={() => onSelected(item)}>

                                <td>{`${item.Name.FirstName} 
                                        ${item.Name.SecondName || ''} 
                                        ${item.LastName.FatherLastName} 
                                        ${item.LastName.MotherLastName}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClientsCard