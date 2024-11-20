import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { useState } from 'react';
import ClientPayments from './Client.payments';
import ClientData from './Client.data';
import ClientDocuments from './Clients.documents';

function ClientsInfo({ client }) {
    const [show, setShow] = useState({
        personalData: true,
        paymentsData: false,
        documentsFiles:false
    });

    const toggleData = (data) => {
        setShow((prevState) => ({
            ...prevState,
            [data]: !prevState[data]
        }))
    }

    return (
        <div className="card ms-3 me-5 border-0" style={{ width: '45rem' }}>
            <div className="card-body shadow">
                <div className="card-header d-flex justify-content-between">
                    <span><i className="bi bi-person-fill"></i> Client Details</span>
                </div>

                <div className="card-body">

                    {/** datos personales  */}
                    <div className="d-flex justify-content-center line-title mt-3">
                        <button className="btn btn-outline-secondary border-0 shadow"
                            onClick={() => toggleData('personalData')}>Ver Cliente</button>
                    </div>
                    {show.personalData && (
                        <ClientData client={client} />
                    )}

                    {/** Ver Documentos */}
                    <div className="d-flex justify-content-center line-title mt-3">
                        <button className="btn btn-outline-secondary border-0 shadow"
                            onClick={() => toggleData('documentsFiles')}>Ver Documentos</button>
                    </div>
                    {show.documentsFiles && (
                        <ClientDocuments client={client._id}/>
                    )}

                    {/** Ver pagos */}
                    <div className="d-flex justify-content-center line-title mt-3">
                        <button className="btn btn-outline-secondary border-0 shadow"
                            onClick={() => toggleData('paymentsData')}>Ver Pagos</button>
                    </div>
                    {show.paymentsData && (
                        <>
                            <div className="d-flex justify-content-center">
                                <ClientPayments client={client._id} />
                            </div>
                        </>
                    )}
                    
                </div>

                <div className="card-footer d-flex justify-content-between">
                    <div className="row" style={{ fontSize: "0.7em" }}>
                        <span>Dia: {client.CreateDate.split("T")[0]}</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ClientsInfo;