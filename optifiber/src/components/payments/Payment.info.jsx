import styleInfo from './css/paymentInfo.module.css';

function PaymentInfo({ payment }) {

    return (
        <div className="modal fade" id="PaymentModal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header justify-content-between">
                        <span className={styleInfo['title']}><i className="bi bi-cash-coin"></i> Payment Details</span>

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

                        <p><strong>Folio:</strong> {payment.Folio}</p>
                        <p className="form-label"><strong>Cliente</strong></p>
                        <div className="input-group">
                            <input type="text"
                                className={`form-control ${styleInfo['input']}`}
                                value={payment?.Client?.Name
                                    ? `${payment.Client.Name.FirstName || ''} 
                            ${payment.Client.Name.SecondName || ''} 
                            ${payment.Client.LastName?.FatherLastName || ''} 
                            ${payment.Client.LastName?.MotherLastName || ''}`
                                        .replace(/\s+/g, ' ').trim()
                                    : 'Información no disponible'}
                                disabled />
                        </div>
                        <br />

                        <p className="form-label"><strong>Forma de pago</strong></p>
                        <div className="input-group">
                            <input type="text"
                                className={`form-control ${styleInfo['input']}`}
                                disabled
                                value={payment.Method || ''} />
                        </div>
                        <br />

                        <p className="form-label"><strong>Monto:</strong></p>
                        <div className="input-group">
                            <input
                                className={`form-control ${styleInfo['input']}`}
                                disabled
                                value={payment.Amount || ''} />
                        </div>
                        <br />

                        <p className="form-label"><strong>Nota:</strong></p>
                        <div className="input-group">
                            <input
                                className={`form-control ${styleInfo['input']}`}
                                disabled
                                value={payment.Note || ''} />
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentInfo;