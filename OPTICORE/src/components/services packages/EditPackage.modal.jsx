import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './EditPackage.css';

const fiberPackages = [
  { name: "50 Megas", price: 349 },
  { name: "100 Megas", price: 395 },
  { name: "200 Megas", price: 445 },
  { name: "300 Megas", price: 495 },
];
const radioPackages = [
  { name: "10 Megas", price: 295 },
  { name: "15 Megas", price: 360 },
  { name: "20 Megas", price: 395 },
];
const platforms = [
  { name: "HBO Max", price: 50 },
  { name: "Netflix", price: 60 },
  { name: "Disney+", price: 40 },
  { name: "Prime Video", price: 45 },
  { name: "Spotify", price: 30 },
  { name: "Roku", price: 25 },
];

function EditPackageModal({ pkg, isOpen, onClose, onSave }) {
  const [type, setType] = useState(pkg?.connectionType?.includes('Fibra') ? 'fiber' : 'radio');
  const [selectedPackage, setSelectedPackage] = useState(pkg?.type || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState(pkg?.platforms?.map(p => p.name) || []);
  const [price, setPrice] = useState(pkg?.price || 0);
  
  const description = `Paquete de ${selectedPackage || '...'} con ${type === 'fiber' ? 'Fibra Óptica' : 'Radio Frecuencia'}${selectedPlatforms.length > 0 ? `. Plataformas incluidas: ${selectedPlatforms.join(', ')}` : ''}.`;

  useEffect(() => {
    const basePkg = [...fiberPackages, ...radioPackages].find(p => p.name === selectedPackage);
    const basePrice = basePkg ? basePkg.price : 0;
    const platformsPrice = selectedPlatforms.reduce((sum, name) => {
      const p = platforms.find(pl => pl.name === name);
      return sum + (p?.price || 0);
    }, 0);
    setPrice(basePrice + platformsPrice);
  }, [selectedPackage, selectedPlatforms, type]);

  const handlePlatformToggle = (name) => {
    setSelectedPlatforms(prev =>
      prev.includes(name)
        ? prev.filter(p => p !== name)
        : [...prev, name]
    );
  };

  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    if (!selectedPackage || !type) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor selecciona un paquete',
        toast: true,
        position: 'top',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
    setSaving(true);
    try {
      const result = await onSave({
        ...pkg,
        name: `${selectedPackage} - ${type === "fiber" ? "Fibra Óptica" : "Radio Frecuencia"}${selectedPlatforms.length > 0 ? ` + ${selectedPlatforms.join(', ')}` : ''}`,
        type: selectedPackage,
        connectionType: type === "fiber" ? "Fibra Óptica" : "Radio Frecuencia",
        price,
        description: `Paquete de ${selectedPackage} con ${type === "fiber" ? "Fibra Óptica" : "Radio Frecuencia"}${selectedPlatforms.length > 0 ? `. Plataformas incluidas: ${selectedPlatforms.join(', ')}` : ''}.`,
        platforms: selectedPlatforms.map(name => {
          const p = platforms.find(pl => pl.name === name);
          return { name, price: p?.price || 0 };
        })
      });
      if (result === true || result?.success) {
        onClose();
        window.location.reload();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: 'No se pudo actualizar el paquete',
        toast: true,
        position: 'top',
        timer: 2000,
        showConfirmButton: false
      });
    }
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="edit-package-panel">
      <div className="panel-header">
        <h5 className="panel-title">
          <i className="bi bi-box-seam me-2"></i> 
          Editar Paquete
        </h5>
        <button 
          type="button" 
          className="btn-close-panel"
          onClick={onClose}
          aria-label="Cerrar"
          title="Cerrar panel">
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="panel-body">
        {pkg && (
          <div className="package-info-box">
            <div><strong>Folio:</strong> {pkg.folio || 'Sin folio'}</div>
            <div><strong>Cliente:</strong> {pkg.Client ? `${pkg.Client.Name?.FirstName || ''} ${pkg.Client.Name?.SecondName || ''} ${pkg.Client.LastName?.FatherLastName || ''} ${pkg.Client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim() : 'Sin cliente'}</div>
            <div><strong>Nombre Paquete:</strong> {(pkg.type || 'No especificado') + ' - ' + (pkg.connectionType || 'No especificado')}</div>
            <div><strong>Tipo:</strong> {pkg.type || 'No especificado'}</div>
            <div><strong>Costo:</strong> ${pkg.price || 0}</div>
            <div><strong>Plataformas:</strong> {pkg.platforms && pkg.platforms.length > 0 ? pkg.platforms.map(p => p.name || p).join(', ') : 'Ninguna'}</div>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label fw-semibold">Tipo de Conexión</label>
          <div className="d-flex gap-2">
            <button
              className={`btn ${type === 'fiber' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => { setType('fiber'); setSelectedPackage(''); setSelectedPlatforms([]); }}
            >
              <i className="bi bi-ethernet me-1"></i>
              Fibra Óptica
            </button>
            <button
              className={`btn ${type === 'radio' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => { setType('radio'); setSelectedPackage(''); setSelectedPlatforms([]); }}
            >
              <i className="bi bi-broadcast me-1"></i>
              Radio Frecuencia
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Selecciona el Paquete</label>
          <div className="package-grid">
            {(type === 'fiber' ? fiberPackages : radioPackages).map(pkgOpt => (
              <button
                key={pkgOpt.name}
                className={`btn ${selectedPackage === pkgOpt.name ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setSelectedPackage(pkgOpt.name)}
              >
                <div>{pkgOpt.name}</div>
                <small className="text-muted">${pkgOpt.price}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Plataformas adicionales</label>
          <div className="platforms-grid">
            {platforms.map(p => (
              <button
                key={p.name}
                className={`btn btn-sm ${selectedPlatforms.includes(p.name) ? 'btn-info' : 'btn-outline-info'}`}
                onClick={() => handlePlatformToggle(p.name)}
              >
                {p.name} <span className="text-muted">+${p.price}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Precio Total</label>
          <input 
            type="text" 
            className="form-control" 
            value={`$${price}`} 
            readOnly 
            style={{ backgroundColor: '#e9ecef', fontWeight: 'bold', color: '#002b5b' }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Descripción</label>
          <textarea 
            className="form-control" 
            rows="3"
            value={description} 
            readOnly 
            style={{ backgroundColor: '#e9ecef', fontSize: '13px' }}
          />
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-secondary" onClick={onClose}>
            <i className="bi bi-x-circle me-1"></i>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <i className="bi bi-check-circle me-1"></i>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPackageModal;
