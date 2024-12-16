import styleInfo from './css/ticketsInfo.module.css';

function TicketInfo({ ticket }) {

    return (
        <div className="modal fade" id="TicketModal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header justify-content-between">
                        <span className={`modal-title fs-5 ${styleInfo['title']}`}><i className="bi bi-clipboard2-pulse-fill"></i> Ticket Details</span>

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
                    <div className={`modal-body ${styleInfo['body']}`}>

                        <p className="form-label"><strong>Folio:</strong> {ticket.Folio || ''}</p>
                        <br />
                        <p className="form-label"><strong>Cliente:</strong></p>
                        <div className="input-group">
                            <input
                                type="text"
                                className={`form-control ${styleInfo['input']}`}
                                value={ticket?.Client?.Name
                                    ? `${ticket.Client.Name.FirstName || ''} 
                            ${ticket.Client.Name.SecondName || ''} 
                            ${ticket.Client.LastName?.FatherLastName || ''} 
                            ${ticket.Client.LastName?.MotherLastName || ''}`
                                        .replace(/\s+/g, ' ').trim()
                                    : 'Información no disponible'}
                                disabled
                            />
                        </div>
                        <br />

                        <p className="form-label"><strong>Asunto:</strong></p>
                        <div className="d-flex input-group">
                            <input type="text"
                                className={`form-control ${styleInfo['input']}`}
                                disabled
                                value={ticket.Issue || ''} />
                        </div>
                        <br />

                        <p className="form-label"><strong>Descripción:</strong></p>
                        <div className="d-flex input-group">
                            <textarea
                                className={`form-control ${styleInfo['textarea']}`}
                                disabled
                                value={ticket.Description || ''}></textarea>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketInfo