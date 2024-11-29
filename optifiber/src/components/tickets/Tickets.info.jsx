import styleInfo from './css/ticketsInfo.module.css';

function TicketInfo({ ticket }) {
    return (
        <div className={`card ms-5 mt-3 ${styleInfo['container-card']}`}>

            <div className={`d-flex justify-content-between align-items-center mt-1 mx-3 ${styleInfo['header']}`}>
                <span className={styleInfo['title']}><i className="bi bi-clipboard2-pulse-fill"></i> Ticket Details</span>

                <div className={styleInfo['tools']}>
                    <div className={styleInfo['circle']}>
                        <span className={`${styleInfo['red']} ${styleInfo['box']}`}></span>
                    </div>
                    <div className={styleInfo['circle']}>
                        <span className={`${styleInfo['yellow']} ${styleInfo['box']}`}></span>
                    </div>
                    <div className={styleInfo['circle']}>
                        <span className={`${styleInfo['green']} ${styleInfo['box']}`}></span>
                    </div>
                </div>
            </div>

            <div className={`card-body ${styleInfo['body']}`}>
                <p className="form-label"><strong>Folio:</strong> {ticket.Folio}</p>
                <br />
                <p className="form-label"><strong>Cliente:</strong></p>
                <div className="input-group">
                    <input type="text"
                        className={styleInfo['input']}
                        value={`${ticket.Client.Name.FirstName} 
                                ${ticket.Client.Name.SecondName || ''} 
                                ${ticket.Client.LastName.FatherLastName} 
                                ${ticket.Client.LastName.MotherLastName}`
                            .replace(/\s+/g, ' ').trim()}
                        disabled />
                    <span />
                </div>
                <br />

                <p className="form-label"><strong>Asunto:</strong></p>
                <div className="d-flex input-group">
                    <input type="text"
                        className={styleInfo['input']}
                        disabled
                        value={ticket.Issue} />
                </div>
                <br />

                <p className="form-label"><strong>Descripción:</strong></p>
                <div className="d-flex input-group">
                    <textarea
                        className={`${styleInfo['textarea']}`}
                        disabled
                        value={ticket.Description}></textarea>
                </div>

            </div>

            <div className="card-footer d-flex justify-content-between">
                <div className="row" style={{ fontSize: "0.7em" }}>
                    <span>Creador: {ticket.Admin.UserName}</span>
                    <span>Dia: {ticket.CreateDate.split("T")[0]}</span>
                </div>

            </div>

        </div>
    );
}

export default TicketInfo