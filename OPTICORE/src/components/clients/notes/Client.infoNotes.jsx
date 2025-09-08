function ClientNoteInfo({ note }) {
    return (
        <div className="modal fade" id="NoteModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="ModalLabel">Detalle de Nota</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>

                    <div className="modal-body">
                        <p><strong>Nota:</strong></p>
                        <p>{note?.Description || 'Sin contenido disponible.'}</p>
                        <hr />
                        <p><strong>Fecha:</strong> {note?.CreateDate?.split("T")[0] || 'Sin fecha registrada.'}</p>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ClientNoteInfo;
