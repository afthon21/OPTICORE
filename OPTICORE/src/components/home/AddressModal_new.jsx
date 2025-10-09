import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

function AddressModal({ client, isOpen, onClose }) {
    // Estados
    const [visible, setVisible] = useState(false);
    const [clientLocation, setClientLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Configuración para Google Maps
    const API_KEY = import.meta.env.VITE_GOOGLE_MAP;
    const mapId = import.meta.env.VITE_MAP_ID;

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

    // Función para obtener la dirección completa formateada
    const getFullAddress = () => {
        if (!client || !client.Location) return {
            fullAddress: 'Sin dirección disponible',
            details: {
                calle: 'No especificada',
                numeroExterior: 'N/A',
                numeroInterior: 'N/A',
                colonia: 'No especificada',
                municipio: 'No especificado',
                estado: 'No especificado',
                codigoPostal: 'N/A',
                coordenadas: {
                    latitud: 'N/A',
                    longitud: 'N/A'
                }
            }
        };
        
        const { Address, OutNumber, InNumber, Cologne, Municipality, State, ZIP, Latitude, Length } = client.Location;
        
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

        const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Sin dirección disponible';

        return {
            fullAddress,
            details: {
                calle: Address || 'No especificada',
                numeroExterior: OutNumber || 'N/A',
                numeroInterior: InNumber || 'N/A',
                colonia: Cologne || 'No especificada',
                municipio: Municipality || 'No especificado',
                estado: State || 'No especificado',
                codigoPostal: ZIP || 'N/A',
                coordenadas: {
                    latitud: Latitude || 'N/A',
                    longitud: Length || 'N/A'
                }
            }
        };
    };

    // Funciones de manejo
    const handleClose = () => {
        console.log('Cerrando AddressModal...');
        setVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            console.log('Cerrando modal por click en backdrop');
            handleClose();
        }
    };

    // Todos los useEffect
    useEffect(() => {
        console.log('AddressModal useEffect - isOpen:', isOpen, 'client:', client?.Name?.FirstName);
        if (isOpen) {
            console.log('Abriendo AddressModal...');
            setTimeout(() => setVisible(true), 10);
            if (client) {
                console.log('Obteniendo ubicación del cliente:', client.Name?.FirstName);
                getClientLocation();
            }
        } else {
            console.log('Cerrando AddressModal...');
            setVisible(false);
        }
    }, [isOpen, client]);

    // Agregar estilos CSS para la animación
    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
        
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    // Verificación de renderizado - DESPUÉS de todos los hooks
    if (!isOpen || !client) {
        console.log('AddressModal no se renderiza - isOpen:', isOpen, 'client:', !!client);
        return null;
    }

    console.log('Renderizando AddressModal para cliente:', client.Name?.FirstName);

    const addressData = getFullAddress();
    const clientName = [
        client.Name?.FirstName,
        client.Name?.SecondName,
        client.LastName?.FatherLastName,
        client.LastName?.MotherLastName
    ].filter(Boolean).join(' ');

    const styles = {
        backdrop: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.3s',
            opacity: visible ? 1 : 0
        },
        modal: {
            background: '#fff',
            borderRadius: '12px',
            padding: '0',
            position: 'relative',
            minWidth: '500px',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            zIndex: 1060,
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s, opacity 0.3s',
            transform: visible ? 'translateY(0)' : 'translateY(-40px)',
            opacity: visible ? 1 : 0
        },
        header: {
            background: 'linear-gradient(135deg, #2a9d8f, #264653)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px 12px 0 0',
            position: 'relative'
        },
        closeButton: {
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background-color 0.2s'
        },
        body: {
            padding: '2rem'
        },
        addressSection: {
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
        },
        addressLabel: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#264653'
        },
        addressValue: {
            fontSize: '15px',
            color: '#333',
            lineHeight: '1.5',
            paddingLeft: '24px',
            fontStyle: 'italic'
        },
        mapSection: {
            marginBottom: '25px'
        },
        mapTitle: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#264653'
        },
        mapContainer: {
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #dee2e6',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        noMapMessage: {
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            color: '#6c757d'
        },
        loadingMapMessage: {
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            color: '#2a9d8f',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        coordinatesSection: {
            marginTop: '20px',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
        },
        coordinatesTitle: {
            fontWeight: '600',
            color: '#264653',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center'
        },
        coordinateItem: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '14px'
        }
    };

    return (
        <div style={styles.backdrop} onClick={handleBackdropClick}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.header}>
                    <button 
                        style={styles.closeButton}
                        onClick={handleClose}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        ×
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="bi bi-geo-alt-fill" style={{ fontSize: '24px', marginRight: '10px' }}></i>
                        <div>
                            <h5 style={{ margin: 0, fontWeight: '600' }}>Dirección Completa</h5>
                            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>{clientName}</p>
                        </div>
                    </div>
                </div>

                <div style={styles.body}>
                    {/* Dirección completa en una sola línea */}
                    <div style={styles.addressSection}>
                        <div style={styles.addressLabel}>
                            <i className="bi bi-house-door" style={{ marginRight: '8px', color: '#2a9d8f' }}></i>
                            <strong>Dirección:</strong>
                        </div>
                        <div style={styles.addressValue}>
                            {addressData.fullAddress}
                        </div>
                    </div>

                    {/* Mapa */}
                    <div style={styles.mapSection}>
                        <div style={styles.mapTitle}>
                            <i className="bi bi-map" style={{ marginRight: '8px', color: '#2a9d8f' }}></i>
                            <strong>Ubicación en el Mapa</strong>
                            {isLoadingLocation && (
                                <small style={{ marginLeft: '10px', color: '#2a9d8f', fontSize: '12px' }}>
                                    <i className="bi bi-arrow-clockwise" style={{ animation: 'spin 1s linear infinite', marginRight: '4px' }}></i>
                                    Obteniendo ubicación...
                                </small>
                            )}
                            {!isLoadingLocation && clientLocation && !clientLocation.hasCoordinates && (
                                <small style={{ marginLeft: '10px', color: '#6c757d', fontSize: '12px' }}>
                                    (Ubicación aproximada)
                                </small>
                            )}
                            {!isLoadingLocation && clientLocation && clientLocation.source === 'geocoded' && (
                                <small style={{ marginLeft: '10px', color: '#28a745', fontSize: '12px' }}>
                                    ✓ Ubicación encontrada
                                </small>
                            )}
                            {!isLoadingLocation && clientLocation && clientLocation.source === 'database' && (
                                <small style={{ marginLeft: '10px', color: '#17a2b8', fontSize: '12px' }}>
                                    ✓ Coordenadas exactas
                                </small>
                            )}
                        </div>
                        
                        {API_KEY ? (
                            <div style={styles.mapContainer}>
                                {isLoadingLocation ? (
                                    <div style={styles.loadingMapMessage}>
                                        <i className="bi bi-arrow-clockwise" style={{ fontSize: '24px', color: '#2a9d8f', marginBottom: '10px', animation: 'spin 1s linear infinite' }}></i>
                                        <p>Localizando dirección del cliente...</p>
                                        <small>Por favor espere</small>
                                    </div>
                                ) : clientLocation ? (
                                    <APIProvider apiKey={API_KEY}>
                                        <Map
                                            mapId={mapId}
                                            defaultZoom={clientLocation.hasCoordinates ? 16 : 12}
                                            defaultCenter={clientLocation.coordinates}
                                            center={clientLocation.coordinates}
                                            style={{ width: "100%", height: "300px", borderRadius: "8px" }}
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
                                                    <i className="bi bi-house-fill" style={{ 
                                                        color: 'white', 
                                                        fontSize: '10px' 
                                                    }}></i>
                                                </div>
                                            </AdvancedMarker>
                                        </Map>
                                    </APIProvider>
                                ) : (
                                    <div style={styles.noMapMessage}>
                                        <i className="bi bi-exclamation-triangle" style={{ fontSize: '24px', color: '#ffc107', marginBottom: '10px' }}></i>
                                        <p>No se pudo obtener la ubicación</p>
                                        <small>Verifique la dirección del cliente</small>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={styles.noMapMessage}>
                                <i className="bi bi-exclamation-triangle" style={{ fontSize: '24px', color: '#ffc107', marginBottom: '10px' }}></i>
                                <p>Google Maps no está disponible</p>
                                <small>Configure su API key para mostrar el mapa</small>
                            </div>
                        )}
                    </div>

                    {/* Coordenadas GPS */}
                    <div style={styles.coordinatesSection}>
                        <div style={styles.coordinatesTitle}>
                            <i className="bi bi-crosshair" style={{ marginRight: '8px' }}></i>
                            Coordenadas GPS
                        </div>
                        <div style={styles.coordinateItem}>
                            <span><strong>Latitud:</strong></span>
                            <span>{addressData.details.coordenadas.latitud}</span>
                        </div>
                        <div style={styles.coordinateItem}>
                            <span><strong>Longitud:</strong></span>
                            <span>{addressData.details.coordenadas.longitud}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddressModal;