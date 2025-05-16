import stylePayment from '../css/clientPayments.module.css'

import { useEffect, useState } from "react";
import ApiRequest from '../../hooks/apiRequest.jsx';

import { LoadFragment } from '../../fragments/Load.fragment.jsx';
import CreatePay from './CreatePay.modal.jsx';
import InfoPay from './Client.infoPay.jsx';

function ClientPayments({ client }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);
    const [sortColumn, setSortColumn] = useState(null); // 'Folio', 'Method', 'CreateDate'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    const fetchData = async () => {
        try {
            const res = await makeRequest(`/pay/all/${client}`);
            setData(res);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [makeRequest, client]);
    
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const getSortedData = () => {
        const sorted = [...data];
        if (!sortColumn) return sorted;

        sorted.sort((a, b) => {
            let valA = a[sortColumn];
            let valB = b[sortColumn];

            // For dates
            if (sortColumn === 'CreateDate') {
                valA = new Date(valA);
                valB = new Date(valB);
            }

            // For strings: Method
            if (typeof valA === 'string') {
                return sortOrder === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            // For numbers: Folio
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        });

        return sorted;
    };

    const sortedData = getSortedData();

    if (loading) return <LoadFragment />
    if (error) return <p>Error!</p>

    const renderArrow = (column) => {
        if (sortColumn !== column) return null;
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <>
            <div className="justify-content-end d-flex">
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#CreatePayModal"
                    className={`${stylePayment['btn']}`}>
                    <i className="bi bi-plus-square-fill"></i>
                </button>

                <CreatePay client={client ? client : ''} onPaymentCreated={fetchData} />
            </div>

            <table className={`table table-hover table-sm ${stylePayment['container']}`}>
                <thead className={`${stylePayment['header']}`}>
                    <tr>
                        <th onClick={() => handleSort('Folio')} style={{ cursor: 'pointer' }}>
                            Folio{renderArrow('Folio')}
                        </th>
                        <th onClick={() => handleSort('Method')} style={{ cursor: 'pointer' }}>
                            Método{renderArrow('Method')}
                        </th>
                        <th>Monto</th>
                        <th onClick={() => handleSort('CreateDate')} style={{ cursor: 'pointer' }}>
                            Fecha{renderArrow('CreateDate')}
                        </th>
                    </tr>
                </thead>
                <tbody className={`text-wrap ${stylePayment['body']}`}>
                    {
                        sortedData.map((item) => (
                            <tr key={item._id} onClick={() => setSelect(item)} style={{ cursor: 'pointer' }}
                                data-bs-toggle="modal" data-bs-target="#PaymentClientModal">
                                <td>{item.Folio}</td>
                                <td>{item.Method}</td>
                                <td>{item.Amount}</td>
                                <td>{item.CreateDate.split("T")[0]}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <InfoPay payment={select ? select : ''} />
        </>
    );
}

export default ClientPayments;
