import styleTools from './css/ticketsInfo.module.css';
import styleInputs from './css/ticketsInfo.module.css'

function TicketInfo({ ticket }) {
    return (
        <div className="card ms-3 border-0" style={{ width: '35rem' }}>
            <div className="card-body border-0">
                
                <div className="card-header d-flex justify-content-between">
                    <div className={styleTools.tools}>
                        <div className={styleTools.circle}>
                            <span className={`${styleTools.red} ${styleTools.box}`}></span>
                        </div>
                        <div className={styleTools.circle}>
                            <span className={`${styleTools.yellow} ${styleTools.box}`}></span>
                        </div>
                        <div className={styleTools.circle}>
                            <span className={`${styleTools.green} ${styleTools.box}`}></span>
                        </div>
                    </div>

                    <span><i className="bi bi-clipboard2-pulse-fill"></i> Ticket Details</span>
                </div>

                <div className="card-body border-0">
                    <p><strong>Folio:</strong> {ticket.Folio}</p>
                    <label className="form-label"><strong>Cliente:</strong></label>
                    <div className="d-flex input-group border-bottom border-primary">
                        <input type="text"
                            className={styleInputs.input}
                            value={`${ticket.Client.Name.FirstName} 
                                ${ticket.Client.Name.SecondName || ''} 
                                ${ticket.Client.LastName.FatherLastName} 
                                ${ticket.Client.LastName.MotherLastName}`
                                .replace(/\s+/g, ' ').trim()}
                            disabled />
                        <span />
                    </div>
                    <br />

                    <label className="form-label"><strong>Asunto:</strong></label>
                    <div className="d-flex input-group border-bottom border-primary">
                        <input type="text"
                            className={styleInputs.input}
                            disabled
                            value={ticket.Issue} />
                    </div>
                    <br />

                    <label className="form-label"><strong>Descripción:</strong></label>
                    <div className="d-flex input-group border-bottom border-primary">
                        <textarea
                            className={`${styleInputs.input} ${styleInputs.textarea}`}
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
        </div>
    );
}

export default TicketInfo