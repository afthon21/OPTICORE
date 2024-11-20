import { useEffect, useState } from "react";
import { handleLoadPay } from "./js/clientLoadPay";

import { LoadFragment } from "../fragments/Load.fragment";

function ClientPayments({ client }) {
    const [data, setData] = useState([]);
    const [select,setSelect] = useState(null)

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

        <table className="table table-hover table-sm" style={{ width: '30rem' }}>
            <thead>
                <tr>
                    <th>Folio</th>
                    <th>Cliente</th>
                </tr>
            </thead>
            <tbody className="text-wrap" style={{ fontSize: "0.8em" }}>
                {data ? (
                    data.map((item) => (
                        <tr key={item._id} onClick={()=>setSelect(item)}  style={{ cursor: 'pointer' }}>
                            <td>{item.Folio}</td>
                            <td>{`${item.Client.Name.FirstName} 
                                    ${item.Client.Name.SecondName || ''} 
                                    ${item.Client.LastName.FatherLastName} 
                                    ${item.Client.LastName.MotherLastName}`}</td>
                        </tr>
                    ))
                ) : (
                    <LoadFragment />
                )}
            </tbody>
        </table>
    );
}

export default ClientPayments;