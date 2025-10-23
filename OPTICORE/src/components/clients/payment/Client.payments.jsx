import stylePayment from '../css/clientPayments.module.css'

import { useEffect, useState, useCallback } from "react";
import PropTypes from 'prop-types';
import ApiRequest from '../../hooks/apiRequest.jsx';

import { LoadFragment } from '../../fragments/Load.fragment.jsx';
import CreatePay from './CreatePay.modal.jsx';
import InfoPay from './Client.infoPay.jsx';

function ClientPayments({ client }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);
    const [sortColumn, setSortColumn] = useState(null); // 'Folio', 'Method', 'CreateDate'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [clientPackage, setClientPackage] = useState(null);
    const [showAbonosModal, setShowAbonosModal] = useState(false);
    const [modalMaxHeight, setModalMaxHeight] = useState(null); // Altura dinámica para el modal
    const [mouseY, setMouseY] = useState(null); // Posición Y del mouse

    // Captura la posición Y del mouse al abrir el modal
    const handleOpenAbonosModal = (e) => {
        if (e && e.clientY) {
            setMouseY(e.clientY);
            setModalMaxHeight(e.clientY);
        } else {
            setMouseY(window.innerHeight * 0.8);
            setModalMaxHeight(window.innerHeight * 0.8);
        }
        setShowAbonosModal(true);
    };

    // Función para actualizar la lista de pagos después de agregar uno nuevo
    const handlePaymentAdded = useCallback((newPayment) => {
        setData(prevData => [...prevData, newPayment]);
    }, []);

    const fetchData = useCallback(async () => {
        if (!client) return; // No hacer fetch si no hay cliente
        try {
            const res = await makeRequest(`/pay/all/${client}`);
            setData(res);
        } catch (error) {
            console.log(error);
        }
    }, [client, makeRequest]);

    // Función para obtener el paquete del cliente
    const fetchClientPackage = useCallback(async () => {
        if (!client) return;
        try {
            const res = await makeRequest(`/packages/client/${client}`);
            // Si el cliente tiene múltiples paquetes, tomamos el primero activo
            setClientPackage(Array.isArray(res) ? res[0] : res);
        } catch (error) {
            console.log('Error fetching client package:', error);
            setClientPackage(null);
        }
    }, [client, makeRequest]);

    useEffect(() => {
        fetchData();
        fetchClientPackage();
    }, [fetchData, fetchClientPackage]);
    
    // Mostrar mensaje si no hay cliente seleccionado
    if (!client) {
        return (
            <div className="alert alert-info" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                Seleccione un cliente para ver sus pagos.
            </div>
        );
    }

    // Mostrar mensaje si el cliente no tiene paquete asignado
    if (!loading && !clientPackage) {
        return (
            <div className="alert alert-warning" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Este cliente no tiene un paquete asignado. 
                <br />
                <small className="text-muted">Asigne un paquete al cliente para poder calcular el monto pendiente.</small>
            </div>
        );
    }
    
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const getSortedData = () => {
        const sorted = [...data];
        
        // Si no hay columna seleccionada, ordenar por fecha (más antiguos primero) para calcular abono acumulado
        if (!sortColumn) {
            sorted.sort((a, b) => new Date(a.CreateDate) - new Date(b.CreateDate));
            return sorted;
        }

        sorted.sort((a, b) => {
            let valA = a[sortColumn];
            let valB = b[sortColumn];

            // For dates
            if (sortColumn === 'CreateDate') {
                valA = new Date(valA);
                valB = new Date(valB);
            }

            // For strings: Method
            if (typeof valA === 'string') {
                return sortOrder === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            // For numbers: Folio
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        });

        return sorted;
    };

    const sortedData = getSortedData();

    if (loading) return <LoadFragment />
    if (error) return <p>Error!</p>

    const renderArrow = (column) => {
        if (sortColumn !== column) return null;
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <>
            <div className="justify-content-end d-flex">
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#CreatePayModal"
                    className={`${stylePayment['btn']}`}>
                    <i className="bi bi-plus-square-fill"></i>
                </button>

                <CreatePay client={client ? client : ''} onPaymentCreated={fetchData} onPaymentAdded={handlePaymentAdded} onSuccess={() => {
                    // Refrescar datos después de crear un pago exitoso
                    fetchData();
                    fetchClientPackage();
                }} />
            </div>

            {/* Resumen de abonos acumulados */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <div style={{background: '#fff', border: '2px solid #17a2b8', borderRadius: '10px', padding: '18px', minHeight: '170px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                            <i className="bi bi-credit-card" style={{color: '#17a2b8', fontSize: '1.5rem', marginRight: '8px'}}></i>
                            <span style={{color: '#17a2b8', fontWeight: 'bold', fontSize: '1.1rem'}}>Costo del Paquete</span>
                        </div>
                        <div style={{color: '#17a2b8', fontSize: '2rem', fontWeight: 'bold'}}>
                            ${clientPackage?.price ? Number(clientPackage.price).toLocaleString() : '0'}
                        </div>
                        {clientPackage && (
                            <div style={{color: '#888', fontSize: '0.95rem', marginTop: '8px'}}>{clientPackage.name}</div>
                        )}
                    </div>
                </div>
                <div className="col-md-4">
                    <div style={{background: '#fff', border: '2px solid #28a745', borderRadius: '10px', padding: '18px', minHeight: '170px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer'}} onClick={() => setShowAbonosModal(true)}>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                            <i className="bi bi-folder" style={{color: '#28a745', fontSize: '1.5rem', marginRight: '8px'}}></i>
                            <span style={{color: '#28a745', fontWeight: 'bold', fontSize: '1.1rem'}}>Total Abonos</span>
                        </div>
                        <div style={{color: '#28a745', fontSize: '2rem', fontWeight: 'bold'}}>
                            ${data.reduce((total, payment) => total + (Number(payment.Abono) || 0), 0).toLocaleString()}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div style={{background: '#fff', border: '2px solid #ffc107', borderRadius: '10px', padding: '18px', minHeight: '170px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                            <i className="bi bi-clock-history" style={{color: '#ffc107', fontSize: '1.5rem', marginRight: '8px'}}></i>
                            <span style={{color: '#ffc107', fontWeight: 'bold', fontSize: '1.1rem'}}>Monto Pendiente</span>
                        </div>
                        <div style={{color: '#ffc107', fontSize: '2rem', fontWeight: 'bold'}}>
                            ${(() => {
                                const totalPackage = clientPackage?.price ? Number(clientPackage.price) : 0;
                                const totalAbonos = data.reduce((total, payment) => total + (Number(payment.Abono) || 0), 0);
                                const pendiente = totalPackage - totalAbonos;
                                return pendiente >= 0 ? pendiente.toLocaleString() : '0';
                            })()}
                        </div>
                        {(() => {
                            const totalPackage = clientPackage?.price ? Number(clientPackage.price) : 0;
                            const totalAbonos = data.reduce((total, payment) => total + (Number(payment.Abono) || 0), 0);
                            const pendiente = totalPackage - totalAbonos;
                            return pendiente <= 0 && totalPackage > 0 ? (
                                <div style={{color: '#28a745', fontSize: '1rem', marginTop: '8px'}}>
                                    <i className="bi bi-check-circle me-1"></i>
                                    Completamente pagado
                                </div>
                            ) : null;
                        })()}
                    </div>
                </div>
            </div>

            <InfoPay payment={select ? select : ''} />

            {/* Modal Bootstrap estándar, sin estilos personalizados */}
            {showAbonosModal && (
                <div onClick={() => setShowAbonosModal(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.12)', padding: '32px', minWidth: '420px', maxWidth: '90vw', position: 'relative' }}>
                        <button onClick={() => setShowAbonosModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Cerrar">&times;</button>
                        <button onClick={() => setShowAbonosModal(false)}
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                background: '#e74c3c',
                                color: '#fff',
                                border: '2px solid #fff',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                zIndex: 100,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 1
                            }}
                            title="Cerrar"
                        >
                            &times;
                        </button>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '18px', color: '#1766a8' }}>
                            Total Abonos del Cliente
                        </div>
                        <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                                <thead>
                                    <tr style={{ background: '#f2f2f2' }}>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Fecha</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Folio</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Método</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Abono</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedData.filter(payment => Number(payment.Abono || 0) > 0).map((payment, index) => (
                                        <tr key={payment._id || index}>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{payment.CreateDate ? new Date(payment.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{payment.Folio}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{payment.Method}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>${Number(payment.Abono || 0).toLocaleString()}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{payment.Status || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ marginTop: '12px', fontSize: '1.05rem' }}>
                            <div><b>Total Abonado:</b> ${data.reduce((total, payment) => total + (Number(payment.Abono) || 0), 0).toLocaleString()}</div>
                            <div><b>Abonos registrados:</b> {data.filter(payment => Number(payment.Abono || 0) > 0).length}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ClientPayments;

ClientPayments.propTypes = {
    client: PropTypes.string
};
