import styleCard from './css/paymentCard.module.css';
import styleTable from './css/paymentCard.module.css';

import { useState } from 'react';

function PaymentCard({ payments = [], onSelected }) {
    const [search, setSearch] = useState('');
    
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const handleInputSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleHeaderClick = (field) => {
        
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder(field === 'Fecha' ? 'desc' : 'asc');
        }
    };

    const filteredData = payments.filter(payment => {
        const folio = payment.Folio?.toString().toLowerCase() || '';
        const method = payment.Method?.toString().toLowerCase() || '';
        const amount =(payment.Amount ?? '').toString().toLowerCase();
        const date = payment.CreateDate?.split("T")[0] ?? '';
        const clientName = `${payment.Client?.Name.FirstName} 
        ${payment.Client.Name.SecondName || ''} 
        ${payment.Client.LastName.FatherLastName} 
        ${payment.Client?.LastName.MotherLastName}`
        .replace(/\s+/g, ' ').trim()
        .toLowerCase();

        const searchLower = search.toLowerCase();
        return (
            clientName.includes(searchLower) || 
            folio.includes(searchLower) ||
            method.includes(searchLower) ||
            date.includes(searchLower) ||
            amount.includes(searchLower)
        );
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortField) return 0;

        let aValue, bValue;

        switch (sortField) {
            case 'Folio':
                aValue = a.Folio;
                bValue = b.Folio;
                break;
            case 'Método':
                aValue = (a.Method ?? '').toLowerCase();
                bValue = (b.Method ?? '').toLowerCase();
                break;
            case 'Fecha':
                aValue = new Date(a.CreateDate);
                bValue = new Date(b.CreateDate);
                break;
            case 'Cliente':
                const aClient = `${a.Client?.Name?.FirstName ?? ''} ${a.Client?.Name?.SecondName ?? ''} ${a.Client?.LastName?.FatherLastName ?? ''} ${a.Client?.LastName?.MotherLastName ?? ''}`.toLowerCase();
                const bClient = `${b.Client?.Name?.FirstName ?? ''} ${b.Client?.Name?.SecondName ?? ''} ${b.Client?.LastName?.FatherLastName ?? ''} ${b.Client?.LastName?.MotherLastName ?? ''}`.toLowerCase();
                aValue = aClient;
                bValue = bClient;
                break;
            default:
                return 0;
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="d-flex justify-content-center align-content-center row">

            <div className={`d-flex justify-content-between align-items-end ${styleCard['header']}`}>
                <span className={`me-2 ${styleCard['title']}`}>Pagos</span>
                <div className={styleCard['group']}>
                    <input required type="text"
                        className={styleCard['input']}
                        value={search}
                        onChange={handleInputSearch} />
                    <span className={styleCard['highlight']} />
                    <span className={styleCard['bar']} />
                    <label className={styleCard['place-holder']}>
                        <i className="bi bi-search me-1"></i>
                        Buscar
                    </label>
                </div>
            </div>

            <table className="table table-hover justify-content-center">
                <thead className={styleCard['head-table']}>
                    <tr>
                        <th onClick={() => handleHeaderClick('Folio')} style={{ cursor: 'pointer' }}>
                            Folio {sortField === 'Folio' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                        </th>

                        <th>Estado</th>

                        <th onClick={() => handleHeaderClick('Cliente')} style={{ cursor: 'pointer' }}>
                            Cliente {sortField === 'Cliente' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th onClick={() => handleHeaderClick('Método')} style={{ cursor: 'pointer' }}>
                            Método {sortField === 'Método' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th>Monto</th>
                        {/* Nuevo encabezado */}
<<<<<<< HEAD
<<<<<<< HEAD

=======
                        <th>Abono</th>
>>>>>>> origin/Alexis
=======
                        <th>Abono</th>
>>>>>>> origin/Backup1
                        <th>Creado por</th>
                        <th onClick={() => handleHeaderClick('Fecha')} style={{ cursor: 'pointer' }}>
                            Fecha {sortField === 'Fecha' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                        </th>
                    </tr>
                </thead>
                <tbody className={`text-wrap ${styleCard['table-body']}`}>
                    {sortedData.map((item) => (
                        <tr className={styleTable['selected-row']}
                            key={item._id} onClick={() => onSelected(item)}
                            data-bs-toggle="modal" data-bs-target="#PaymentModal">
                            <td>{item.Folio}</td>
                            <td>{item.Status}</td>
                            <td>{`${item.Client?.Name?.FirstName ?? ''} ${item.Client?.Name?.SecondName ?? ''} ${item.Client?.LastName?.FatherLastName ?? ''} ${item.Client?.LastName?.MotherLastName ?? ''}`}</td>
                            <td>{item.Method}</td>
                            <td>{item.Amount}</td>
                            <td>{item.Abono}</td>
                            {/* Mostrar el administrador */}
                            <td>{item.Admin?.UserName ?? 'Sin asignar'}</td>
                            <td>{item.CreateDate?.split("T")[0]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
    
}

export default PaymentCard;
