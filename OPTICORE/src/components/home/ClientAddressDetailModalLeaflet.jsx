import React from 'react';

// Este componente está temporalmente deshabilitado debido a dependencias de Leaflet no instaladas
function ClientAddressDetailModalLeaflet({ isOpen, onClose, client }) {
    
    const getClientName = () => {
        if (!client) return 'Cliente';
        return `${client.name || ''} ${client.lastname || ''}`.trim() || 'Cliente';
    };

    const getAddressDetails = () => {
        if (!client?.Location) return { direccionCompleta: 'Sin dirección disponible' };

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
        
        return { direccionCompleta };
    };

    const handleClose = () => {
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

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
                zIndex: 1000
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
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    backgroundColor: '#2a9d8f',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
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
                                Dirección Completa
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
                    >
                        ×
                    </button>
                </div>

                {/* Contenido del modal */}
                <div style={{ padding: '24px' }}>
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '40px 20px',
                        color: '#6c757d'
                    }}>
                        <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>🗺️</span>
                        <h4 style={{ margin: '0 0 16px 0', color: '#333' }}>
                            Componente de Mapa Deshabilitado
                        </h4>
                        <p style={{ margin: '0 0 16px 0' }}>
                            La funcionalidad de mapas está temporalmente deshabilitada.
                        </p>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '16px',
                            borderRadius: '8px',
                            textAlign: 'left'
                        }}>
                            <strong>Dirección del cliente:</strong><br />
                            {getAddressDetails().direccionCompleta}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientAddressDetailModalLeaflet;