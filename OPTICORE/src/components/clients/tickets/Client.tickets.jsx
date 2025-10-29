import styleTickets from '../css/clientTickets.module.css';

import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import CreateTicket from './CreateTicket.modal.jsx';
import { LoadFragment } from '../../fragments/Load.fragment.jsx';
import ApiRequest from '../../hooks/apiRequest.jsx';
import TicketInfo from './Client.ticketInfo.jsx';

function ClientTickets({ client }) {
    const { makeRequest, loading } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [localError, setLocalError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showModal, setShowModal] = useState(false); 

    // Función para recargar datos
    const reloadTickets = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    // Función para actualizar un ticket específico
    const handleTicketUpdate = useCallback((updatedTicket) => {
        setData(prevData => 
            prevData.map(ticket => 
                ticket._id === updatedTicket._id ? updatedTicket : ticket
            )
        );
        // También actualizar el ticket seleccionado si es el mismo
        setSelect(prevSelect => 
            prevSelect && prevSelect._id === updatedTicket._id ? updatedTicket : prevSelect
        );
    }, []);

    // Efecto principal - se ejecuta cuando cambia el cliente o refresh
    useEffect(() => {
        let isCancelled = false; // Para evitar actualizaciones si el componente se desmonta
        
        if (!client) {
            setData([]);
            setSelect(null);
            setLocalError(null);
            return;
        }

        // Función para cargar datos del cliente
        const loadClientData = async () => {
            if (isCancelled) return;
            
            setLocalError(null);
            
            try {
                const token = sessionStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_BASE}/ticket/all/${client}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (isCancelled) return;
                
                if (response.ok) {
                    const res = await response.json();
                    if (res && Array.isArray(res)) {
                        setData(res);
                        setLocalError(null);
                    } else {
                        setData([]);
                        setLocalError(null); // No mostrar error si no hay tickets
                    }
                } else {
                    setData([]);
                    setLocalError('No se pudieron cargar los tickets');
                }
            } catch (err) {
                if (!isCancelled) {
                    setData([]);
                    setLocalError('Error de conexión');
                }
            }
        };

        // Limpiar estado anterior y cargar nuevos datos
        setData([]);
        setSelect(null);
        setLocalError(null);
        loadClientData();

        // Cleanup function
        return () => {
            isCancelled = true;
        };
    }, [client, refreshKey]); // Removí makeRequest de las dependencias
   
    // Cargar técnicos solo una vez al montar el componente
    useEffect(() => {
        let isCancelled = false;
        
        const loadTechnicians = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_BASE}/technician/all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const res = await response.json();
                    if (!isCancelled && res && Array.isArray(res)) {
                        setTechnicians(res);
                    }
                }
            } catch (error) {
                if (!isCancelled) {
                    setTechnicians([]);
                }
            }
        };

        loadTechnicians();

        return () => {
            isCancelled = true;
        };
    }, []); // Sin dependencias

    // Mostrar mensaje si no hay cliente seleccionado
    if (!client) {
        return (
            <div className="alert alert-info" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                Seleccione un cliente para ver sus tickets.
            </div>
        );
    }
    
    if (loading) return <LoadFragment />

    if (localError) {
        return (
            <div className="alert alert-warning" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                No se pudieron cargar los tickets para este cliente.
                <br />
                <small className="text-muted">Verifique que el cliente esté seleccionado correctamente.</small>
            </div>
        );
    }

    return (
        <>
            <div className="justify-content-end d-flex">
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#CreateTicketModal"
                    className={`${styleTickets['btn']}`}>
                    <i className="bi bi-plus-square-fill"></i>
                </button>

                <CreateTicket client={client} technicians={technicians} onTicketCreated={reloadTickets} />
            </div>
            <table className={`table table-hover table-sm ${styleTickets['container']}`}>
                <thead className={`${styleTickets['header']}`}>
                    <tr>
                        <th>Folio</th>
                        <th>Prioridad</th>
                        <th>Asunto</th>
                        <th>Técnico</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody className={`text-wrap ${styleTickets['body']}`}>
                    {data && data.length > 0 ? (
                        data.map((item) => (
                            <tr key={item._id} 
                                onClick={() => {
                                    setSelect(item);
                                    setShowModal(true);
                                }} 
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{item.Folio}</td>
                                <td>{item.Priority}</td>
                                <td>{item.Issue}</td>
                                <td>{item.tecnico || 'Sin asignar'}</td>
                                <td>
                                    <span className={`badge ${
                                        item.Status === 'Abierto' ? 'bg-primary' :
                                        item.Status === 'En espera' ? 'bg-warning' :
                                        item.Status === 'En Progreso' ? 'bg-info' :
                                        item.Status === 'Retenido' ? 'bg-danger' :
                                        item.Status === 'Cerrado' ? 'bg-success' : 'bg-secondary'
                                    }`}>
                                        {item.Status}
                                    </span>
                                </td>
                                <td>{new Date(item.CreateDate).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-muted py-4">
                                <i className="bi bi-inbox me-2"></i>
                                No hay tickets registrados para este cliente
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal de información del ticket */}
            <TicketInfo 
                ticket={select} 
                showModal={showModal} 
                onClose={() => setShowModal(false)}
                onTicketUpdate={handleTicketUpdate}
            />
        </>
    );
}

ClientTickets.propTypes = {
    client: PropTypes.string
};

export default ClientTickets;