function ClientData({ client }) {
    return (
        <>
            <label className="form-label mt-4">Nombre</label>
            <div className="input-group mb-4 border-bottom border-primary">
                <input type="text"
                    className="form-control border-0"
                    value={`${client.Name.FirstName} 
                                        ${client.Name.SecondName || ''} 
                                        ${client.LastName.FatherLastName} 
                                        ${client.LastName.MotherLastName}`
                        .replace(/\s+/g, ' ').trim()}
                    disabled />
            </div>

            <label className="form-label">Teléfono(s)</label>
            {client.PhoneNumber.map((item, index) => (
                <div key={index} className="input-group mb-4 border-bottom border-primary">
                    <input type="text"
                        className="form-control border-0"
                        value={item}
                        disabled />
                </div>
            ))}

            <label className="form-label">Correo Electrónico</label>
            <div className="input-group mb-4 border-bottom border-primary">
                <input type="text"
                    className="form-control border-0"
                    value={client.Email}
                    disabled />
            </div>

            <label className="form-label">Dirección</label>
            <div className="input-group mb-4 border-bottom border-primary">
                <span className="input-group-text border-0 ">Calle</span>
                <input type="text"
                    className="form-control border-0"
                    value={client.Location.Address}
                    disabled />
            </div>
            <div className="d-flex justify-content-between text-wrap">
                <div className="input-group mb-4 me-4 border-bottom border-primary">
                    <span className="input-group-text border-0 ">Numero Exterior</span>
                    <input type="text"
                        className="form-control border-0"
                        value={client.Location.OutNumber}
                        disabled />
                </div>
                <div className="input-group mb-4 ms-4 border-bottom border-primary">
                    <span className="input-group-text border-0">Numero Interior</span>
                    <input type="text"
                        className="form-control border-0"
                        value={client.Location.InNumber || ''}
                        disabled />
                </div>
            </div>
            <div className="d-flex justify-content-between text-wrap">
                <div className="input-group mb-4  border-bottom border-primary">
                    <span className="input-group-text border-0">Estado</span>
                    <input type="text"
                        className="form-control border-0"
                        value={client.Location.State}
                        disabled />
                </div>
                <div className="input-group mb-4 ms-4 border-bottom border-primary">
                    <span className="input-group-text border-0">Código Postal</span>
                    <input type="text"
                        className="form-control border-0"
                        value={client.Location.ZIP}
                        disabled />
                </div>
            </div>
            <div className="d-flex justify-content-between text-wrap mb-4">
                <div className="input-group mb-4  border-bottom border-primary">
                    <span className="input-group-text border-0">Municipio</span>
                    <input type="text"
                        className="form-control border-0"
                        value={client.Location.Municipally}
                        disabled />
                </div>
                <div className="input-group mb-4 ms-4 border-bottom border-primary">
                    <span className="input-group-text border-0">Localidad</span>
                    <input type="text"
                        className="form-control border-0"
                        value={client.Location.Locality || ''}
                        disabled />
                </div>
            </div>
        </>
    );
}

export default ClientData;