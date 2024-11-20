import styleTools from './css/paymentInfo.module.css';
import styleInputs from './css/paymentInfo.module.css';

function PaymentInfo({ payment }) {
    return (
        <div className="card ms-3 border-0" style={{ width: '35rem' }}>

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
                <span><i className="bi bi-cash-coin"></i> Payment Details</span>
            </div>

            <div className="card-body border-0">
                <p><strong>Folio:</strong> {payment.Folio}</p>
                <label className="form-label">Cliente</label>
                <div className="d-flex input-group border-bottom border-primary">
                    <input type="text"
                        className={styleInputs.input}
                        value={`${payment.Client.Name.FirstName} 
                            ${payment.Client.Name.SecondName || ''} 
                            ${payment.Client.LastName.FatherLastName} 
                            ${payment.Client.LastName.MotherLastName}`
                            .replace(/\s+/g, ' ').trim()}
                        disabled />
                </div>
                <br />

                <label className="form-label">Forma de pago</label>
                <div className="d-flex input-group border-bottom border-primary">
                    <input type="text"
                        className={styleInputs.input}
                        disabled
                        value={payment.Method} />
                </div>
                <br />

                <label className="form-label">Monto</label>
                <div className="d-flex input-group border-bottom border-primary">
                    <textarea
                        className={styleInputs.input}
                        disabled
                        value={payment.Amount}></textarea>
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