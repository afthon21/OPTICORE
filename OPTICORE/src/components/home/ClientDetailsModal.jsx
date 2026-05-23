import React, { useState, useEffect } from 'react';
import ApiRequest from '../hooks/apiRequest';
import ClientLocation from '../clients/location/location.map';
import { getZoneRegionByMunicipio } from '../../lib/zoneRegionMapping.js';
import './css/ClientDetailsModal.css';

function ClientDetailsModal({ client, isOpen, onClose }) {
    const [clientPackage, setClientPackage] = useState(null);
    const [loadingPackage, setLoadingPackage] = useState(false);
    const [fotoFachada, setFotoFachada] = useState(null);
    const [loadingFoto, setLoadingFoto] = useState(false);
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

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

    // Función para obtener el teléfono del cliente
    const getClientPhone = () => {
        if (!client || !client.PhoneNumber || client.PhoneNumber.length === 0) {
            return 'Sin teléfono registrado';
        }
        return client.PhoneNumber.join(', ');
    };

    // Función para obtener la dirección del cliente
    const getClientAddress = () => {
        if (!client) return 'Sin dirección disponible';

        if (client.Address) {
            if (typeof client.Address === 'string') {
                return client.Address;
            } else if (typeof client.Address === 'object') {
                const calle = client.Address.Street || '';
                const cp = client.Address.PostalCode || client.Address.CP || '';
                return [calle, cp].filter(Boolean).join(', ') || 'Sin dirección disponible';
            }
        } else if (client.Location) {
            const { Address, OutNumber, InNumber, Cologne, ZIP } = client.Location;
            const addressParts = [
                Address ? `${Address}` : null,
                OutNumber ? `#${OutNumber}` : null,
                InNumber ? `Int. ${InNumber}` : null,
                Cologne ? `${Cologne}` : null,
                ZIP ? `CP ${ZIP}` : null
            ].filter(Boolean);
            return addressParts.length > 0 ? addressParts.join(', ') : 'Sin dirección disponible';
        }
        
        return 'Sin dirección disponible';
    };

    // Función para obtener la zona (municipio) del cliente
    const getClientZone = () => {
        if (!client) return 'Sin zona disponible';

        const municipio = client.Address && typeof client.Address === 'object'
            ? (client.Address.City || client.Address.Municipio)
            : client.Location?.Municipality;

        const estado = client.Location?.State || client.Address?.State;
        const mapped = estado && municipio ? getZoneRegionByMunicipio(estado, municipio) : null;
        if (mapped) {
            return `${mapped.zone} / ${mapped.region}`;
        }

        if (municipio) return municipio;
        if (client.Location?.State) return client.Location.State;
        
        return 'Sin zona disponible';
    };

    // Función para generar título simplificado del paquete
    const getSimplifiedPackageTitle = (packageData) => {
        if (!packageData) return '';
        
        // Extraer velocidad del tipo o del nombre
        let speed = '';
        let connectionType = '';
        
        // Buscar velocidad en el tipo
        if (packageData.type && packageData.type !== 'No especificado') {
            speed = packageData.type;
        } else {
            // Si no está en type, buscar en el nombre
            const speedMatch = packageData.name.match(/(\d+\s*Megas?)/i);
            if (speedMatch) {
                speed = speedMatch[1];
            }
        }
        
        // Determinar tipo de conexión
        if (packageData.connectionType && packageData.connectionType !== 'No especificado') {
            connectionType = packageData.connectionType;
        } else {
            // Buscar en el nombre indicios del tipo de conexión
            const nameLower = packageData.name.toLowerCase();
            if (nameLower.includes('fibra')) {
                connectionType = 'Fibra Óptica';
            } else if (nameLower.includes('radio')) {
                connectionType = 'Radio Frecuencia';
            } else {
                // Por defecto asumir fibra si no se especifica
                connectionType = 'Fibra Óptica';
            }
        }
        
        // Crear título simplificado
        const parts = [];
        if (speed) parts.push(speed);
        if (connectionType) parts.push(connectionType);
        
        return parts.length > 0 ? parts.join(' - ') : packageData.name;
    };

    // Función para obtener la foto de fachada del cliente
    const fetchFotoFachada = async () => {
        if (!client || !client._id) return;
        
        setLoadingFoto(true);
        try {
            const documents = await makeRequest(`/document/all/${client._id}`);
            
            // Buscar el documento con descripción "Foto de Fachada"
            const fotoFachadaDoc = documents.find(doc => 
                doc.Description === 'Foto de Fachada'
            );
            
            setFotoFachada(fotoFachadaDoc ? fotoFachadaDoc.Document : null);
        } catch (error) {
            console.error('Error obteniendo foto de fachada:', error);
            setFotoFachada(null);
        } finally {
            setLoadingFoto(false);
        }
    };

    // Función para descargar la foto de fachada
    const handleDownloadFotoFachada = async () => {
        if (!fotoFachada || !client) return;
        
        try {
            const response = await fetch(fotoFachada);
            const blob = await response.blob();
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
            // Crear nombre de archivo con el nombre del cliente
            const clientName = getClientName();
            const fileExtension = fotoFachada.split('.').pop() || 'jpg';
            link.download = `Foto_Fachada_${clientName.replace(/\s+/g, '_')}.${fileExtension}`;
            
            link.click();
            
            // Limpiar la URL para evitar problemas de memoria
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error al descargar la foto de fachada:', error);
        }
    };

    // Funciones para manejar el modal de ubicación
    const handleOpenLocationModal = () => {
        setLocationModalOpen(true);
    };

    const handleCloseLocationModal = () => {
        setLocationModalOpen(false);
    };

    // Función principal para descargar la captura del mapa
    const handleDownloadLocationMap = async () => {
        if (!client) return;
        
        try {
            
            const html2canvas = (await import('html2canvas')).default;
            
            // Buscar el contenedor del mapa
            const mapContainer = document.querySelector('.location-modal-body');
            if (!mapContainer) {
                throw new Error('No se encontró el contenedor del mapa');
            }


            // Esperar a que el mapa esté completamente cargado
            await new Promise(resolve => {
                let attempts = 0;
                const maxAttempts = 20;
                
                const checkMapLoaded = () => {
                    attempts++;
                    const mapElements = mapContainer.querySelectorAll('.gm-style, canvas, img[src*="maps.googleapis.com"]');
                    
                    if (mapElements.length > 0 || attempts >= maxAttempts) {
                        resolve();
                    } else {
                        setTimeout(checkMapLoaded, 300);
                    }
                };
                
                checkMapLoaded();
            });

            // **MÉTODO DIRECTO: Capturar WebGL canvas ANTES de html2canvas**
            const webglCanvases = mapContainer.querySelectorAll('canvas');
            
            // Intentar capturar cada canvas WebGL individualmente
            const canvasCaptures = [];
            for (let i = 0; i < webglCanvases.length; i++) {
                const canvas = webglCanvases[i];
                try {
                    // Verificar si es WebGL
                    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true }) || 
                              canvas.getContext('webgl2', { preserveDrawingBuffer: true }) ||
                              canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
                    
                    if (gl) {
                        
                        // Forzar finalización del renderizado WebGL
                        gl.finish();
                        gl.flush();
                        
                        // Intentar capturar con toDataURL
                        try {
                            const dataURL = canvas.toDataURL('image/png', 1.0);
                            
                            // Verificar que no sea una imagen vacía (pixel transparente de 1x1)
                            if (dataURL && dataURL !== 'data:,' && dataURL.length > 100) {
                                const rect = canvas.getBoundingClientRect();
                                const containerRect = mapContainer.getBoundingClientRect();
                                
                                canvasCaptures.push({
                                    dataURL,
                                    x: rect.left - containerRect.left,
                                    y: rect.top - containerRect.top,
                                    width: rect.width,
                                    height: rect.height,
                                    index: i
                                });
                                
                            } else {
                                console.log(`⚠ Canvas ${i} resultó vacío o demasiado pequeño`);
                            }
                        } catch (webglError) {
                            console.log(`❌ Canvas ${i} falló toDataURL:`, webglError.message);
                        }
                    } else {
                        console.log(`Canvas ${i}: No es WebGL`);
                    }
                } catch (e) {
                    console.log(`Canvas ${i} error general:`, e.message);
                }
            }

            // Configuración simplificada para html2canvas
            const options = {
                backgroundColor: '#ffffff',
                scale: 1,
                logging: true, // Activar para debug
                allowTaint: true,
                useCORS: true,
                foreignObjectRendering: false,
                imageTimeout: 15000,
                removeContainer: false,
                width: mapContainer.offsetWidth,
                height: mapContainer.offsetHeight,
                ignoreElements: (element) => {
                    // Ignorar canvas WebGL ya que los capturaremos manualmente
                    return element.tagName === 'CANVAS' && (
                        element.getContext('webgl') || 
                        element.getContext('webgl2') || 
                        element.getContext('experimental-webgl')
                    );
                }
            };

            const baseCanvas = await html2canvas(mapContainer, options);
            
            let mapImage = null;
            
            // Si capturamos canvas WebGL, combinarlos con la captura base
            if (canvasCaptures.length > 0) {
                
                const combinedCanvas = document.createElement('canvas');
                combinedCanvas.width = baseCanvas.width;
                combinedCanvas.height = baseCanvas.height;
                const combinedCtx = combinedCanvas.getContext('2d');
                
                // Dibujar la captura base primero
                combinedCtx.drawImage(baseCanvas, 0, 0);
                
                // Superponer cada canvas WebGL capturado
                for (const capture of canvasCaptures) {
                    try {
                        const img = new Image();
                        await new Promise((resolve, reject) => {
                            img.onload = () => {
                                // Calcular posición escalada
                                const scaleX = baseCanvas.width / mapContainer.offsetWidth;
                                const scaleY = baseCanvas.height / mapContainer.offsetHeight;
                                
                                combinedCtx.drawImage(
                                    img, 
                                    capture.x * scaleX, 
                                    capture.y * scaleY, 
                                    capture.width * scaleX, 
                                    capture.height * scaleY
                                );
                                
                                resolve();
                            };
                            img.onerror = reject;
                            img.src = capture.dataURL;
                        });
                    } catch (e) {
                        console.log(`Error superponiendo canvas ${capture.index}:`, e.message);
                    }
                }
                
                mapImage = combinedCanvas;
            } else {
                mapImage = baseCanvas;
            }


            // Crear canvas con marcador superpuesto
            const markerCanvas = document.createElement('canvas');
            markerCanvas.width = mapImage.width;
            markerCanvas.height = mapImage.height;
            const markerCtx = markerCanvas.getContext('2d');
            
            // Dibujar la imagen del mapa como base
            markerCtx.drawImage(mapImage, 0, 0);
            
            // Calcular posición del marcador (centro del mapa)
            const markerX = markerCanvas.width / 2;
            const markerY = markerCanvas.height / 2;
            
            // Dibujar marcador exacto de Google Maps
            const drawLocationMarker = (ctx, x, y, size = 48) => {
                const radius = size / 2;
                const tipHeight = radius * 0.6; // Altura de la punta
                const markerCenterY = y - tipHeight - radius; // Centro del círculo
                
                // Sombra del marcador
                ctx.save();
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 8;
                
                // Crear path completo del marcador
                ctx.fillStyle = '#EA4335'; // Rojo Google Maps
                ctx.beginPath();
                
                // Círculo principal
                ctx.arc(x, markerCenterY, radius, 0, Math.PI * 2, false);
                
                // Crear la punta triangular del marcador
                ctx.moveTo(x - radius * 0.35, markerCenterY + radius * 0.7);
                ctx.lineTo(x, y); // Punta inferior
                ctx.lineTo(x + radius * 0.35, markerCenterY + radius * 0.7);
                
                // Conectar de vuelta al círculo con curva suave
                ctx.arc(x, markerCenterY, radius, Math.PI * 0.25, Math.PI * 0.75, false);
                
                ctx.closePath();
                ctx.fill();
                
                // Limpiar sombra para elementos internos
                ctx.restore();
                
                // Borde sutil del marcador
                ctx.strokeStyle = 'rgba(194, 53, 29, 0.8)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(x, markerCenterY, radius, 0, Math.PI * 2, false);
                ctx.moveTo(x - radius * 0.35, markerCenterY + radius * 0.7);
                ctx.lineTo(x, y);
                ctx.lineTo(x + radius * 0.35, markerCenterY + radius * 0.7);
                ctx.stroke();
                
                // Círculo interno blanco
                const innerRadius = radius * 0.55;
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(x, markerCenterY, innerRadius, 0, Math.PI * 2);
                ctx.fill();
                
                // Borde del círculo interno (muy sutil)
                ctx.strokeStyle = 'rgba(234, 67, 53, 0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Punto central (más pequeño y preciso)
                const dotRadius = innerRadius * 0.35;
                ctx.fillStyle = '#EA4335';
                ctx.beginPath();
                ctx.arc(x, markerCenterY, dotRadius, 0, Math.PI * 2);
                ctx.fill();
                
                // Highlight principal (brillo superior)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.beginPath();
                ctx.ellipse(
                    x - radius * 0.25, 
                    markerCenterY - radius * 0.35, 
                    radius * 0.2, 
                    radius * 0.15, 
                    -Math.PI / 6, 
                    0, 
                    Math.PI * 2
                );
                ctx.fill();
                
                // Micro highlight en el círculo interno
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(x - innerRadius * 0.3, markerCenterY - innerRadius * 0.3, innerRadius * 0.15, 0, Math.PI * 2);
                ctx.fill();
            };
            
            // Dibujar el marcador en el centro del mapa
            drawLocationMarker(markerCtx, markerX, markerY, 48);
            
            // Agregar texto de ubicación si hay espacio
            if (client?.Address) {
                const address = `${client.Address.Street || ''} ${client.Address.Number || ''}`.trim();
                if (address) {
                    // Fondo semi-transparente para el texto
                    const textY = markerY + 25;
                    const textX = markerX;
                    
                    markerCtx.font = 'bold 14px Arial, sans-serif';
                    markerCtx.textAlign = 'center';
                    
                    const textWidth = markerCtx.measureText(address).width;
                    const padding = 8;
                    
                    // Fondo del texto
                    markerCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    markerCtx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                    markerCtx.lineWidth = 1;
                    
                    const rectX = textX - textWidth/2 - padding;
                    const rectY = textY - 16;
                    const rectWidth = textWidth + padding * 2;
                    const rectHeight = 20;
                    
                    // Rectángulo con esquinas redondeadas
                    markerCtx.beginPath();
                    markerCtx.roundRect(rectX, rectY, rectWidth, rectHeight, 4);
                    markerCtx.fill();
                    markerCtx.stroke();
                    
                    // Texto de la dirección
                    markerCtx.fillStyle = '#333333';
                    markerCtx.fillText(address, textX, textY);
                }
            }
            
            // Actualizar mapImage con el marcador
            mapImage = markerCanvas;
            
            // Crear canvas final con la información del cliente
            const finalCanvas = document.createElement('canvas');
            const ctx = finalCanvas.getContext('2d');
            
            // Dimensiones
            const mapWidth = mapImage.width || 800;
            const mapHeight = mapImage.height || 600;
            const headerHeight = 120;
            const footerHeight = 60;
            
            finalCanvas.width = mapWidth;
            finalCanvas.height = mapHeight + headerHeight + footerHeight;
            
            // Fondo blanco
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
            
            // Header con información del cliente
            ctx.fillStyle = '#2a9d8f';
            ctx.fillRect(0, 0, finalCanvas.width, headerHeight);
            
            // Agregar sombra al texto para mejor legibilidad
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            // Texto del header
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('📍 Ubicación del Cliente', finalCanvas.width / 2, 35);
            
            ctx.font = 'bold 22px Arial, sans-serif';
            ctx.fillText(getClientName(), finalCanvas.width / 2, 65);
            
            ctx.font = '16px Arial, sans-serif';
            const address = getClientAddress();
            // Dividir dirección si es muy larga
            if (address.length > 50) {
                const words = address.split(' ');
                const mid = Math.ceil(words.length / 2);
                const firstLine = words.slice(0, mid).join(' ');
                const secondLine = words.slice(mid).join(' ');
                ctx.fillText(firstLine, finalCanvas.width / 2, 88);
                ctx.fillText(secondLine, finalCanvas.width / 2, 108);
            } else {
                ctx.fillText(address, finalCanvas.width / 2, 95);
            }
            
            // Quitar sombra para el resto del contenido
            ctx.shadowColor = 'transparent';
            
            // Dibujar el mapa
            ctx.drawImage(mapImage, 0, headerHeight, mapWidth, mapHeight);
            
            // Footer
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, headerHeight + mapHeight, finalCanvas.width, footerHeight);
            
            ctx.fillStyle = '#6c757d';
            ctx.font = '16px Arial, sans-serif';
            ctx.fillText(`Generado el ${new Date().toLocaleDateString('es-ES')} - OPTICORE`, finalCanvas.width / 2, headerHeight + mapHeight + 35);
            
            // Descargar
            const link = document.createElement('a');
            const fileName = `Ubicacion_${getClientName().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
            link.download = fileName;
            link.href = finalCanvas.toDataURL('image/png', 1.0);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            
        } catch (error) {
            console.error('Error al descargar el mapa:', error);
            console.error('Stack trace:', error.stack);
            
            let errorMessage = 'Error al capturar el mapa. ';
            if (error.message.includes('No se encontró el contenedor')) {
                errorMessage += 'No se pudo encontrar el contenedor del mapa. Asegúrate de que el mapa esté abierto.';
            } else if (error.message.includes('Tainted canvas')) {
                errorMessage += 'Problema de seguridad con el canvas. Intenta recargar la página.';
            } else {
                errorMessage += 'Revisa la consola para más detalles. Error: ' + error.message;
            }
            
            alert(errorMessage);
        }
    };

    // Función para obtener el paquete del cliente
    const fetchClientPackage = async () => {
        if (!client || !client._id) return;
        
        setLoadingPackage(true);
        try {
            
            // Método 1: Buscar en todos los paquetes
            const packages = await makeRequest('/packages/all');
            
            // Buscar el paquete asignado al cliente
            const assignedPackage = packages.find(pkg => {
                const packageClientId = pkg.Client?._id || pkg.Client;
                return packageClientId && packageClientId.toString() === client._id.toString();
            });
            
            
            // Si no se encuentra, intentar método alternativo
            if (!assignedPackage) {
                console.log('Intentando método alternativo...');
                try {
                    // Método 2: Buscar paquetes específicos del cliente
                    const clientPackages = await makeRequest(`/packages/client/${client._id}`);
                    if (clientPackages && clientPackages.length > 0) {
                        setClientPackage(clientPackages[0]); // Tomar el primer paquete
                        return;
                    }
                } catch (altError) {
                    console.log('Método alternativo no disponible:', altError.message);
                }
            }
            
            setClientPackage(assignedPackage || null);
        } catch (error) {
            console.error('Error obteniendo paquete del cliente:', error);
            setClientPackage(null);
        } finally {
            setLoadingPackage(false);
        }
    };

    // Cargar paquete y foto cuando el modal se abre
    useEffect(() => {
        if (isOpen && client) {
            fetchClientPackage();
            fetchFotoFachada();
        }
    }, [isOpen, client]);

    // Limpiar estado cuando el modal se cierra
    useEffect(() => {
        if (!isOpen) {
            setClientPackage(null);
            setLoadingPackage(false);
            setFotoFachada(null);
            setLoadingFoto(false);
            setLocationModalOpen(false);
        }
    }, [isOpen]);

    if (!isOpen || !client) return null;

    return (
        <>
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="modal-title">
                        <i className="bi bi-person-circle me-2"></i>
                        Información del Cliente
                    </h4>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="modal-body">
                    {/* Sección de foto de fachada */}
                    <div className="photo-section">
                        {loadingFoto ? (
                            <div className="photo-placeholder loading-photo">
                                <i className="bi bi-arrow-clockwise spin"></i>
                                <span>Cargando foto...</span>
                            </div>
                        ) : fotoFachada ? (
                            <div className="photo-container">
                                <div className="photo-wrapper">
                                    <img 
                                        src={fotoFachada} 
                                        alt="Foto de Fachada" 
                                        className="client-photo"
                                    />
                                    <button
                                        type="button"
                                        className="download-photo-btn"
                                        onClick={handleDownloadFotoFachada}
                                        title="Descargar foto de fachada"
                                    >
                                        <i className="bi bi-download"></i>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="photo-placeholder no-photo">
                                <i className="bi bi-image"></i>
                                <span>Sin foto de fachada</span>
                            </div>
                        )}
                    </div>

                    <div className="client-info-section">
                        <div className="info-row">
                            <div className="info-label">
                                <i className="bi bi-person-fill"></i>
                                Nombre:
                            </div>
                            <div className="info-value">
                                {getClientName()}
                            </div>
                        </div>

                        <div className="info-row">
                            <div className="info-label">
                                <i className="bi bi-telephone-fill"></i>
                                Teléfono:
                            </div>
                            <div className="info-value">
                                {getClientPhone()}
                            </div>
                        </div>

                        <div className="info-row">
                            <div className="info-label">
                                <i className="bi bi-geo-alt-fill"></i>
                                Zona:
                            </div>
                            <div className="info-value zone-badge">
                                {getClientZone()}
                            </div>
                        </div>

                        <div className="info-row">
                            <div className="info-label">
                                <i className="bi bi-house-fill"></i>
                                Dirección:
                            </div>
                            <div className="info-value">
                                <button 
                                    className="address-link"
                                    onClick={handleOpenLocationModal}
                                    title="Ver ubicación en el mapa"
                                >
                                    <span>{getClientAddress()}</span>
                                    <i className="bi bi-geo-alt-fill"></i>
                                </button>
                            </div>
                        </div>

                        <div className="info-row">
                            <div className="info-label">
                                <i className="bi bi-box-seam"></i>
                                Paquete:
                            </div>
                            <div className="info-value">
                                {loadingPackage ? (
                                    <span className="loading">
                                        <i className="bi bi-arrow-clockwise spin"></i>
                                        Cargando...
                                    </span>
                                ) : clientPackage ? (
                                    <div className="package-info">
                                        <span className="package-name">{getSimplifiedPackageTitle(clientPackage)}</span>
                                        <span className="package-details">
                                            ${clientPackage.price} - {clientPackage.description || 'Sin descripción'}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="no-package">Sin paquete asignado</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        <i className="bi bi-x-circle me-2"></i>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>

        {/* Modal de ubicación */}
        {locationModalOpen && (
            <div className="modal-overlay" onClick={handleCloseLocationModal}>
                <div className="modal-content location-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h4 className="modal-title">
                            <i className="bi bi-geo-alt-fill me-2"></i>
                            Ubicación del Cliente - {getClientName()}
                        </h4>
                        <div className="header-buttons">
                            <button
                                type="button"
                                className="download-map-btn"
                                onClick={handleDownloadLocationMap}
                                title="Descargar imagen del mapa"
                            >
                                <i className="bi bi-download"></i>
                            </button>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCloseLocationModal}
                                aria-label="Close"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>
                    <div className="modal-body location-modal-body">
                        <ClientLocation client={client} />
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default ClientDetailsModal;