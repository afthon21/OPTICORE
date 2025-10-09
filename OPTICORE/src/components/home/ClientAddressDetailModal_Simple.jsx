import React, { useState, useEffect } from 'react';

function ClientAddressDetailModal({ client, isOpen, onClose }) {
    const [visible, setVisible] = useState(false);

    // Función para obtener el nombre completo del cliente
    const getClientName = () => {
        if (!client) return 'Cliente sin nombre';
        
        // Intentar diferentes estructuras de datos del cliente
        if (client.name && client.lastname) {
            return `${client.name} ${client.lastname}`;
        }
        
        if (client.Name) {
            return [
                client.Name.FirstName,
                client.Name.SecondName,
                client.LastName?.FatherLastName,
                client.LastName?.MotherLastName
            ].filter(Boolean).join(' ');
        }
        
        return 'Cliente sin nombre';
    };

    // Función para obtener los detalles de la dirección
    const getAddressDetails = () => {
        if (!client || !client.Location) {
            return {
                direccionCompleta: 'Sin dirección disponible'
            };
        }
        
        const { Address, OutNumber, InNumber, Cologne, Municipality, State, ZIP } = client.Location;
        
        const addressParts = [
            Address || null,
            OutNumber ? `#${OutNumber}` : null,
            InNumber ? `Int. ${InNumber}` : null,
            Cologne ? `Col. ${Cologne}` : null,
            Municipality ? Municipality : null,
            State ? State : null,
            ZIP ? `C.P. ${ZIP}` : null
        ].filter(Boolean);

        const direccionCompleta = addressParts.length > 0 ? addressParts.join(', ') : 'Sin dirección disponible';
        
        return {
            direccionCompleta
        };
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setVisible(true), 10);
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    if (!isOpen || !client) {
        return null;
    }

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
            }}
            onClick={handleBackdropClick}
        >
            <div 
                style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    width: '500px',
                    maxWidth: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    transform: visible ? 'scale(1)' : 'scale(0.9)',
                    transition: 'transform 0.3s ease-in-out',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header con título y botón de cerrar */}
                <div style={{
                    backgroundColor: '#2a9d8f',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2a9d8f',
                            fontSize: '14px'
                        }}>
                            📍
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                                Dirección del Cliente
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                                {getClientName()}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            cursor: 'pointer',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        ×
                    </button>
                </div>

                {/* Contenido del modal */}
                <div style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                            📍 Información de Dirección
                        </h4>
                        
                        <div style={{ 
                            backgroundColor: '#f8f9fa', 
                            padding: '16px', 
                            borderRadius: '8px',
                            border: '1px solid #dee2e6'
                        }}>
                            <p style={{ 
                                margin: 0, 
                                fontSize: '14px', 
                                lineHeight: '1.5',
                                color: '#495057'
                            }}>
                                {getAddressDetails().direccionCompleta}
                            </p>
                        </div>

                        {/* Información adicional */}
                        {client.Location && (
                            <div style={{ marginTop: '16px' }}>
                                <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#6c757d' }}>
                                    Detalles de ubicación:
                                </h5>
                                <div style={{ fontSize: '13px', color: '#6c757d' }}>
                                    {client.Location.Latitude && client.Location.Length && (
                                        <p style={{ margin: '4px 0' }}>
                                            <strong>Coordenadas:</strong> {client.Location.Latitude}, {client.Location.Length}
                                        </p>
                                    )}
                                    {client.Location.Municipality && (
                                        <p style={{ margin: '4px 0' }}>
                                            <strong>Municipio:</strong> {client.Location.Municipality}
                                        </p>
                                    )}
                                    {client.Location.State && (
                                        <p style={{ margin: '4px 0' }}>
                                            <strong>Estado:</strong> {client.Location.State}
                                        </p>
                                    )}
                                    {client.Location.ZIP && (
                                        <p style={{ margin: '4px 0' }}>
                                            <strong>Código Postal:</strong> {client.Location.ZIP}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Placeholder para mapa futuro */}
                        <div style={{
                            marginTop: '16px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '8px',
                            height: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6c757d',
                            border: '1px dashed #adb5bd'
                        }}>
                            <span style={{ fontSize: '48px', marginBottom: '8px' }}>🗺️</span>
                            <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>Mapa próximamente</p>
                            <small>Visualización de ubicación en desarrollo</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientAddressDetailModal;