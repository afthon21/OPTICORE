import React from 'react';
import PropTypes from 'prop-types';
import './ActiveClientPanel.css';

function ActiveClientPanel({ client, isOpen, onClose, onToggleStatus }) {
  if (!isOpen || !client) return null;

  const clientName = `${client.Name?.FirstName || ''} ${client.Name?.SecondName || ''} ${client.LastName?.FatherLastName || ''} ${client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim();
  const isActive = client.Status === 'ACTIVE';

  return (
    <div className="active-client-panel">
      <div className="panel-header">
        <h5 className="panel-title">
          <i className="bi bi-person-circle me-2"></i>
          Información del Cliente
        </h5>
        <button
          type="button"
          className="btn-close-panel"
          onClick={onClose}
          aria-label="Cerrar"
          title="Cerrar panel"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="panel-body">
        <div className="client-header-info">
          <div className="client-status-badge">
            <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
              {isActive ? 'ACTIVO' : 'INACTIVO'}
            </span>
          </div>
          <h6 className="client-name">{clientName}</h6>
        </div>

        <div className="info-section">
          <h6 className="section-title">
            <i className="bi bi-person-vcard me-2"></i>
            Datos Personales
          </h6>
          <div className="info-grid">
            <div className="info-item">
              <label>Primer Nombre</label>
              <input type="text" className="form-control form-control-sm" value={client.Name?.FirstName || 'N/A'} readOnly />
            </div>
            <div className="info-item">
              <label>Segundo Nombre</label>
              <input type="text" className="form-control form-control-sm" value={client.Name?.SecondName || 'N/A'} readOnly />
            </div>
            <div className="info-item">
              <label>Apellido Paterno</label>
              <input type="text" className="form-control form-control-sm" value={client.LastName?.FatherLastName || 'N/A'} readOnly />
            </div>
            <div className="info-item">
              <label>Apellido Materno</label>
              <input type="text" className="form-control form-control-sm" value={client.LastName?.MotherLastName || 'N/A'} readOnly />
            </div>
          </div>
        </div>

        <div className="info-section">
          <h6 className="section-title">
            <i className="bi bi-telephone me-2"></i>
            Contacto
          </h6>
          <div className="info-grid">
            <div className="info-item">
              <label>Teléfono</label>
              <input type="text" className="form-control form-control-sm" value={client.Contact?.PhoneNumber || 'N/A'} readOnly />
            </div>
            <div className="info-item">
              <label>Email</label>
              <input type="text" className="form-control form-control-sm" value={client.Contact?.Email || 'N/A'} readOnly />
            </div>
          </div>
        </div>

        <div className="info-section">
          <h6 className="section-title">
            <i className="bi bi-geo-alt me-2"></i>
            Ubicación
          </h6>
          <div className="info-grid">
            <div className="info-item">
              <label>Estado</label>
              <input type="text" className="form-control form-control-sm" value={client.Location?.State || 'N/A'} readOnly />
            </div>
            <div className="info-item">
              <label>Municipio</label>
              <input type="text" className="form-control form-control-sm" value={client.Location?.City || 'N/A'} readOnly />
            </div>
            <div className="info-item full-width">
              <label>Colonia</label>
              <input type="text" className="form-control form-control-sm" value={client.Location?.Neighborhood || 'N/A'} readOnly />
            </div>
            <div className="info-item full-width">
              <label>Calle</label>
              <input type="text" className="form-control form-control-sm" value={client.Location?.Street || 'N/A'} readOnly />
            </div>
            <div className="info-item">
              <label>Número Exterior</label>
              <input type="text" className="form-control form-control-sm" value={client.Location?.OutdoorNumber || 'N/A'} readOnly />
            </div>
            <div className="info-item">
              <label>Número Interior</label>
              <input type="text" className="form-control form-control-sm" value={client.Location?.InteriorNumber || 'N/A'} readOnly />
            </div>
          </div>
        </div>

        {client.Package && (
          <div className="info-section">
            <h6 className="section-title">
              <i className="bi bi-box-seam me-2"></i>
              Paquete
            </h6>
            <div className="info-grid">
              <div className="info-item full-width">
                <label>Tipo</label>
                <input type="text" className="form-control form-control-sm" value={client.Package.type || 'N/A'} readOnly />
              </div>
              <div className="info-item full-width">
                <label>Conexión</label>
                <input type="text" className="form-control form-control-sm" value={client.Package.connectionType || 'N/A'} readOnly />
              </div>
              <div className="info-item">
                <label>Precio</label>
                <input type="text" className="form-control form-control-sm" value={`$${client.Package.price || 0}`} readOnly style={{ fontWeight: 'bold', color: '#002b5b' }} />
              </div>
            </div>
          </div>
        )}

        <div className="action-section">
          <button
            className={`btn w-100 ${isActive ? 'btn-danger' : 'btn-success'}`}
            onClick={() => onToggleStatus(client)}
          >
            <i className={`bi ${isActive ? 'bi-x-circle' : 'bi-check-circle'} me-2`}></i>
            {isActive ? 'Desactivar Cliente' : 'Activar Cliente'}
          </button>
        </div>
      </div>
    </div>
  );
}

ActiveClientPanel.propTypes = {
  client: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired
};

export default ActiveClientPanel;
