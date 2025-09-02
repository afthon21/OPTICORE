import React, { useState } from 'react';
import styleCard from '../payments/css/paymentCard.module.css';
import styleTable from '../payments/css/paymentTable.module.css';

function PackagesCard({ packages = [], onSelected }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

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

    const filteredData = packages.filter(pkg => {
    const folio = pkg.Folio?.toString() ?? '';
    const clientName = `${pkg.Client?.Name?.FirstName ?? ''} ${pkg.Client?.Name?.SecondName ?? ''} ${pkg.Client?.LastName?.FatherLastName ?? ''} ${pkg.Client?.LastName?.MotherLastName ?? ''}`.trim();
    const packageName = pkg.Name ?? '';
    const type = pkg.Type ?? '';
    const price = pkg.Price?.toString() ?? '';
    const platforms = pkg.Platforms?.map(p => p.name).join(", ") ?? '';
    const combined = `${folio} ${clientName} ${packageName} ${type} ${price} ${platforms}`.toLowerCase();
    return combined.includes(search.toLowerCase());
  });

    const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    let aValue, bValue;
    switch (sortField) {
      case 'Folio':
        aValue = a.Folio ?? '';
        bValue = b.Folio ?? '';
        break;
      case 'Cliente':
        aValue = `${a.Client?.Name?.FirstName ?? ''} ${a.Client?.Name?.SecondName ?? ''} ${a.Client?.LastName?.FatherLastName ?? ''} ${a.Client?.LastName?.MotherLastName ?? ''}`.trim();
        bValue = `${b.Client?.Name?.FirstName ?? ''} ${b.Client?.Name?.SecondName ?? ''} ${b.Client?.LastName?.FatherLastName ?? ''} ${b.Client?.LastName?.MotherLastName ?? ''}`.trim();
        break;
      case 'Nombre del paquete':
        aValue = a.Name ?? '';
        bValue = b.Name ?? '';
        break;
      case 'Tipo':
        aValue = a.Type ?? '';
        bValue = b.Type ?? '';
        break;
      case 'Costo':
        aValue = a.Price ?? 0;
        bValue = b.Price ?? 0;
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
            <th onClick={() => handleHeaderClick('Nombre del paquete')} style={{ cursor: 'pointer' }}>
              Nombre del paquete {sortField === 'Nombre del paquete' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleHeaderClick('Tipo')} style={{ cursor: 'pointer' }}>
              Tipo {sortField === 'Tipo' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleHeaderClick('Costo')} style={{ cursor: 'pointer' }}>
              Costo {sortField === 'Costo' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>
              Plataformas adicionales
            </th>
          </tr>
        </thead>
        <tbody className={`text-wrap ${styleCard['table-body']}`}>
          {sortedData.length > 0 ? (
            sortedData.map(pkg => (
              <tr className={styleTable['selected-row']}
                key={pkg._id} onClick={() => onSelected?.(pkg)}>
                <td>{pkg.Folio}</td>
                <td>{`${pkg.Client?.Name?.FirstName ?? ''} ${pkg.Client?.Name?.SecondName ?? ''} ${pkg.Client?.LastName?.FatherLastName ?? ''} ${pkg.Client?.LastName?.MotherLastName ?? ''}`}</td>
                <td>{pkg.Name}</td>
                <td>{pkg.Type}</td>
                <td>{pkg.Price}</td>
                <td>{pkg.Platforms && pkg.Platforms.length > 0
                  ? pkg.Platforms.map(p => p.name).join(", ")
                  : "Sin plataformas"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay paquetes registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PackagesCard;