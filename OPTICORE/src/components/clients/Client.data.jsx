import { useState, useEffect } from 'react';
import styleData from './css/ClientData.module.css';
import EditClientModal from './EditClientModal';

function ClientData({ client, onUpdateClient }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentClient, setCurrentClient] = useState(client);

    // Si el prop client cambia (por ejemplo, seleccionas otro cliente), actualiza el estado local
    useEffect(() => {
        setCurrentClient(client);
    }, [client]);

    const Indicators = () => (
        <div className={styleData['indicator-container']}>
            <div className={`${styleData['circle']} ${styleData['red']}`}
                style={{ cursor: 'pointer' }}
                title="Archivar cliente"
            ></div>
            <div
                className={`${styleData['circle']} ${styleData['orange']}`}
                onClick={() => setShowEditModal(true)}
                style={{ cursor: 'pointer' }}
                title="Editar cliente"
            ></div>
            <div className={`${styleData['circle']} ${styleData['green']}`}
                style={{ cursor: 'pointer' }}
                title="Activar/Desactivar cliente"
            ></div>
        </div>
    );

    if (!currentClient) {
        return (
            <>
                <Indicators />
                <p>Seleccione un cliente.</p>
            </>
        );
    }

    return (
        <>
            <Indicators />

            <label className={`form-label ${styleData['label']}`}>Nombre:</label>
            <div className="input-group mb-4">
                <input
                    type="text"
                    className={`form-control ${styleData['input']}`}
                    value={`${currentClient.Name.FirstName} ${currentClient.Name.SecondName || ''} ${currentClient.LastName.FatherLastName} ${currentClient.LastName.MotherLastName}`.replace(/\s+/g, ' ').trim()}
                    disabled
                />
            </div>

            <label className={`form-label ${styleData['label']}`}>Teléfono(s):</label>
            {currentClient.PhoneNumber.map((item, index) => (
                <div key={index} className="input-group mb-4">
                    <input type="text" className={`form-control ${styleData['input']}`} value={item} disabled />
                </div>
            ))}

            <label className={`form-label ${styleData['label']}`}>Correo Electrónico:</label>
            <div className="input-group mb-4">
                <input type="text" className={`form-control ${styleData['input']}`} value={currentClient.Email || ''} disabled />
            </div>

            <label className={`form-label ${styleData['label']}`}>Dirección</label>
            <div className="input-group mb-4">
                <span className={`input-group-text ${styleData['item']}`}>Calle:</span>
                <input type="text" className={`form-control ${styleData['input']}`} value={currentClient.Location.Address || ''} disabled />
            </div>

            <div className="d-flex justify-content-between text-wrap">
                <div className="input-group mb-4 me-4">
                    <span className={`input-group-text ${styleData['item']}`}>Numero Exterior:</span>
                    <input type="text" className={`form-control ${styleData['input']}`} value={currentClient.Location.OutNumber || ''} disabled />
                </div>
                <div className="input-group mb-4 ms-4">
                    <span className={`input-group-text ${styleData['item']}`}>Numero Interior:</span>
                    <input type="text" className={`form-control ${styleData['input']}`} value={currentClient.Location.InNumber || ''} disabled />
                </div>
            </div>

            <div className="d-flex justify-content-between text-wrap">
                <div className="input-group mb-4">
                    <span className={`input-group-text ${styleData['item']}`}>Estado:</span>
                    <input type="text" className={`form-control ${styleData['input']}`} value={currentClient.Location.State || ''} disabled />
                </div>
                <div className="input-group mb-4 ms-4">
                    <span className={`input-group-text ${styleData['item']}`}>Código Postal:</span>
                    <input type="text" className={`form-control ${styleData['input']}`} value={currentClient.Location.ZIP || ''} disabled />
                </div>
            </div>

            <div className="d-flex justify-content-between text-wrap mb-4">
                <div className="input-group mb-4">
                    <span className={`input-group-text ${styleData['item']}`}>Municipio:</span>
                    <input type="text" className={`form-control ${styleData['input']}`} value={currentClient.Location.Municipality || ''} disabled />
                </div>
                <div className="input-group mb-4 ms-4">
                    <span className={`input-group-text ${styleData['item']}`}>Colonia:</span>
                    <input type="text" className={`form-control ${styleData['input']}`} value={currentClient.Location.Cologne || ''} disabled />
                </div>
            </div>

            {showEditModal && (
                <EditClientModal
                    client={currentClient}
                    onClose={() => setShowEditModal(false)}
                    onSave={(updatedClient) => {
                        setCurrentClient(updatedClient);
                        setShowEditModal(false);
                        if (onUpdateClient) onUpdateClient(updatedClient);
                        window.location.reload();
                    }}
                />
            )}
        </>
    );
}

export default ClientData;
