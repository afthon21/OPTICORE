
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

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
  // La descripción se genera automáticamente
  const description = `Paquete de ${selectedPackage || '...'} con ${type === 'fiber' ? 'Fibra Óptica' : 'Radio Frecuencia'}${selectedPlatforms.length > 0 ? `. Plataformas incluidas: ${selectedPlatforms.join(', ')}` : ''}.`;

  useEffect(() => {
    // Actualiza el precio automáticamente al cambiar selección
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
      // Validación simple, sin mensaje de confirmación
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
      // Error al guardar, sin mensaje
    }
    setSaving(false);
  };

  // El modal solo se renderiza cuando se abre, así que no es necesario isOpen

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 9999 }}>
      <div className="modal-content" style={{ position: 'relative', background: '#fff', borderRadius: 12, padding: 32, maxWidth: 500, margin: '80px auto', boxShadow: '0 4px 24px #0002', maxHeight: '80vh', overflowY: 'auto' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            fontSize: 24,
            color: '#888',
            cursor: 'pointer',
            zIndex: 10
          }}
          title="Cerrar"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 style={{ marginBottom: 18 }}>Editar Paquete</h4>

        {/* Información actual del paquete seleccionado */}
        {pkg && (
          <div style={{ background: '#f6f6f6', borderRadius: 8, padding: '12px 18px', marginBottom: 18, fontSize: 15 }}>
            <div><strong>Folio:</strong> {pkg.folio || 'Sin folio'}</div>
            <div><strong>Cliente:</strong> {pkg.Client ? `${pkg.Client.Name?.FirstName || ''} ${pkg.Client.Name?.SecondName || ''} ${pkg.Client.LastName?.FatherLastName || ''} ${pkg.Client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim() : 'Sin cliente'}</div>
            <div><strong>Nombre Paquete:</strong> {(pkg.type || 'No especificado') + ' - ' + (pkg.connectionType || 'No especificado')}</div>
            <div><strong>Tipo:</strong> {pkg.type || 'No especificado'}</div>
            <div><strong>Costo:</strong> ${pkg.price || 0}</div>
            <div><strong>Plataformas:</strong> {pkg.platforms && pkg.platforms.length > 0 ? pkg.platforms.map(p => p.name || p).join(', ') : 'Ninguna'}</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <button
            className={`btn ${type === 'fiber' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => { setType('fiber'); setSelectedPackage(''); setSelectedPlatforms([]); }}
          >Fibra Óptica</button>
          <button
            className={`btn ${type === 'radio' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => { setType('radio'); setSelectedPackage(''); setSelectedPlatforms([]); }}
          >Radio Frecuencia</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 24 }}>
          {(type === 'fiber' ? fiberPackages : radioPackages).map(pkgOpt => (
            <button
              key={pkgOpt.name}
              className={`btn ${selectedPackage === pkgOpt.name ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setSelectedPackage(pkgOpt.name)}
            >{pkgOpt.name} <span style={{ fontWeight: 400 }}>${pkgOpt.price}</span></button>
          ))}
        </div>
        <div style={{ marginBottom: 24 }}>
          <h5 style={{ fontWeight: 600 }}>Plataformas adicionales</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {platforms.map(p => (
              <button
                key={p.name}
                className={`btn ${selectedPlatforms.includes(p.name) ? 'btn-info' : 'btn-outline-info'}`}
                onClick={() => handlePlatformToggle(p.name)}
                style={{ minWidth: 120 }}
              >{p.name} <span style={{ fontWeight: 400 }}>+${p.price}</span></button>
            ))}
          </div>
        </div>
        <div className="mb-2">
          <label>Precio total</label>
          <input type="number" className="form-control" value={price} readOnly />
        </div>
        <div className="mb-2">
          <label>Descripción</label>
          <textarea className="form-control" value={description} readOnly />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPackageModal;
