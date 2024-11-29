import styleInfo from './css/paymentInfo.module.css';

function PaymentInfo({ payment }) {
    return (
        <div className={`card ms-5 mt-3 ${styleInfo['container-card']}`}>

            <div className={`d-flex justify-content-between align-items-center mt-1 mx-3 ${styleInfo['header']}`}>
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

            <div className={`card-body ${styleInfo['body']}`}>
                <p><strong>Folio:</strong> {payment.Folio}</p>
                <br />
                <p className="form-label"><strong>Cliente</strong></p>
                <div className="input-group">
                    <input type="text"
                        className={styleInfo['input']}
                        value={`${payment.Client.Name.FirstName} 
                            ${payment.Client.Name.SecondName || ''} 
                            ${payment.Client.LastName.FatherLastName} 
                            ${payment.Client.LastName.MotherLastName}`
                            .replace(/\s+/g, ' ').trim()}
                        disabled />
                </div>
                <br />

                <p className="form-label"><strong>Forma de pago</strong></p>
                <div className="input-group">
                    <input type="text"
                        className={styleInfo['input']}
                        disabled
                        value={payment.Method} />
                </div>
                <br />

                <p className="form-label"><strong>Monto:</strong></p>
                <div className="input-group">
                    <input
                        className={styleInfo['input']}
                        disabled
                        value={payment.Amount} />
                </div>

            </div>

            <div className="card-footer d-flex justify-content-between">
                <div className="row" style={{ fontSize: "0.7em" }}>
                    <span>Creador: {payment.Admin.UserName}</span>
                    <span>Dia: {payment.CreateDate.split("T")[0]}</span>
                </div>
            </div>
        </div>
    );
}

export default PaymentInfo;