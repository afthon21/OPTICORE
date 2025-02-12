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
    }, [makeRequest]);

    if (loading) return <LoadFragment />

    if (error) return <p>Error!</p>

    return (
        <>
            <div className="justify-content-end d-flex">
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#CreatePayModal"
                    className={`${stylePayment['btn']}`}>
                    <i class="bi bi-plus-square-fill"></i>
                </button>

                <CreatePay client={client ? client: ''} />
            </div>
            <table className={`table table-hover table-sm ${stylePayment['container']}`}>
                <thead className={`${stylePayment['header']}`}>
                    <tr>
                        <th>Folio</th>
                        <th>Método</th>
                        <th>Monto</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody className={`text-wrap ${stylePayment['body']}`}>
                    {
                        data.map((item) => (
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