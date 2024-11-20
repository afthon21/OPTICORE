import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
        <div className="card" style={{ width: '25rem', maxHeight: '250px'}}>
            <div className="card-body">
                <div className="card-header d-flex justify-content-between w-100">
                    <span>Tickets</span>
                    <div className="input-group input-group-sm" style={{ width: 'auto' }}>
                        <span className="input-group-text">
                            <i className="bi bi-search"></i>
                        </span>
                        <input type="text" className="form-control"
                            placeholder="Buscar..."
                            onChange={handleInputSearch} />
                    </div>
                </div>

                <table className="table table-hover  table-sm">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                        </tr>
                    </thead>
                    <tbody className="text-wrap" style={{ fontSize: "0.8em" }}>
                        {filteredName.map((item) => (
                            <tr key={item._id} onClick={() => onSelected(item)} style={{ cursor: 'pointer' }}>
                                
                                <td>{`${item.Name.FirstName} 
                                        ${item.Name.SecondName || ''} 
                                        ${item.LastName.FatherLastName} 
                                        ${item.LastName.MotherLastName}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClientsCard