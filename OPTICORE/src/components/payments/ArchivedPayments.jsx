import React, { useEffect, useState } from 'react';
import ApiRequest from '../hooks/apiRequest';
import Swal from 'sweetalert2';
import styleCard from './css/paymentCard.module.css';
import styleTable from './css/paymentCard.module.css';

function ArchivedPayments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null); // Estado para errores
  const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
  const res = await makeRequest('/pay/archived');
        setPayments(res || []);
        setError(null); // Limpiar error si carga bien
      } catch (err) {
        console.error('Error al obtener pagos archivados:', err);
        setPayments([]);
        setError('No se pudieron cargar los pagos archivados.');
      }
    };
    fetchPayments();
  }, [makeRequest]);

  const handleUnarchive = async (id) => {
    const payment = payments.find(p => p._id === id);
    const clientName = `${payment.Client?.Name?.FirstName || ''} ${payment.Client?.Name?.SecondName || ''} ${payment.Client?.LastName?.FatherLastName || ''} ${payment.Client?.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim();

    const result = await Swal.fire({
      title: '¿Desarchivar pago?',
      text: `¿Estás seguro de que quieres desarchivar el pago de ${clientName} (Folio: ${payment.Folio})?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, desarchivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (result.isConfirmed) {
      try {
        await makeRequest(`/pay/unarchive/${id}`);
        setPayments(prev => prev.filter(p => p._id !== id));
        await Swal.fire({
          title: '¡Éxito!',
          text: 'El pago ha sido desarchivado correctamente',
          icon: 'success',
          toast: true,
          position: 'top',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error al desarchivar pago:', err);
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo desarchivar el pago',
          icon: 'error',
          toast: true,
          position: 'top',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const formatAmount = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <div className="d-flex justify-content-center align-content-center row">
      <div className={`d-flex justify-content-between align-items-end ${styleCard['header']}`}> 
        <span className={`me-2 ${styleCard['title']}`}>Pagos Archivados</span>
        <span className="text-primary"><i className="bi bi-archive-fill"></i></span>
      </div>
      <table className="table table-hover justify-content-center">
        <thead className={styleCard['head-table']}>
          <tr>
            <th>Folio</th>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Método</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody className={`text-wrap ${styleCard['table-body']}`}>
          {payments.length === 0 ? (
            <tr><td colSpan={7} className="text-center">No hay pagos archivados.</td></tr>
          ) : (
            payments.map(payment => {
              const clientName = `${payment.Client?.Name?.FirstName || ''} ${payment.Client?.Name?.SecondName || ''} ${payment.Client?.LastName?.FatherLastName || ''} ${payment.Client?.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim();
              return (
                <tr key={payment._id} className={styleTable['selected-row']}>
                  <td>{payment.Folio || 'N/A'}</td>
                  <td>{clientName || 'Sin cliente'}</td>
                  <td>{formatAmount(payment.Amount)}</td>
                  <td>{payment.Method || 'N/A'}</td>
                  <td>{formatDate(payment.CreateDate)}</td>
                  <td>
                    <span className={`badge ${
                      payment.Status === 'Exitoso' ? 'bg-success' :
                      payment.Status === 'En proceso' ? 'bg-warning' :
                      payment.Status === 'Pendiente' ? 'bg-secondary' :
                      payment.Status === 'Rechazado' ? 'bg-danger' :
                      payment.Status === 'Vencido' ? 'bg-dark' : 'bg-light'
                    }`}>
                      {payment.Status || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-success btn-sm" onClick={() => handleUnarchive(payment._id)}>
                      <i className="bi bi-arrow-bar-up me-1"></i> Desarchivar
                    </button>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ArchivedPayments;
