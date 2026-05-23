import React, { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest';
import Swal from 'sweetalert2';
import styleCard from '../payments/css/paymentCard.module.css';
import styleTable from '../payments/css/paymentCard.module.css';

function ArchivedPackages() {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState('');
  const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Usar el endpoint con el query parameter para obtener solo archivados
        const res = await makeRequest('/packages/all?archived=true');
        console.log('Paquetes archivados obtenidos:', res);
        setPackages(res || []);
      } catch (error) {
        console.error('Error al obtener paquetes archivados:', error);
        setPackages([]);
      }
    };
    fetchPackages();
  }, [makeRequest]);

  const handleUnarchive = async (id) => {
    const pkg = packages.find(p => p._id === id);
    const packageName = `${pkg.type || ''} - ${pkg.connectionType || ''}`;
    
    const result = await Swal.fire({
      title: '¿Desarchivar paquete?',
      text: `¿Estás seguro de que quieres desarchivar el paquete ${packageName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, desarchivar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await makeRequest(`/packages/unarchive/${id}`, 'POST');
        setPackages(prev => prev.filter(p => p._id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Paquete desarchivado',
          text: 'El paquete ha sido desarchivado correctamente',
          timer: 2000,
          toast: true,
          position: 'top',
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error al desarchivar paquete:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo desarchivar el paquete',
          timer: 2000,
          toast: true,
          position: 'top',
          showConfirmButton: false
        });
      }
    }
  };

  const handleInputSearch = (e) => setSearch(e.target.value);

  const filteredPackages = packages.filter(pkg => {
    const packageName = `${pkg.type || ''} - ${pkg.connectionType || ''}`;
    const clientName = pkg.Client ? `${pkg.Client.Name?.FirstName || ''} ${pkg.Client.Name?.SecondName || ''} ${pkg.Client.LastName?.FatherLastName || ''} ${pkg.Client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim() : 'Sin cliente';
    const combined = `${packageName} ${clientName}`.toLowerCase();
    return combined.includes(search.toLowerCase());
  });

  return (
    <div className="container-fluid mt-4">
      {/* Encabezado y buscador */}
      <div className={`d-flex justify-content-between align-items-end flex-wrap mb-3 ${styleCard['header']}`}>
        <span className={`fs-4 fw-semibold ${styleCard['title']}`}>Paquetes Archivados</span>
        <div style={{ maxWidth: '250px' }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar paquete..."
            value={search}
            onChange={handleInputSearch}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-hover align-middle text-center shadow-sm border rounded-3 w-100">
          <thead className={styleCard['head-table']}>
            <tr>
              <th>Tipo</th>
              <th>Conexión</th>
              <th>Cliente</th>
              <th>Precio</th>
              <th>Plataformas</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody className={`text-wrap ${styleCard['table-body']}`}>
            {filteredPackages.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-3">
                  No hay paquetes archivados.
                </td>
              </tr>
            ) : (
              filteredPackages.map(pkg => {
                const clientName = pkg.Client 
                  ? `${pkg.Client.Name?.FirstName || ''} ${pkg.Client.Name?.SecondName || ''} ${pkg.Client.LastName?.FatherLastName || ''} ${pkg.Client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim()
                  : 'Sin cliente';

                return (
                  <tr key={pkg._id}>
                    <td>{pkg.type || 'N/A'}</td>
                    <td>{pkg.connectionType || 'N/A'}</td>
                    <td>{clientName}</td>
                    <td>${pkg.price || '0'}</td>
                    <td>
                      {pkg.platforms && pkg.platforms.length > 0
                        ? pkg.platforms.map(p => p.name || p).join(', ')
                        : 'N/A'}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleUnarchive(pkg._id)}
                        title="Desarchivar paquete"
                      >
                        <i className="bi bi-arrow-counterclockwise"></i> Restaurar
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
  );
}

export default ArchivedPackages;
