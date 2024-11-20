import { useEffect, useState } from "react";
import { handleLoadDocuments } from "./js/clientDocuments";

function ClientDocuments({ client }) {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const result = await handleLoadDocuments(client);
            setData(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [client]);

    return (
        <table className="table table-hover table-sm">
            <thead>
                <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Archivo</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item._id}  style={{ width: '30rem' }}>
                        <td><i clasName="bi bi-file-earmark-richtext-fill"></i></td>
                        <td>{item.Description}</td>
                        <td><a role="button" href={item.Document}>Ver archivo</a></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ClientDocuments;