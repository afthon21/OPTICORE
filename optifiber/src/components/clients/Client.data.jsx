import { LoadFragment } from '../fragments/Load.fragment';
import styleData from './css/ClientData.module.css'

function ClientData({ client }) {

    if (!client) {
        return (

            <>
                <label className={`form-label ${styleData['label']}`}>Nombre:</label>
                <div className="input-group mb-4">
                    <input type="text"
                        className={`form-control ${styleData['input']}`}
                        disabled />
                </div>

                <label className={`form-label ${styleData['label']}`}>Teléfono(s):</label>

                <div className="input-group mb-4">
                    <input type="text"
                        className={`form-control ${styleData['input']}`}
                        disabled />
                </div>


                <label className={`form-label ${styleData['label']}`}>Correo Electrónico:</label>
                <div className="input-group mb-4">
                    <input type="text"
                        className={`form-control ${styleData['input']}`}
                        disabled />
                </div>

                <label className={`form-label ${styleData['label']}`}>Dirección</label>
                <div className="input-group mb-4">
                    <span className={`input-group-text ${styleData['item']}`}>Calle:</span>
                    <input type="text"
                        className={`form-control ${styleData['input']}`}
                        disabled />
                </div>
                <div className="d-flex justify-content-between text-wrap">
                    <div className="input-group mb-4 me-4">
                        <span className={`input-group-text ${styleData['item']}`}>Numero Exterior:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            disabled />
                    </div>
                    <div className="input-group mb-4 ms-4">
                        <span className={`input-group-text ${styleData['item']}`}>Numero Interior:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            disabled />
                    </div>
                </div>
                <div className="d-flex justify-content-between text-wrap">
                    <div className="input-group mb-4">
                        <span className={`input-group-text ${styleData['item']}`}>Estado:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            disabled />
                    </div>
                    <div className="input-group mb-4 ms-4">
                        <span className={`input-group-text ${styleData['item']}`}>Código Postal:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            disabled />
                    </div>
                </div>
                <div className="d-flex justify-content-between text-wrap mb-4">
                    <div className="input-group mb-4">
                        <span className={`input-group-text ${styleData['item']}`}>Municipio:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            disabled />
                    </div>
                    <div className="input-group mb-4 ms-4">
                        <span className={`input-group-text ${styleData['item']}`}>Localidad:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            disabled />
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <label className={`form-label ${styleData['label']}`}>Nombre:</label>
                <div className="input-group mb-4">
                    <input type="text"
                        className={`form-control ${styleData['input']}`}
                        value={`${client.Name.FirstName} 
                                            ${client.Name.SecondName || ''} 
                                            ${client.LastName.FatherLastName} 
                                            ${client.LastName.MotherLastName}`
                            .replace(/\s+/g, ' ').trim()}
                        disabled />
                </div>

                <label className={`form-label ${styleData['label']}`}>Teléfono(s):</label>
                {client.PhoneNumber.map((item, index) => (
                    <div key={index} className="input-group mb-4">
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            value={item}
                            disabled />
                    </div>
                ))}

                <label className={`form-label ${styleData['label']}`}>Correo Electrónico:</label>
                <div className="input-group mb-4">
                    <input type="text"
                        className={`form-control ${styleData['input']}`}
                        value={client.Email || ''}
                        disabled />
                </div>

                <label className={`form-label ${styleData['label']}`}>Dirección</label>
                <div className="input-group mb-4">
                    <span className={`input-group-text ${styleData['item']}`}>Calle:</span>
                    <input type="text"
                        className={`form-control ${styleData['input']}`}
                        value={client.Location.Address || ''}
                        disabled />
                </div>
                <div className="d-flex justify-content-between text-wrap">
                    <div className="input-group mb-4 me-4">
                        <span className={`input-group-text ${styleData['item']}`}>Numero Exterior:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            value={client.Location.OutNumber || ''}
                            disabled />
                    </div>
                    <div className="input-group mb-4 ms-4">
                        <span className={`input-group-text ${styleData['item']}`}>Numero Interior:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            value={client.Location.InNumber || ''}
                            disabled />
                    </div>
                </div>
                <div className="d-flex justify-content-between text-wrap">
                    <div className="input-group mb-4">
                        <span className={`input-group-text ${styleData['item']}`}>Estado:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            value={client.Location.State || ''}
                            disabled />
                    </div>
                    <div className="input-group mb-4 ms-4">
                        <span className={`input-group-text ${styleData['item']}`}>Código Postal:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            value={client.Location.ZIP || ''}
                            disabled />
                    </div>
                </div>
                <div className="d-flex justify-content-between text-wrap mb-4">
                    <div className="input-group mb-4">
                        <span className={`input-group-text ${styleData['item']}`}>Municipio:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            value={client.Location.Municipality || ''}
                            disabled />
                    </div>
                    <div className="input-group mb-4 ms-4">
                        <span className={`input-group-text ${styleData['item']}`}>Localidad:</span>
                        <input type="text"
                            className={`form-control ${styleData['input']}`}
                            value={client.Location.Locality || ''}
                            disabled />
                    </div>
                </div>
            </>
        );
    }
}

export default ClientData;