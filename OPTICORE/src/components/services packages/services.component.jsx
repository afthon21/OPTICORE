import React, { useState } from 'react';
import EditPackageModal from './EditPackage.modal.jsx';
import styleCard from '../payments/css/paymentCard.module.css';
import styleTable from '../payments/css/paymentTable.module.css';
import { useRegion } from '../../hooks/RegionContext';
import ApiRequest from '../hooks/apiRequest.jsx';

function PackagesCard({ packages = [], setPackages, onSelected }) {
  // Usar el hook correctamente
  const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

  // Actualizar paquete en la API y en el estado local
  const handleSavePackage = async (updatedPkg) => {
    if (!updatedPkg || !updatedPkg._id) return false;
    // Solo enviar los campos relevantes
    const body = {
      type: updatedPkg.type,
      connectionType: updatedPkg.connectionType,
      platforms: updatedPkg.platforms,
      price: updatedPkg.price,
      description: updatedPkg.description
    };
    const res = await makeRequest(`/packages/edit/${updatedPkg._id}`, 'PUT', body);
    if (res && res.updatedPackage && setPackages) {
      setPackages(prev => prev.map(p => p._id === updatedPkg._id ? res.updatedPackage : p));
      handleCloseModal();
      // Llamar a la función global para refrescar cliente y paquetes
      if (onGlobalUpdate) onGlobalUpdate(updatedPkg.Client);
      return true;
    }
    return false;
  };
  const { region } = useRegion();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const handleEditClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedPackage(null);
  };

  const handleInputSearch = (e) => {
    setSearch(e.target.value);
  };

    const handleHeaderClick = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

    // Filtrar paquetes por región si está definida
    const packagesByRegion = packages.filter(pkg => {
        // Excluir paquetes de clientes archivados
        if (pkg.Client?.Archived) return false;
        // Excluir paquetes archivados
        if (pkg.Archived) return false;
        
        if (!region) return true;
        
        // Si el paquete tiene cliente y el cliente tiene ubicación
        if (pkg.Client && pkg.Client.Location && pkg.Client.Location.State) {
            return pkg.Client.Location.State === region;
        }
        
        return true; // Si no hay información de ubicación, mostrar el paquete
    });

    const filteredData = packagesByRegion.filter(pkg => {
    const folio = pkg.folio ?? '';
    const packageName = (pkg.type || '') + ' - ' + (pkg.connectionType || '');
    const type = pkg.type ?? '';
    const connectionType = pkg.connectionType ?? '';
    const price = pkg.price?.toString() ?? '';
    const platforms = pkg.platforms?.map(p => p.name || p).join(' ') ?? '';
    const clientName = pkg.Client ? `${pkg.Client.Name?.FirstName || ''} ${pkg.Client.Name?.SecondName || ''} ${pkg.Client.LastName?.FatherLastName || ''} ${pkg.Client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim() : '';
    const combined = `${folio} ${packageName} ${type} ${connectionType} ${price} ${platforms} ${clientName}`.toLowerCase();
    return combined.includes(search.toLowerCase());
  });

    const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    let aValue, bValue;
    switch (sortField) {
      case 'Folio':
        aValue = a.folio ?? '';
        bValue = b.folio ?? '';
        break;
      case 'Cliente':
        aValue = a.Client ? `${a.Client.Name?.FirstName || ''} ${a.Client.Name?.SecondName || ''} ${a.Client.LastName?.FatherLastName || ''} ${a.Client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim() : '';
        bValue = b.Client ? `${b.Client.Name?.FirstName || ''} ${b.Client.Name?.SecondName || ''} ${b.Client.LastName?.FatherLastName || ''} ${b.Client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim() : '';
        break;
      case 'Nombre':
        aValue = (a.type || '') + ' - ' + (a.connectionType || '');
        bValue = (b.type || '') + ' - ' + (b.connectionType || '');
        break;
      case 'Tipo':
        aValue = a.type ?? '';
        bValue = b.type ?? '';
        break;
      case 'Precio':
        aValue = a.price ?? 0;
        bValue = b.price ?? 0;
        break;
      case 'Plataformas':
        aValue = a.platforms?.map(p => p.name).join(', ') ?? '';
        bValue = b.platforms?.map(p => p.name).join(', ') ?? '';
        break;
      default:
        aValue = '';
        bValue = '';
    }
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

    return (
    <div className="d-flex justify-content-center align-content-center row">
      <div className={`d-flex justify-content-between align-items-end ${styleCard['header']}`}>
        <span className={`me-2 ${styleCard['title']}`}>Paquetes</span>
        <div className={styleCard['group']}>
          <input required type="text"
            className={styleCard['input']}
            value={search}
            onChange={handleInputSearch} />
          <span className={styleCard['highlight']} />
          <span className={styleCard['bar']} />
          <label className={styleCard['place-holder']}>
            <i className="bi bi-search me-1"></i>
            Buscar
          </label>
        </div>
              </div>

      <table className="table table-hover justify-content-center">
        <thead className={styleCard['head-table']}>
          <tr>
            <th onClick={() => handleHeaderClick('Folio')} style={{ cursor: 'pointer' }}>
              Folio {sortField === 'Folio' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleHeaderClick('Cliente')} style={{ cursor: 'pointer' }}>
              Cliente {sortField === 'Cliente' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleHeaderClick('Nombre')} style={{ cursor: 'pointer' }}>
              Nombre Paquete {sortField === 'Nombre' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleHeaderClick('Tipo')} style={{ cursor: 'pointer' }}>
              Tipo {sortField === 'Tipo' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleHeaderClick('Precio')} style={{ cursor: 'pointer' }}>
              Costo {sortField === 'Precio' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleHeaderClick('Plataformas')} style={{ cursor: 'pointer' }}>
              Plataformas Adicionales {sortField === 'Plataformas' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
              <th>Acciones</th>
          </tr>
        </thead>
        <tbody className={`text-wrap ${styleCard['table-body']}`}>
          {sortedData.length > 0 ? (
            sortedData.map(pkg => (
              <tr className={styleTable['selected-row']}
                key={pkg._id}>
                <td>{pkg.folio || 'Sin folio'}</td>
                <td>
                  {pkg.Client ? 
                    `${pkg.Client.Name?.FirstName || ''} ${pkg.Client.Name?.SecondName || ''} ${pkg.Client.LastName?.FatherLastName || ''} ${pkg.Client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim()
                    : 'Sin cliente'
                  }
                </td>
                <td>{(pkg.type || 'No especificado') + ' - ' + (pkg.connectionType || 'No especificado')}</td>
                <td>{pkg.type || 'No especificado'}</td>
                <td>${pkg.price}</td>
                <td>
                  {pkg.platforms && pkg.platforms.length > 0 
                    ? pkg.platforms.map(p => p.name || p).join(', ')
                    : 'Ninguna'
                  }
                </td>
                  <td>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handleEditClick(pkg)}>Editar</button>
                  </td>
              </tr>
            ))
          ) : (
            <tr>
                <td colSpan="7">No hay paquetes registrados</td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Panel lateral de edición de paquete */}
      <EditPackageModal 
        pkg={selectedPackage} 
        isOpen={showEditModal}
        onClose={handleCloseModal} 
        onSave={handleSavePackage} 
      />
    </div>
  );
}

export default PackagesCard;