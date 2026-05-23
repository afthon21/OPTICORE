import React from 'react';
import PropTypes from 'prop-types';
import './ActiveClientsModal.css';

function ActiveClientsModal({ clients = [], isOpen, onClose, onSelectClient, onToggleStatus }) {
  if (!isOpen) return null;

  const activeClients = clients.filter(c => c.Archived !== true);

  return (
    <div className="active-clients-panel">
      <div className="modal-header">
        <h5 className="modal-title">
          <i className="bi bi-people-fill me-2"></i>
          Clientes Activos
        </h5>
        <button
          type="button"
          className="btn-close-modal"
          onClick={onClose}
          aria-label="Cerrar"
          title="Cerrar"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="modal-body">
        <div className="clients-count mb-3">
          <span className="badge bg-success">
            {activeClients.length} Cliente{activeClients.length === 1 ? '' : 's'} Activo{activeClients.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th className="text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {activeClients.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center text-muted py-4">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    No hay clientes activos
                  </td>
                </tr>
              ) : (
                activeClients.map(client => {
                  const clientName = `${client.Name?.FirstName || ''} ${client.Name?.SecondName || ''} ${client.LastName?.FatherLastName || ''} ${client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim();

                  return (
                    <tr key={client._id} className="client-row">
                      <td className="client-name-cell">{clientName}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => onToggleStatus(client)}
                          title="Archivar cliente y sus datos relacionados"
                        >
                          Activo
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

ActiveClientsModal.propTypes = {
  clients: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectClient: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired
};

export default ActiveClientsModal;
