import stylePayment from '../css/clientPayments.module.css'

import { useEffect, useState, useCallback } from "react";
import PropTypes from 'prop-types';
import ApiRequest from '../../hooks/apiRequest.jsx';

import { LoadFragment } from '../../fragments/Load.fragment.jsx';
import CreatePay from './CreatePay.modal.jsx';
import InfoPay from './Client.infoPay.jsx';
import PaymentInfo from '../../payments/Payment.info.jsx';

function ClientPayments({ client, refreshKey = 0, isArchived = false }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);
    const [sortColumn, setSortColumn] = useState(null); // 'Folio', 'Method', 'CreateDate'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [clientPackage, setClientPackage] = useState(null);
    const [showAbonosModal, setShowAbonosModal] = useState(false);
    const [modalMaxHeight, setModalMaxHeight] = useState(null); // Altura dinámica para el modal
    const [mouseY, setMouseY] = useState(null); // Posición Y del mouse
    const [selectedPaymentInModal, setSelectedPaymentInModal] = useState(null); // Pago seleccionado en el modal

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
            const res = await makeRequest(`/pay/all/${client}${isArchived ? '?archived=true' : ''}`);
            // Asegurarnos de que res sea un array; si no, normalizar a array vacío
            if (Array.isArray(res)) {
                setData(res);
            } else if (res) {
                setData([res]);
            } else {
                setData([]);
            }
        } catch (error) {
            console.log(error);
        }
    }, [client, makeRequest]);

    // Función para obtener el paquete del cliente
    const fetchClientPackage = useCallback(async () => {
        if (!client) return;
        try {
            const res = await makeRequest(`/packages/client/${client}${isArchived ? '?archived=true' : ''}`);
            // Si el cliente tiene múltiples paquetes, tomamos el primero activo
            if (Array.isArray(res)) {
                setClientPackage(res.length > 0 ? res[0] : null);
            } else if (res) {
                setClientPackage(res);
            } else {
                setClientPackage(null);
            }
        } catch (error) {
            console.log('Error fetching client package:', error);
            setClientPackage(null);
        }
    }, [client, makeRequest]);

    useEffect(() => {
        fetchData();
        fetchClientPackage();
    }, [fetchData, fetchClientPackage, refreshKey]);

    // Escuchar eventos globales de pago creado (por ejemplo desde la vista global de pagos)
    useEffect(() => {
        const handler = (e) => {
            const created = e && e.detail ? e.detail : null;
            if (!created) return;

            // Obtener id del cliente actual (puede ser string o un objeto)
            const currentClientId = typeof client === 'string' ? client : (client && client._id ? client._id : null);
            const paymentClientId = created.Client && (created.Client._id || created.Client);

            if (currentClientId && paymentClientId && String(currentClientId) === String(paymentClientId)) {
                // Re-fetch the payments to keep ordering and computed totals consistent with server
                fetchData();
                // Refresh package info as it may affect pending amount
                fetchClientPackage();
            }
        };

        window.addEventListener('payment:created', handler);
        return () => window.removeEventListener('payment:created', handler);
    }, [client, fetchClientPackage]);

    // Listener para cerrar el panel de PaymentInfo
    useEffect(() => {
        const handleClosePaymentInfo = () => setSelectedPaymentInModal(null);
        window.addEventListener('closePaymentInfo', handleClosePaymentInfo);
        return () => window.removeEventListener('closePaymentInfo', handleClosePaymentInfo);
    }, []);
    
    // Mostrar mensaje si no hay cliente seleccionado
    if (!client) {
        return (
            <div className="alert alert-info" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                Seleccione un cliente para ver sus pagos.
            </div>
        );
    }

    // Mostrar aviso si el cliente no tiene paquete asignado, pero no impedir mostrar pagos
    const noPackageAlert = (!loading && !clientPackage) ? (
        <div className="alert alert-warning" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Este cliente no tiene un paquete asignado. 
            <br />
            <small className="text-muted">Asigne un paquete al cliente para poder calcular el monto pendiente.</small>
        </div>
    ) : null;
    
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

    // Totales y contadores usados en el modal de abonos
    // totalAmount = suma SOLO de los pagos con estado 'Exitoso'
    const totalAmount = data.reduce((total, payment) => {
        const status = payment?.Status || '';
        const isSuccess = /exitoso/i.test(status);
        if (!isSuccess) return total;
        return total + (Number(payment.Amount) || 0);
    }, 0);
    // Sólo considerar como "abonado" los pagos con estado 'Exitoso' (case-insensitive).
    // Si existe un Abono (parcial), se toma ese valor como lo realmente abonado; si no, se toma Amount.
    const successfulAbonos = data.reduce((total, payment) => {
        const status = payment?.Status || '';
        const isSuccess = /exitoso/i.test(status);
        if (!isSuccess) return total;
        const abono = Number(payment.Abono || 0);
        const amount = Number(payment.Amount || 0);
        return total + (abono > 0 ? abono : amount);
    }, 0);
    // Contadores: solo pagos exitosos
    const totalPaymentsCount = data.filter(p => {
        const status = p?.Status || '';
        const isSuccess = /exitoso/i.test(status);
        return isSuccess && Number(p.Amount || 0) > 0;
    }).length;
    const abonosCount = data.filter(p => {
        const status = p?.Status || '';
        const isSuccess = /exitoso/i.test(status);
        return isSuccess && Number(p.Abono || 0) > 0;
    }).length;

    // ========== NUEVA LÓGICA: CICLOS DE 30 DÍAS CON ADEUDO ACUMULADO ==========
    // Calcula todo lo relacionado con ciclos y adeudos
    const calculatePaymentCycles = () => {
        if (!clientPackage?.createdAt) {
            return { accumulatedDebt: 0, currentCyclePaid: 0, currentCycleRemaining: 0, totalDue: 0 };
        }
        
        const createdDate = new Date(clientPackage.createdAt);
        const today = new Date();
        const basePrice = Number(clientPackage.price) || 0;
        const daysSinceCreation = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
        const currentCycleIndex = Math.floor(daysSinceCreation / 30);
        
        let accumulatedDebt = 0;
        let currentCyclePaid = 0;
        
        // Revisar todos los ciclos hasta el actual
        for (let i = 0; i <= currentCycleIndex; i++) {
            const cycleStart = new Date(createdDate);
            cycleStart.setDate(cycleStart.getDate() + (i * 30));
            
            const cycleEnd = new Date(cycleStart);
            cycleEnd.setDate(cycleEnd.getDate() + 30);
            
            // Sumar pagos exitosos de este ciclo
            const cyclePaid = data.reduce((sum, payment) => {
                const paymentDate = new Date(payment.CreateDate);
                const status = payment?.Status || '';
                const isSuccess = /exitoso/i.test(status);
                
                if (isSuccess && paymentDate >= cycleStart && paymentDate < cycleEnd) {
                    const abono = Number(payment.Abono || 0);
                    const amount = Number(payment.Amount || 0);
                    return sum + (abono > 0 ? abono : amount);
                }
                return sum;
            }, 0);
            
            // Si es el ciclo actual, guardar lo pagado
            if (i === currentCycleIndex) {
                currentCyclePaid = cyclePaid;
            } 
            // Si es un ciclo anterior completado, calcular adeudo
            else if (i < currentCycleIndex) {
                const cycleDebt = Math.max(0, basePrice - cyclePaid);
                accumulatedDebt += cycleDebt;
            }
        }
        
        // Restante del ciclo actual
        const currentCycleRemaining = Math.max(0, basePrice - currentCyclePaid);
        
        // Total a pagar = Restante del ciclo actual + Adeudo acumulado
        const totalDue = currentCycleRemaining + accumulatedDebt;
        
        return { 
            accumulatedDebt, 
            currentCyclePaid, 
            currentCycleRemaining, 
            totalDue 
        };
    };

    const { accumulatedDebt, currentCyclePaid, currentCycleRemaining, totalDue: nextCycleTotalDue } = calculatePaymentCycles();

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

            {/* Mostrar alerta si no hay paquete, pero continuar mostrando resúmenes y pagos */}
            {noPackageAlert}

            {/* Resumen de abonos acumulados */}
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <div style={{background: '#fff', border: '2px solid #17a2b8', borderRadius: '10px', padding: '18px', minHeight: '170px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
                        <div>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                                <i className="bi bi-credit-card" style={{color: '#17a2b8', fontSize: '1.5rem', marginRight: '8px'}}></i>
                                <span style={{color: '#17a2b8', fontWeight: 'bold', fontSize: '1.1rem'}}>Costo del Paquete</span>
                            </div>
                            <div style={{color: '#17a2b8', fontSize: '2rem', fontWeight: 'bold'}}>
                                ${clientPackage?.price ? Number(clientPackage.price).toLocaleString() : '0'}
                            </div>
                        </div>
                        {clientPackage && (
                            <div style={{color: '#888', fontSize: '0.95rem'}}>{clientPackage.description || clientPackage.name || 'Sin descripción'}</div>
                        )}
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="row h-100">
                        <div className="col-12 mb-3">
                            <div style={{background: '#fff', border: '2px solid #28a745', borderRadius: '10px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.3s ease'}} onClick={() => setShowAbonosModal(true)} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(40, 167, 69, 0.2)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px'}}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <i className="bi bi-folder" style={{color: '#28a745', fontSize: '1.3rem', marginRight: '6px'}}></i>
                                        <span style={{color: '#28a745', fontWeight: 'bold', fontSize: '1rem'}}>Total Abonos</span>
                                    </div>
                                    <i className="bi bi-arrow-right" style={{color: '#28a745', fontSize: '1rem', opacity: 0.6}}></i>
                                </div>
                                <div style={{color: '#28a745', fontSize: '1.6rem', fontWeight: 'bold'}}>
                                    ${successfulAbonos.toLocaleString()}
                                </div>
                                <div style={{color: '#28a745', fontSize: '0.8rem', marginTop: '8px', opacity: 0.8, fontStyle: 'italic'}}>
                                    <i className="bi bi-hand-index me-1"></i>Clic para ver a detalle
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div style={{background: '#fff', border: '2px solid #6f42c1', borderRadius: '10px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '6px'}}>
                                    <i className="bi bi-calendar-event" style={{color: '#6f42c1', fontSize: '1.2rem', marginRight: '6px'}}></i>
                                    <span style={{color: '#6f42c1', fontWeight: 'bold', fontSize: '0.95rem'}}>Próximo Pago</span>
                                </div>
                                <div style={{color: '#6f42c1', fontSize: '1.2rem', fontWeight: 'bold'}}>
                                    {(() => {
                                        if (!clientPackage?.createdAt) return 'Sin fecha';
                                        const createdDate = new Date(clientPackage.createdAt);
                                        const today = new Date();
                                        
                                        // Calcular cuántos ciclos de 30 días han pasado desde la creación
                                        const daysSinceCreation = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
                                        const cyclesPassed = Math.floor(daysSinceCreation / 30);
                                        
                                        // Calcular la fecha del próximo pago (siguiente ciclo de 30 días)
                                        const nextPaymentDate = new Date(createdDate);
                                        nextPaymentDate.setDate(nextPaymentDate.getDate() + ((cyclesPassed + 1) * 30));
                                        
                                        return nextPaymentDate.toLocaleDateString('es-MX', { 
                                            day: '2-digit', 
                                            month: '2-digit', 
                                            year: 'numeric' 
                                        });
                                    })()}
                                </div>
                                {clientPackage?.createdAt && (
                                    <div style={{color: '#888', fontSize: '0.75rem', marginTop: '4px'}}>
                                        Creado: {new Date(clientPackage.createdAt).toLocaleDateString('es-MX', { 
                                            day: '2-digit', 
                                            month: '2-digit', 
                                            year: 'numeric' 
                                        })}
                                    </div>
                                )}
                                {(() => {
                                    if (!clientPackage?.createdAt) return null;
                                    const createdDate = new Date(clientPackage.createdAt);
                                    const today = new Date();
                                    const daysSinceCreation = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
                                    const cyclesPassed = Math.floor(daysSinceCreation / 30);
                                    const nextPaymentDate = new Date(createdDate);
                                    nextPaymentDate.setDate(nextPaymentDate.getDate() + ((cyclesPassed + 1) * 30));
                                    const daysUntilNextPayment = Math.ceil((nextPaymentDate - today) / (1000 * 60 * 60 * 24));
                                    
                                    if (daysUntilNextPayment <= 7 && daysUntilNextPayment > 0) {
                                        return (
                                            <div style={{color: '#dc3545', fontSize: '0.75rem', marginTop: '2px'}}>
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                Faltan {daysUntilNextPayment} días
                                            </div>
                                        );
                                    } else if (daysUntilNextPayment === 0) {
                                        return (
                                            <div style={{color: '#dc3545', fontSize: '0.75rem', marginTop: '2px', fontWeight: 'bold'}}>
                                                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                                ¡Vence hoy!
                                            </div>
                                        );
                                    } else if (daysUntilNextPayment < 0) {
                                        return (
                                            <div style={{color: '#dc3545', fontSize: '0.75rem', marginTop: '2px', fontWeight: 'bold'}}>
                                                <i className="bi bi-x-circle-fill me-1"></i>
                                                Vencido ({Math.abs(daysUntilNextPayment)} días)
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <InfoPay payment={select ? select : ''} />

            {/* Lateral panel para Total Abonos, alineado al patrón de pagos/tickets/paquetes */}
            {showAbonosModal && (
                <>
                    <div
                        onClick={() => setShowAbonosModal(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 1040 }}
                    />
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            height: '100vh',
                            width: '720px',
                            maxWidth: '98vw',
                            background: '#fff',
                            boxShadow: '-6px 0 24px rgba(0,0,0,0.12)',
                            zIndex: 1050,
                            display: 'flex',
                            flexDirection: 'column',
                            transform: 'translateX(0)',
                            transition: 'transform 0.3s ease'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div
                            style={{
                                padding: '18px 20px',
                                background: 'linear-gradient(135deg, #1766a8 0%, #1d7bcf 100%)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="bi bi-folder-fill" style={{ fontSize: '1.3rem' }} />
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Total Abonos del Cliente</div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Detalle de todos los abonos registrados</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAbonosModal(false)}
                                style={{
                                    border: 'none',
                                    background: 'rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: '38px',
                                    height: '38px',
                                    display: 'grid',
                                    placeItems: 'center',
                                    cursor: 'pointer'
                                }}
                                title="Cerrar"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
                            <div style={{ marginBottom: '12px', fontSize: '1.05rem', fontWeight: 600, color: '#1766a8' }}>
                                Resumen
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                                <div style={{ background: '#eef9f2', border: '1px solid #d6f2df', borderRadius: '10px', padding: '12px' }}>
                                    <div style={{ color: '#1f8f4d', fontWeight: 600, marginBottom: '4px' }}>Total Abonado</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#177f42' }}>${successfulAbonos.toLocaleString()}</div>
                                </div>
                                <div style={{ background: '#fff7e6', border: '1px solid #ffe5b8', borderRadius: '10px', padding: '12px' }}>
                                    <div style={{ color: '#c98200', fontWeight: 600, marginBottom: '4px' }}>Pagos registrados</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#a46900' }}>{totalPaymentsCount}</div>
                                </div>
                                <div style={{ background: '#f5f0ff', border: '1px solid #e0d4ff', borderRadius: '10px', padding: '12px' }}>
                                    <div style={{ color: '#6b4fb5', fontWeight: 600, marginBottom: '4px' }}>Abonos registrados</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#5a3fa1' }}>{abonosCount}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '10px', fontSize: '1.05rem', fontWeight: 600, color: '#1766a8' }}>Detalle de abonos</div>
                            <div style={{ border: '1px solid #e5e8ef', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.04)' }}>
                                <div style={{ background: '#f7f9fc', padding: '10px 12px', fontWeight: 600, color: '#4a5568', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '6px', fontSize: '0.95rem' }}>
                                    <span>Fecha</span>
                                    <span>Folio</span>
                                    <span>Método</span>
                                    <span>Monto</span>
                                    <span>Abono</span>
                                    <span>Estado</span>
                                </div>
                                <div style={{ maxHeight: '62vh', overflowY: 'auto' }}>
                                    {sortedData.length === 0 ? (
                                        <div style={{ padding: '18px', textAlign: 'center', color: '#6b7280' }}>
                                            No hay abonos registrados.
                                        </div>
                                    ) : (
                                        sortedData.map((payment, index) => (
                                            <div
                                                key={payment._id || index}
                                                onClick={() => setSelectedPaymentInModal(payment)}
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                                                    gap: '6px',
                                                    padding: '10px 12px',
                                                    borderTop: '1px solid #e5e8ef',
                                                    background: index % 2 === 0 ? '#ffffff' : '#fbfcff',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#e6f2ff'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#fbfcff'}
                                            >
                                                <span style={{ color: '#334155' }}>{payment.CreateDate ? new Date(payment.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}</span>
                                                <span style={{ color: '#334155' }}>{payment.Folio}</span>
                                                <span style={{ color: '#334155' }}>{payment.Method}</span>
                                                <span style={{ color: '#0d4f88', fontWeight: 600 }}>${Number(payment.Amount || 0).toLocaleString()}</span>
                                                <span style={{ color: '#177f42', fontWeight: 600 }}>${(Number(payment.Abono || 0) > 0 ? Number(payment.Abono) : Number(payment.Amount || 0)).toLocaleString()}</span>
                                                <span style={{ color: '#334155' }}>{payment.Status || 'N/A'}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Panel lateral para ver/editar pago desde el modal */}
            {selectedPaymentInModal && (
                <PaymentInfo
                    payment={selectedPaymentInModal}
                    onStatusChange={(updatedPayment) => {
                        // Actualizar el pago en el array local
                        setData(prev => prev.map(p => p._id === updatedPayment._id ? updatedPayment : p));
                        // Refrescar datos completos
                        fetchData();
                        fetchClientPackage();
                    }}
                />
            )}
        </>
    );
}

export default ClientPayments;

ClientPayments.propTypes = {
    client: PropTypes.string,
    onGlobalUpdate: PropTypes.func
};
