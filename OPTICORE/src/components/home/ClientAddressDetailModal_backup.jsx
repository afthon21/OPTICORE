import { useState, useEffect } from 'react';

// Archivo backup - Todas las referencias a Leaflet han sido eliminadas

function ClientAddressDetailModal({ client, isOpen, onClose }) {
    const [visible, setVisible] = useState(false);
    const [clientLocation, setClientLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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

            // Si no tiene coordenadas, intentar geocodificación con OpenStreetMap (GRATUITO)
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

            console.log('Geocoding address with Nominatim:', fullAddress);

            // Hacer geocodificación usando Nominatim (OpenStreetMap) - GRATUITO
            const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;
            
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data && data.length > 0) {
                const coordinates = {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };

                console.log('Geocoding successful:', coordinates);

                setClientLocation({
                    coordinates,
                    hasCoordinates: true,
                    source: 'geocoded',
                    geocodedAddress: data[0].display_name
                });
            } else {
                console.log('Geocoding failed with Nominatim');
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

    // Función para descargar captura de pantalla con Leaflet
    const handleDownloadAddress = async () => {
        console.log('🔥 Iniciando descarga con Leaflet');
        
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

            const html2canvas = (await import('html2canvas')).default;

            // Encontrar el contenedor del mapa de Leaflet
            const leafletContainer = document.querySelector('[data-leaflet-map="true"]');
            if (!leafletContainer) {
                console.error('❌ Contenedor de Leaflet no encontrado');
                return;
            }

            console.log('🗺️ Capturando mapa de Leaflet...');

            // Capturar solo el mapa de Leaflet (sin controles)
            const mapCanvas = await html2canvas(leafletContainer, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: 800,
                height: 500,
                ignoreElements: (element) => {
                    // Ignorar controles de Leaflet que no queremos en la captura
                    const classList = element.classList;
                    return (
                        classList.contains('leaflet-control-container') ||
                        classList.contains('leaflet-control-zoom') ||
                        classList.contains('leaflet-control-zoom-in') ||
                        classList.contains('leaflet-control-zoom-out') ||
                        classList.contains('leaflet-control-attribution') ||
                        element.className.includes('leaflet-control') ||
                        element.tagName === 'BUTTON' ||
                        element.getAttribute('role') === 'button' ||
                        element.getAttribute('title')?.includes('Zoom')
                    );
                }
            });

            // Crear canvas final con header + mapa
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = 800;
            finalCanvas.height = 600; // Header (100px) + Mapa (500px)
            const ctx = finalCanvas.getContext('2d');

            // Fondo blanco
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 800, 600);

            // Dibujar header
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`Ubicación de ${clientName}`, 400, 35);
            
            // Dirección
            const addressDetails = getAddressDetails();
            ctx.fillStyle = '#666666';
            ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            
            // Dividir dirección en líneas si es muy larga
            const maxWidth = 760;
            const words = addressDetails.direccionCompleta.split(' ');
            const lines = [];
            let currentLine = '';
            
            for (const word of words) {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            
            if (currentLine) {
                lines.push(currentLine);
            }

            // Dibujar líneas de dirección
            const lineHeight = 16;
            const startY = lines.length === 1 ? 65 : 58;
            lines.forEach((line, index) => {
                ctx.fillText(line, 400, startY + (index * lineHeight));
            });

            // Línea separadora
            ctx.strokeStyle = '#dee2e6';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 100);
            ctx.lineTo(800, 100);
            ctx.stroke();

            // Dibujar el mapa capturado
            ctx.drawImage(mapCanvas, 0, 100, 800, 500);

            // Descargar imagen
            const dataURL = finalCanvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `Ubicacion_${clientName.replace(/\s+/g, '_')}_${Date.now()}.png`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('✅ Imagen descargada exitosamente con Leaflet');
            
        } catch (error) {
            console.error('💥 Error en descarga con Leaflet:', error);
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
                                    Ubicación en el Mapa (Leaflet)
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

                        {/* Contenedor del mapa Leaflet */}
                        <div 
                            data-leaflet-map="true"
                            style={{
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid #dee2e6',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                height: '350px'
                            }}
                        >
                            {isLoadingLocation ? (
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
                                    <MapContainer
                                        center={[clientLocation.coordinates.lat, clientLocation.coordinates.lng]}
                                        zoom={clientLocation.hasCoordinates ? 16 : 12}
                                        style={{ height: '100%', width: '100%' }}
                                        attributionControl={false}
                                        zoomControl={true}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker 
                                            position={[clientLocation.coordinates.lat, clientLocation.coordinates.lng]}
                                            icon={customIcon}
                                        >
                                            <Popup>
                                                <div style={{ textAlign: 'center' }}>
                                                    <strong>{getClientName()}</strong><br />
                                                    <small>{getAddressDetails().direccionCompleta}</small>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
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
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientAddressDetailModal;