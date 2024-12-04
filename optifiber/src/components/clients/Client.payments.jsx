import stylePayment from './css/clientPayments.module.css'

import { useEffect, useState } from "react";
import { handleLoadPay } from "./js/clientLoadData.js";

import { LoadFragment } from "../fragments/Load.fragment";
import CreatePay from './CreatePay.modal.jsx';

function ClientPayments({ client }) {
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null)

    const fetchData = async () => {
        try {
            const result = await handleLoadPay(client);
            setData(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [client]);

    return (
        <>
            <div className="justify-content-end d-flex">
                <button 
                    data-bs-toggle="modal" 
                    data-bs-target="#CreatePayModal"
                    className={`${stylePayment['btn']}`}>
                    <i class="bi bi-plus-square-fill"></i>
                </button>

                <CreatePay client={client}/>
            </div>
            <table className={`table table-hover table-sm ${stylePayment['container']}`}>
                <thead className={`${stylePayment['header']}`}>
                    <tr>
                        <th>Folio</th>
                        <th>Método</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody className={`text-wrap ${stylePayment['body']}`}>
                    {data ? (
                        data.map((item) => (
                            <tr key={item._id} onClick={() => setSelect(item)} style={{ cursor: 'pointer' }}>
                                <td>{item.Folio}</td>
                                <td>{item.Method}</td>
                                <td>{item.Amount}</td>
                            </tr>
                        ))
                    ) : (
                        <LoadFragment />
                    )}
                </tbody>
            </table>
        </>
    );
}

export default ClientPayments;