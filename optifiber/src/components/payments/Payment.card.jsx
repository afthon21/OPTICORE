import styleSearch from './css/paymentCard.module.css';
import styleCardHeader from './css/paymentCard.module.css';
import styleTable from './css/paymentCard.module.css';

import { useState } from 'react';

function PaymentCard({ payments, onSelected }) {
    const [search, setSearch] = useState('')

    const handleInputSearch = (e) => {
        setSearch(e.target.value);
    }

    const filteredName = payments.filter(payment => {
        let clientName = `${payment.Client.Name.FirstName} 
        ${payment.Client.Name.SecondName || ''} 
        ${payment.Client.LastName.FatherLastName}  
        ${payment.Client.LastName.MotherLastName}`
            .replace(/\s+/g, ' ').trim();

        return clientName.toLowerCase().includes(search.toLowerCase())
    });

    return (
        <>
            <div className="card shadow d-flex" style={{ width: '25rem' }}>
                <div className={`card-header ${styleCardHeader.header}`}>
                    <span>Pagos</span>
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

export default PaymentCard;