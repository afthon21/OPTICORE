import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

function ClientAddressDetailModal({ client, isOpen, onClose }) {
    const [visible, setVisible] = useState(false);
    const [clientLocation, setClientLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    
    // Configuración para Google Maps
    const API_KEY = import.meta.env.VITE_GOOGLE_MAP;
    const mapId = import.meta.env.VITE_MAP_ID;

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setVisible(true), 10);
            // Cargar automáticamente la ubicación del cliente
            setTimeout(() => {
                getClientLocation();
            }, 100);
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    // Función para obtener el nombre completo del cliente
    const getClientName = () => {
        if (!client || !client.Name) return 'Cliente sin nombre';
        
        return [
            client.Name.FirstName,
            client.Name.SecondName,
            client.LastName?.FatherLastName,
            client.LastName?.MotherLastName
        ].filter(Boolean).join(' ');
    };

    // Función para obtener los detalles de la dirección
    const getAddressDetails = () => {
        if (!client || !client.Location) {
            return {
                direccionCompleta: 'Sin dirección disponible'
            };
        }
        
        const { Address, OutNumber, InNumber, Cologne, Municipality, State, ZIP } = client.Location;
        
        // Crear dirección en una línea
        const addressParts = [
            Address ? `${Address}` : null,
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
            setClientLocation(null);
            setIsLoadingLocation(false);
            onClose();
        }, 300);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };
    
    // Función para obtener la ubicación del cliente
    const getClientLocation = async () => {
        if (!client || !client.Location) return;

        setIsLoadingLocation(true);

        try {
            const { Latitude, Length, Address, Cologne, Municipality, State, ZIP } = client.Location;

            // Si ya tiene coordenadas válidas, usarlas directamente
            if (Latitude && Length && Latitude !== 0 && Length !== 0) {
                const coordinates = {
                    lat: parseFloat(Latitude),
                    lng: parseFloat(Length)
                };
                setClientLocation({
                    coordinates,
                    hasCoordinates: true,
                    source: 'database'
                });
                setIsLoadingLocation(false);
                return;
            }

            // Si no tiene coordenadas, intentar geocodificación
            if (!API_KEY) {
                console.log('No Google Maps API key available for geocoding');
                setClientLocation({
                    coordinates: { lat: 19.4326, lng: -99.1332 },
                    hasCoordinates: false,
                    source: 'default'
                });
                setIsLoadingLocation(false);
                return;
            }

            // Construir dirección para geocodificación
            const addressParts = [Address, Cologne, Municipality, State, ZIP].filter(Boolean);
            const fullAddress = addressParts.join(', ');

            if (!fullAddress) {
                console.log('No address available for geocoding');
                setClientLocation({
                    coordinates: { lat: 19.4326, lng: -99.1332 },
                    hasCoordinates: false,
                    source: 'default'
                });
                setIsLoadingLocation(false);
                return;
            }

            console.log('Geocoding address:', fullAddress);

            // Hacer geocodificación usando la API de Google Maps
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${API_KEY}`;
            
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data.status === 'OK' && data.results && data.results.length > 0) {
                const location = data.results[0].geometry.location;
                const coordinates = {
                    lat: location.lat,
                    lng: location.lng
                };

                console.log('Geocoding successful:', coordinates);

                setClientLocation({
                    coordinates,
                    hasCoordinates: true,
                    source: 'geocoded',
                    geocodedAddress: data.results[0].formatted_address
                });
            } else {
                console.log('Geocoding failed:', data.status);
                setClientLocation({
                    coordinates: { lat: 19.4326, lng: -99.1332 },
                    hasCoordinates: false,
                    source: 'default'
                });
            }

        } catch (error) {
            console.error('Error getting client location:', error);
            setClientLocation({
                coordinates: { lat: 19.4326, lng: -99.1332 },
                hasCoordinates: false,
                source: 'default'
            });
        } finally {
            setIsLoadingLocation(false);
        }
    };

    // Función para descargar captura de pantalla del modal con el mapa
    const handleDownloadAddress = async () => {
        console.log('🔥 Botón de descarga presionado');
        
        if (!client) {
            console.log('❌ No hay cliente seleccionado');
            return;
        }

        const clientName = getClientName();
        console.log('👤 Cliente:', clientName);
        
        try {
            // Asegurar que la ubicación esté cargada
            if (!clientLocation) {
                await getClientLocation();
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Importar html2canvas
            const html2canvas = (await import('html2canvas')).default;

            // Crear un contenedor temporal con el formato deseado
            const tempContainer = document.createElement('div');
            tempContainer.style.cssText = `
                width: 800px;
                background: white;
                font-family: Arial, sans-serif;
                position: fixed;
                top: -9999px;
                left: -9999px;
            `;

            // Crear header con información del cliente (formato exacto)
            const header = document.createElement('div');
            header.style.cssText = `
                text-align: center;
                padding: 15px 20px;
                background: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `;
            
            const addressDetails = getAddressDetails();
            header.innerHTML = `
                <h2 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #333; line-height: 1.2;">
                    Ubicación de ${clientName}
                </h2>
                <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.4;">
                    ${addressDetails.direccionCompleta}
                </p>
            `;

            // Clonar el contenedor del mapa
            const originalMapContainer = document.querySelector('[data-map-container="true"]');
            if (!originalMapContainer) {
                console.error('❌ Contenedor del mapa no encontrado');
                return;
            }

            const mapClone = originalMapContainer.cloneNode(true);
            mapClone.style.cssText = `
                width: 800px;
                height: 500px;
                border: none;
                border-radius: 0;
                box-shadow: none;
                display: block;
            `;

            // Ensamblar el contenedor temporal
            tempContainer.appendChild(header);
            tempContainer.appendChild(mapClone);
            document.body.appendChild(tempContainer);

            // Esperar a que se renderice
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Configuración para la captura
            const options = {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: 800,
                height: tempContainer.offsetHeight
            };

            // Realizar captura del contenedor temporal
            const canvas = await html2canvas(tempContainer, options);
            
            // Limpiar el contenedor temporal
            document.body.removeChild(tempContainer);
            
            if (canvas.width === 0 || canvas.height === 0) {
                console.error('❌ Canvas vacío');
                return;
            }

            // Generar y descargar imagen silenciosamente
            const dataURL = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `Ubicacion_${clientName.replace(/\s+/g, '_')}_${Date.now()}.png`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('💥 Error en descarga:', error);
            // Silencioso - no mostrar alert de error
        }
    };

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

    // Agregar estilos CSS para la animación
    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        if (!document.getElementById('spinner-styles')) {
            styleSheet.id = 'spinner-styles';
            document.head.appendChild(styleSheet);
        }
        
        return () => {
            const existingStyle = document.getElementById('spinner-styles');
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, []);

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
                data-modal="address-detail"
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
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        ×
                    </button>
                </div>

                {/* Contenido del modal - Solo vista del mapa */}
                <div style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '16px' }}>🗺️</span>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>
                                    Ubicación en el Mapa
                                </h4>
                                {isLoadingLocation && (
                                    <small style={{ color: '#2a9d8f', fontSize: '12px', marginLeft: '8px' }}>
                                        Cargando ubicación...
                                    </small>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDownloadAddress();
                                    }}
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                                >
                                    📥 Descargar
                                </button>
                            </div>
                        </div>

                        {/* Contenedor del mapa */}
                        <div 
                            data-map-container="true"
                            style={{
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid #dee2e6',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                height: '350px'
                            }}
                        >
                            {API_KEY ? (
                                isLoadingLocation ? (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        backgroundColor: '#f8f9fa',
                                        color: '#2a9d8f'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            border: '4px solid #e9ecef',
                                            borderTop: '4px solid #2a9d8f',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                            marginBottom: '16px'
                                        }}></div>
                                        <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Localizando dirección...</p>
                                        <small style={{ color: '#6c757d' }}>Por favor espere</small>
                                    </div>
                                ) : clientLocation ? (
                                    <APIProvider apiKey={API_KEY}>
                                        <Map
                                            mapId={mapId}
                                            defaultZoom={clientLocation.hasCoordinates ? 16 : 12}
                                            defaultCenter={clientLocation.coordinates}
                                            center={clientLocation.coordinates}
                                            style={{ width: "100%", height: "100%" }}
                                        >
                                            <AdvancedMarker position={clientLocation.coordinates}>
                                                <div style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    backgroundColor: clientLocation.hasCoordinates ? '#28a745' : '#ffc107',
                                                    borderRadius: '50%',
                                                    border: '3px solid white',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <span style={{ color: 'white', fontSize: '10px' }}>🏠</span>
                                                </div>
                                            </AdvancedMarker>
                                        </Map>
                                    </APIProvider>
                                ) : (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        backgroundColor: '#f8f9fa',
                                        color: '#6c757d'
                                    }}>
                                        <span style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</span>
                                        <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>No se pudo obtener la ubicación</p>
                                        <small>Verifique la dirección del cliente</small>
                                    </div>
                                )
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    backgroundColor: '#f8f9fa',
                                    color: '#6c757d'
                                }}>
                                    <span style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</span>
                                    <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Google Maps no está disponible</p>
                                    <small>Configure su API key para mostrar el mapa</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientAddressDetailModal;