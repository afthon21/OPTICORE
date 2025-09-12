import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.2)',
    zIndex: 1050,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.3s',
  },
  modal: {
    background: '#fff',
    borderRadius: '8px',
    padding: '2rem',
    position: 'relative',
    minWidth: '350px',
    maxWidth: '95vw',
    maxHeight: '95vh',
    overflowY: 'auto',
    zIndex: 1060,
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    transition: 'transform 0.3s, opacity 0.3s',
  },
  dotsContainer: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'flex',
    gap: '8px',
    zIndex: 2,
  },
  dotRed: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#ff5f56',
    display: 'inline-block',
  },
  dotYellow: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#ffbd2e',
    display: 'inline-block',
  },
  dotGreen: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#27c93f',
    display: 'inline-block',
  },
};

function EditClientModal({ client, onClose, onSave }) {
  const [form, setForm] = useState({
    Name: {
      FirstName: client?.Name?.FirstName || '',
      SecondName: client?.Name?.SecondName || ''
    },
    LastName: {
      FatherLastName: client?.LastName?.FatherLastName || '',
      MotherLastName: client?.LastName?.MotherLastName || ''
    },
    PhoneNumber: client?.PhoneNumber ? client.PhoneNumber.map(String) : [''],
    Email: client?.Email || '',
    Location: {
      State: client?.Location?.State || '',
      Municipality: client?.Location?.Municipality || '',
      ZIP: client?.Location?.ZIP || '',
      Address: client?.Location?.Address || '',
      Cologne: client?.Location?.Cologne || '',
      Locality: client?.Location?.Locality || '',
      OutNumber: client?.Location?.OutNumber || '',
      InNumber: client?.Location?.InNumber || '',
      Latitude: client?.Location?.Latitude || '',
      Length: client?.Location?.Length || ''
    }
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Cambia campos anidados
  const handleChange = (path, value) => {
    setForm(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = obj[keys[i]] || {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // Cambia un teléfono específico
  const handlePhoneChange = (idx, value) => {
    setForm(prev => {
      const phones = [...prev.PhoneNumber];
      phones[idx] = value;
      return { ...prev, PhoneNumber: phones };
    });
  };

  // Agrega un campo de teléfono
  const addPhone = () => {
    setForm(prev => ({
      ...prev,
      PhoneNumber: [...prev.PhoneNumber, '']
    }));
  };

  // Elimina un campo de teléfono
  const removePhone = (idx) => {
    setForm(prev => ({
      ...prev,
      PhoneNumber: prev.PhoneNumber.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación. Inicia sesión de nuevo.');
      }

      // Convierte los teléfonos a números si es posible
      const phoneNumbers = form.PhoneNumber.map(num => {
        const parsed = Number(num);
        return isNaN(parsed) ? num : parsed;
      });

      // Convierte OutNumber e InNumber a número si es posible
      const outNumber = isNaN(Number(form.Location.OutNumber)) ? form.Location.OutNumber : Number(form.Location.OutNumber);
      const inNumber = isNaN(Number(form.Location.InNumber)) ? form.Location.InNumber : Number(form.Location.InNumber);

      // Body plano para el backend
      const body = {
        FirstName: form.Name.FirstName,
        SecondName: form.Name.SecondName,
        FatherLastName: form.LastName.FatherLastName,
        MotherLastName: form.LastName.MotherLastName,
        PhoneNumber: phoneNumbers,
        Email: form.Email,
        State: form.Location.State,
        Municipality: form.Location.Municipality,
        ZIP: form.Location.ZIP,
        Address: form.Location.Address,
        Cologne: form.Location.Cologne,
        Locality: form.Location.Locality,
        OutNumber: outNumber,
        InNumber: inNumber,
        Latitude: form.Location.Latitude,
        Length: form.Location.Length
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/client/edit/${client._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el cliente');
      }

      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado correctamente',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top',
        background: '#e5e8e8',
        timerProgressBar: true,
      });

      onSave(data);
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        background: '#e5e8e8',
        timerProgressBar: true,
      });
    }
  };

  return (
    <div
      style={{
        ...styles.backdrop,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none'
      }}
    >
      <div
        style={{
          ...styles.modal,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-40px)'
        }}
      >
        {/* Tres puntos de colores */}
        <div style={styles.dotsContainer}>
          <span style={styles.dotRed}></span>

          <span style={styles.dotYellow}></span>
          
          <span style={styles.dotGreen}></span>
        </div>
        <h3>Editar Cliente</h3>

        <label>Nombre:</label>
        <input
          type="text"
          value={form.Name.FirstName}
          onChange={e => handleChange('Name.FirstName', e.target.value)}
          className="form-control mb-2"
        />

        <label>Segundo Nombre:</label>
        <input
          type="text"
          value={form.Name.SecondName}
          onChange={e => handleChange('Name.SecondName', e.target.value)}
          className="form-control mb-2"
        />

        <label>Apellido Paterno:</label>
        <input
          type="text"
          value={form.LastName.FatherLastName}
          onChange={e => handleChange('LastName.FatherLastName', e.target.value)}
          className="form-control mb-2"
        />

        <label>Apellido Materno:</label>
        <input
          type="text"
          value={form.LastName.MotherLastName}
          onChange={e => handleChange('LastName.MotherLastName', e.target.value)}
          className="form-control mb-2"
        />

        <label>Correo Electrónico:</label>
        <input
          type="email"
          value={form.Email}
          onChange={e => setForm({ ...form, Email: e.target.value })}
          className="form-control mb-2"
        />

        <label>Teléfonos:</label>
        {form.PhoneNumber.map((num, idx) => (
          <div key={idx} className="input-group mb-2">
            <input
              type="text"
              value={num}
              onChange={e => handlePhoneChange(idx, e.target.value)}
              className="form-control"
            />
            {form.PhoneNumber.length > 1 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removePhone(idx)}
              >-</button>
            )}
            {idx === form.PhoneNumber.length - 1 && (
              <button
                type="button"
                className="btn btn-success"
                onClick={addPhone}
              >+</button>
            )}
          </div>
        ))}

        <label>Calle:</label>
        <input
          type="text"
          value={form.Location.Address}
          onChange={e => handleChange('Location.Address', e.target.value)}
          className="form-control mb-2"
        />

        <label>Número Exterior:</label>
        <input
          type="text"
          value={form.Location.OutNumber}
          onChange={e => handleChange('Location.OutNumber', e.target.value)}
          className="form-control mb-2"
        />

        <label>Número Interior:</label>
        <input
          type="text"
          value={form.Location.InNumber}
          onChange={e => handleChange('Location.InNumber', e.target.value)}
          className="form-control mb-2"
        />

        <label>Estado:</label>
        <input
          type="text"
          value={form.Location.State}
          onChange={e => handleChange('Location.State', e.target.value)}
          className="form-control mb-2"
        />

        <label>Código Postal:</label>
        <input
          type="text"
          value={form.Location.ZIP}
          onChange={e => handleChange('Location.ZIP', e.target.value)}
          className="form-control mb-2"
        />

        <label>Colonia:</label>
        <input
          type="text"
          value={form.Location.Cologne}
          onChange={e => handleChange('Location.Cologne', e.target.value)}
          className="form-control mb-2"
        />

        <label>Municipio:</label>
        <input
          type="text"
          value={form.Location.Municipality}
          onChange={e => handleChange('Location.Municipality', e.target.value)}
          className="form-control mb-2"
        />

        <label>Localidad:</label>
        <input
          type="text"
          value={form.Location.Locality}
          onChange={e => handleChange('Location.Locality', e.target.value)}
          className="form-control mb-2"
        />

        <label>Latitud:</label>
        <input
          type="number"
          value={form.Location.Latitude}
          onChange={e => handleChange('Location.Latitude', e.target.value)}
          className="form-control mb-2"
        />

        <label>Longitud:</label>
        <input
          type="number"
          value={form.Location.Length}
          onChange={e => handleChange('Location.Length', e.target.value)}
          className="form-control mb-4"
        />

        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={handleClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default EditClientModal;