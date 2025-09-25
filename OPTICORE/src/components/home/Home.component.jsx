// SweetAlert2 popup size custom CSS
const swalSmallStyle = document.createElement('style');
swalSmallStyle.innerHTML = `
    .swal2-small-popup {
        font-size: 0.95rem !important;
        padding: 1.2em 1.2em 1em 1.2em !important;
    }
    
    .map-modal-independent {
        z-index: 9999 !important;
        position: fixed !important;
    }
    
    .map-modal-independent .swal2-container {
        z-index: 9999 !important;
    }
`;
if (!document.getElementById('swal2-small-popup-style')) {
    swalSmallStyle.id = 'swal2-small-popup-style';
    document.head.appendChild(swalSmallStyle);
}
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ApiRequest from '../hooks/apiRequest'; //importacion de la API
import EstadoRedResumen from '../network/EstadoRedResumen.jsx';
import ErrorDisplay from './ErrorDisplay.jsx';
import FibraChart from './FibraChart.jsx';
import RadioChart from './RadioChart.jsx';

function HomeComponent() {
    const [tickets, setTickets] = useState([]);
    const [showAllClients, setShowAllClients] = useState(false);
    const [showAllTicketsState, setShowAllTicketsState] = useState(false);
    const [userName, setUserName] = useState('');
    const [clients, setClients] = useState([]);
    const [clientDocuments, setClientDocuments] = useState({});
    
    // Variable para controlar el modal principal
    let mainModalInstance = null;
    // Estado para los colores de cada recuadro
    const [boxColors, setBoxColors] = useState({
        clientes: '#ecebebff',
        admins: '#ecebebff',
        red: '#ecebebff',
        errores: '#ecebebff',
        radio: '#ecebebff',
        fibra: '#ecebebff',
        tickets: '#ecebebff',
        pendientes: '#ecebebff',
    });
    const { makeRequest } = ApiRequest(import.meta.env.VITE_API_BASE);

    // Función para mostrar detalles del cliente en un modal
    const handleShowClientDetails = (client) => {
        // Mostrar la dirección exactamente como la ingresó el usuario
        let direccion = 'Sin dirección';
        // Buscar dirección en Address o en Location
        if (client.Address) {
            if (typeof client.Address === 'string') {
                direccion = client.Address;
            } else if (typeof client.Address === 'object') {
                const municipio = client.Address.City || client.Address.Municipio || '';
                const calle = client.Address.Street || '';
                const cp = client.Address.PostalCode || client.Address.CP || '';
                direccion = [municipio, calle, cp].filter(Boolean).join(', ');
            }
        } else if (client.Location) {
            // Algunos clientes pueden tener la dirección en Location
            const municipio = client.Location.Municipality || '';
            const calle = client.Location.Address || '';
            const cp = client.Location.ZIP || '';
            direccion = [municipio, calle, cp].filter(Boolean).join(', ');
        }
        if (!direccion || direccion === ', , ') direccion = 'Sin dirección';

        // Obtener la foto de fachada del cliente (ya cargada previamente)
        const fotoFachada = clientDocuments[client._id];

        // Crear el HTML para la foto de fachada
        const fotoFachadaHTML = fotoFachada 
            ? `<div style="margin-bottom: 8px; display: flex; justify-content: center;">
                 <img src="${fotoFachada}" alt="Foto de Fachada" 
                      style="width: 300px; height: 260px; object-fit: cover; border-radius: 8px; border: 2px solid #dee2e6;" />
               </div>`
            : `<div style="margin-bottom: 8px; display: flex; justify-content: center;">
                 <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; 
                             background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; color: #6c757d; font-size: 10px;">
                   Sin foto
                 </div>
               </div>`;

        // Crear contenido HTML para el modal
        const clientInfoHTML = `
            <div style="text-align: center;">
                <div style="margin-bottom: 10px;">
                    <i class="bi bi-house-check-fill text-success" style="font-size: 2rem;"></i>
                </div>
                ${fotoFachadaHTML}
                <h4 style="font-weight: 600; margin-bottom: 15px; color: #333;">
                    ${[
                        client.Name.FirstName,
                        client.Name.SecondName,
                        client.LastName.FatherLastName,
                        client.LastName.MotherLastName
                    ].filter(Boolean).join(' ').toUpperCase()}
                </h4>
                <div style="text-align: left; font-size: 14px; line-height: 1.6;">
                    <p><strong>Tel:</strong> ${(client.PhoneNumber && client.PhoneNumber.length > 0) ? client.PhoneNumber.join(', ') : 'Sin teléfono'}</p>
                    <p><strong>Dirección:</strong> 
                        <a id="direccion-link" href="#" style="color: #1a73e8; text-decoration: underline; cursor: pointer;" title="Ver ubicación en el mapa">
                            ${direccion}
                        </a>
                    </p>
                    ${fotoFachada ? `<div style="text-align: center; margin-top: 15px;">
                        <button id="download-foto-btn" style="background-color: #28a745; color: white; border: none; padding: 8px; border-radius: 50%; cursor: pointer; font-size: 14px; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; margin: 0 auto;" title="Descargar Foto de Fachada">
                            <i class="bi bi-download"></i>
                        </button>
                    </div>` : ''}
                </div>
            </div>
        `;

        const clientName = [
            client.Name.FirstName,
            client.Name.SecondName,
            client.LastName.FatherLastName,
            client.LastName.MotherLastName
        ].filter(Boolean).join(' ');

        mainModalInstance = Swal.fire({
            html: clientInfoHTML,
            showCloseButton: true,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            cancelButtonColor: '#404040',
            background: '#ededed',
            width: 400,
            padding: '2em',
            didOpen: () => {
                // Agregar evento de clic al botón de descarga
                const downloadBtn = document.getElementById('download-foto-btn');
                if (downloadBtn && fotoFachada) {
                    downloadBtn.addEventListener('click', () => {
                        handleDownloadFotoFachada(fotoFachada, clientName);
                    });
                }
                
                // Agregar evento de clic al enlace de la dirección
                const direccionLink = document.getElementById('direccion-link');
                if (direccionLink) {
                    direccionLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        showClientMap(client, direccion);
                    });
                }
            }
        });
    };

    // Función para cambiar color
    const handleColorChange = (box, color) => {
        setBoxColors(prev => ({ ...prev, [box]: color }));
    };

    // Función para descargar la foto de fachada
    const handleDownloadFotoFachada = async (url, clientName) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
            // Usar el nombre del cliente como nombre del archivo
            const fileName = `Foto_Fachada_${clientName.replace(/\s+/g, '_')}.${url.split('.').pop()}`;
            link.download = fileName;
            
            link.click();
            
            // Limpia la URL para evitar problemas de memoria
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error al descargar la foto:', error);
        }
    };

    // Función para mostrar el mapa del cliente con prevención de cierre del modal principal
    const showClientMap = (client, direccion) => {
        const clientName = [
            client.Name.FirstName,
            client.Name.SecondName,
            client.LastName.FatherLastName,
            client.LastName.MotherLastName
        ].filter(Boolean).join(' ');

        // HTML del modal con información detallada y contenedor del mapa
        const mapHTML = `
            <div style="padding: 0;">
                <h5 style="margin-bottom: 20px; color: #333; text-align: center;">
                    <i class="bi bi-geo-alt-fill text-primary me-2"></i>
                    Ubicación de ${clientName}
                </h5>
                <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
                    <strong>Dirección:</strong> ${[
                        client.Location?.Address,
                        client.Location?.Cologne, 
                        client.Location?.Municipality,
                        client.Location?.State,
                        client.Location?.ZIP,
                        client.Location?.OutNumber ? `#${client.Location.OutNumber}` : null,
                        client.Location?.InNumber ? `Int. ${client.Location.InNumber}` : null
                    ].filter(Boolean).join(', ')}
                </div>
                <div id="map-container-home-${Date.now()}" style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;"></div>
            </div>
        `;

        const uniqueContainerId = `map-container-home-${Date.now()}`;
        const finalMapHTML = mapHTML.replace(`map-container-home-${Date.now()}`, uniqueContainerId);

        // Usar una implementación manual de modal para evitar conflictos con SweetAlert2
        const modalOverlay = document.createElement('div');
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 8px;
            width: 700px;
            max-width: 90vw;
            max-height: 90vh;
            overflow: auto;
            position: relative;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        `;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #999;
            z-index: 1;
            line-height: 1;
        `;

        const downloadButton = document.createElement('button');
        downloadButton.innerHTML = '<i class="bi bi-download"></i>';
        downloadButton.title = 'Descargar mapa';
        downloadButton.style.cssText = `
            position: absolute;
            top: 15px;
            right: 60px;
            background-color: #28a745;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        downloadButton.addEventListener('mouseover', () => {
            downloadButton.style.backgroundColor = '#218838';
        });

        downloadButton.addEventListener('mouseout', () => {
            downloadButton.style.backgroundColor = '#28a745';
        });

        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = `
            padding: 2em;
        `;
        contentDiv.innerHTML = finalMapHTML;

        modalContent.appendChild(closeButton);
        modalContent.appendChild(downloadButton);
        modalContent.appendChild(contentDiv);
        modalOverlay.appendChild(modalContent);

        // Función para descargar el mapa como imagen usando Google Maps Static API con zoom dinámico
        const downloadMapImage = async () => {
            try {
                // Obtener coordenadas del cliente
                let lat = client.Location?.Latitude || 19.4326;
                let lng = client.Location?.Length || -99.1332;
                
                // Variables para almacenar el estado actual del mapa
                let currentZoom = 15;
                let currentCenter = { lat, lng };

                // Intentar obtener el estado actual del mapa interactivo
                const mapContainer = document.getElementById(uniqueContainerId);
                if (mapContainer && window.currentMapInstance) {
                    try {
                        const mapInstance = window.currentMapInstance;
                        
                        if (mapInstance && typeof mapInstance.getZoom === 'function') {
                            currentZoom = Math.round(mapInstance.getZoom()) || 15;
                            const center = mapInstance.getCenter();
                            if (center) {
                                if (typeof center.lat === 'function') {
                                    currentCenter = {
                                        lat: center.lat(),
                                        lng: center.lng()
                                    };
                                } else if (center.lat && center.lng) {
                                    currentCenter = {
                                        lat: center.lat,
                                        lng: center.lng
                                    };
                                }
                            }
                            console.log('Estado del mapa obtenido exitosamente:', { zoom: currentZoom, center: currentCenter });
                        } else {
                            console.log('Métodos del mapa no disponibles, usando valores por defecto');
                        }
                    } catch (mapError) {
                        console.log('Error al obtener el estado del mapa:', mapError);
                        // Intentar obtener zoom del DOM si está disponible
                        const zoomButtons = mapContainer.querySelectorAll('[jsaction*="zoom"]');
                        if (zoomButtons.length > 0) {
                            console.log('Intentando obtener zoom del DOM...');
                        }
                    }
                } else {
                    console.log('Contenedor del mapa o instancia no encontrados, usando valores por defecto');
                }

                // Si no tiene coordenadas válidas, usar geocodificación
                if (!client.Location?.Latitude || !client.Location?.Length || 
                    client.Location.Latitude === 0 || client.Location.Length === 0) {
                    
                    const addressParts = [
                        client.Location?.Address,
                        client.Location?.Cologne,
                        client.Location?.Municipality,
                        client.Location?.State,
                        client.Location?.ZIP
                    ].filter(Boolean);

                    const fullAddress = addressParts.join(', ');
                    
                    if (fullAddress && window.google && window.google.maps) {
                        const geocoder = new google.maps.Geocoder();
                        
                        await new Promise((resolve) => {
                            geocoder.geocode({ address: fullAddress }, (results, status) => {
                                if (status === 'OK' && results[0]) {
                                    const location = results[0].geometry.location;
                                    lat = location.lat();
                                    lng = location.lng();
                                    // Si no se obtuvo el centro del mapa, usar las coordenadas geocodificadas
                                    if (currentCenter.lat === 19.4326 && currentCenter.lng === -99.1332) {
                                        currentCenter = { lat, lng };
                                    }
                                }
                                resolve();
                            });
                        });
                    }
                }

                // Usar Google Maps Static API para generar la imagen con el zoom actual
                const apiKey = import.meta.env.VITE_GOOGLE_MAP;
                const mapWidth = 800;
                const mapHeight = 600;

                // URL de Google Maps Static API con zoom dinámico y centro actual del mapa
                const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?` +
                    `center=${currentCenter.lat},${currentCenter.lng}&` +
                    `zoom=${currentZoom}&` +
                    `size=${mapWidth}x${mapHeight}&` +
                    `scale=2&` + // Para mayor resolución
                    `maptype=roadmap&` +
                    `markers=color:red%7Clabel:●%7C${lat},${lng}&` + // Marcador rojo en la ubicación original
                    `style=feature:poi%7Cvisibility:simplified&` + // Estilo simplificado
                    `key=${apiKey}`;

                console.log('Generando mapa con:', { zoom: currentZoom, center: currentCenter, markerAt: { lat, lng } });

                // Crear un canvas para agregar información adicional
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Configurar tamaño del canvas
                canvas.width = mapWidth * 2; // Scale 2 para mayor resolución
                canvas.height = (mapHeight * 2) + 120; // Espacio extra para información
                
                // Cargar la imagen del mapa
                const mapImage = new Image();
                mapImage.crossOrigin = 'anonymous';
                
                await new Promise((resolve, reject) => {
                    mapImage.onload = () => {
                        // Fondo blanco
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        
                        // Dibujar el mapa
                        ctx.drawImage(mapImage, 0, 100, mapWidth * 2, mapHeight * 2);
                        
                        // Agregar información del cliente
                        ctx.fillStyle = '#333333';
                        ctx.font = 'bold 24px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText(`Ubicación de ${clientName}`, canvas.width / 2, 40);
                        
                        // Agregar dirección
                        ctx.font = '18px Arial';
                        ctx.fillStyle = '#666666';
                        const direccionTexto = [
                            client.Location?.Address,
                            client.Location?.Cologne, 
                            client.Location?.Municipality,
                            client.Location?.State,
                            client.Location?.ZIP
                        ].filter(Boolean).join(', ');
                        
                        ctx.fillText(direccionTexto, canvas.width / 2, 70);
                        
                        // Agregar información de zoom y fecha
                        ctx.font = '14px Arial';
                        ctx.fillStyle = '#999999';
                        const fecha = new Date().toLocaleDateString('es-MX');
                        ctx.fillText(`Zoom: ${currentZoom} | Generado el ${fecha}`, canvas.width / 2, canvas.height - 20);
                        
                        resolve();
                    };
                    
                    mapImage.onerror = () => {
                        reject(new Error('Error al cargar el mapa'));
                    };
                    
                    mapImage.src = staticMapUrl;
                });

                // Crear enlace de descarga
                const link = document.createElement('a');
                link.download = `mapa_${clientName.replace(/\s+/g, '_')}_zoom${currentZoom}_${new Date().toISOString().slice(0, 10)}.png`;
                link.href = canvas.toDataURL('image/png', 1.0);
                
                // Simular clic para descargar
                link.click();
                
                // Mostrar mensaje de éxito
                const successMsg = document.createElement('div');
                successMsg.innerHTML = `¡Mapa descargado con zoom ${currentZoom}!`;
                successMsg.style.cssText = `
                    position: absolute;
                    top: 60px;
                    right: 20px;
                    background-color: #28a745;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 5px;
                    font-size: 14px;
                    z-index: 2;
                    opacity: 1;
                    transition: opacity 0.5s;
                `;
                
                modalContent.appendChild(successMsg);
                
                // Ocultar mensaje después de 3 segundos
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                    setTimeout(() => {
                        if (modalContent.contains(successMsg)) {
                            modalContent.removeChild(successMsg);
                        }
                    }, 500);
                }, 3000);

            } catch (error) {
                console.error('Error al descargar el mapa:', error);
                
                // Mostrar mensaje de error
                const errorMsg = document.createElement('div');
                errorMsg.innerHTML = 'Error al descargar el mapa';
                errorMsg.style.cssText = `
                    position: absolute;
                    top: 60px;
                    right: 20px;
                    background-color: #dc3545;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 5px;
                    font-size: 14px;
                    z-index: 2;
                    opacity: 1;
                    transition: opacity 0.5s;
                `;
                
                modalContent.appendChild(errorMsg);
                
                setTimeout(() => {
                    errorMsg.style.opacity = '0';
                    setTimeout(() => {
                        if (modalContent.contains(errorMsg)) {
                            modalContent.removeChild(errorMsg);
                        }
                    }, 500);
                }, 3000);
            }
        };

        // Función para cerrar el modal del mapa
        const closeMapModal = () => {
            document.body.removeChild(modalOverlay);
        };

        // Agregar eventos de cierre y descarga
        closeButton.addEventListener('click', closeMapModal);
        downloadButton.addEventListener('click', downloadMapImage);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeMapModal();
            }
        });

        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeMapModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Agregar el modal al DOM
        document.body.appendChild(modalOverlay);

        // Cargar el mapa después de que el modal esté en el DOM
        setTimeout(async () => {
            const containerElement = document.getElementById(uniqueContainerId);
            if (containerElement) {
                try {
                    // Importar dinámicamente React y ReactDOM
                    const [React, ReactDOM, MapGoogle] = await Promise.all([
                        import('react'),
                        import('react-dom/client'),
                        import('../fragments/maps/Map.fragment')
                    ]);

                    // Determinar la posición inicial del marcador
                    let position = {
                        lat: client.Location?.Latitude || 19.4326,
                        lng: client.Location?.Length || -99.1332
                    };

                    // Función para renderizar el mapa y almacenar referencia
                    const renderMap = (pos) => {
                        const root = ReactDOM.createRoot(containerElement);
                        
                        // Crear el elemento del mapa con callback para obtener la referencia
                        const MapComponent = React.createElement(MapGoogle.default, { 
                            position: pos,
                            onMapLoad: (mapInstance) => {
                                // Almacenar la referencia del mapa para acceso posterior
                                window.currentMapInstance = mapInstance;
                                // También almacenar en el contenedor para fácil acceso
                                if (containerElement) {
                                    containerElement._mapInstance = mapInstance;
                                }
                            }
                        });
                        
                        root.render(MapComponent);
                    };

                    // Si no tiene coordenadas válidas, intentar geocodificación como en ClientLocation
                    if ((!client.Location?.Latitude || !client.Location?.Length || 
                         client.Location.Latitude === 0 || client.Location.Length === 0)) {
                        
                        // Geocodificación usando la misma lógica que ClientLocation
                        const geocodeAddress = () => {
                            try {
                                const addressParts = [
                                    client.Location?.Address,
                                    client.Location?.Cologne,
                                    client.Location?.Municipality,
                                    client.Location?.State,
                                    client.Location?.ZIP
                                ].filter(Boolean);

                                const fullAddress = addressParts.join(', ');
                                
                                if (fullAddress && window.google && window.google.maps) {
                                    const geocoder = new google.maps.Geocoder();
                                    
                                    geocoder.geocode({ address: fullAddress }, (results, status) => {
                                        if (status === 'OK' && results[0]) {
                                            const location = results[0].geometry.location;
                                            const newPosition = {
                                                lat: location.lat(),
                                                lng: location.lng()
                                            };
                                            renderMap(newPosition);
                                        } else {
                                            console.log('Error en geocodificación:', status);
                                            renderMap(position);
                                        }
                                    });
                                } else {
                                    renderMap(position);
                                }
                            } catch (error) {
                                console.error('Error al geocodificar:', error);
                                renderMap(position);
                            }
                        };

                        // Verificar si Google Maps está disponible
                        if (window.google && window.google.maps) {
                            geocodeAddress();
                        } else {
                            renderMap(position);
                        }
                    } else {
                        // Si tiene coordenadas válidas, usarlas directamente
                        renderMap(position);
                    }

                } catch (error) {
                    console.error('Error al cargar el componente de mapa:', error);
                    containerElement.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 400px; color: #6c757d; background-color: #f8f9fa; border-radius: 8px;">
                            <i class="bi bi-geo-alt" style="font-size: 48px; margin-bottom: 15px;"></i>
                            <p style="margin: 0; font-size: 16px;">Error al cargar el mapa</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #999;">Intenta nuevamente más tarde</p>
                        </div>
                    `;
                }
            }
        }, 100);
    };

    // Función para obtener la foto de fachada de un cliente
    const getFotoFachada = async (clientId) => {
        try {
            const documents = await makeRequest(`/document/all/${clientId}`);
            const fotoFachada = documents.find(doc => doc.Description === 'Foto de Fachada');
            return fotoFachada ? fotoFachada.Document : null;
        } catch (error) {
            console.log('Error obteniendo foto de fachada:', error);
            return null;
        }
    };

    // Función para cargar todas las fotos de fachada
    const loadFotosFachada = async (clientsList) => {
        const documentsMap = {};
        for (const client of clientsList) {
            const fotoFachada = await getFotoFachada(client._id);
            documentsMap[client._id] = fotoFachada;
        }
        setClientDocuments(documentsMap);
    };

    useEffect(() => {
        const loginSuccess = sessionStorage.getItem('loginSuccess');

        if (loginSuccess) {
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión correctamente.',
                position: 'top',
                timer: 1200,
                showConfirmButton: false,
                toast: true,
                timerProgressBar: true,
            });

            sessionStorage.removeItem('loginSuccess');
        }

        // Obtener el nombre del usuario logueado
        const storedUserName = sessionStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }

        const fetchTickets = async () => {
            try {
                const res = await makeRequest('/ticket/all');
                setTickets(res || [])
            } catch (error) {
                console.log(error);
            }
        };

        const fetchClients = async () => {
            try {
                const res = await makeRequest('/client/all');
                setClients(res || []);
                // Cargar fotos de fachada después de obtener los clientes
                if (res && res.length > 0) {
                    await loadFotosFachada(res);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchTickets();
        fetchClients();
    }, []);

    const pendientes = tickets.filter(
        t => t.Status === 'En espera'
    );

    // Ordenar todos los clientes de reciente a antiguo
    const todosLosClientes = clients
        .filter(client => client.CreateDate) // Solo clientes con fecha válida
        .sort((a, b) => new Date(b.CreateDate) - new Date(a.CreateDate));

    return (
        <div className="content mt-3" style={{ marginLeft: '70px' }}>
            {/* Primera fila */}
            <div className="dashboard-row" style={{ minHeight: '250px' }}>
                <div className="dashboard-card" style={{ background: boxColors.clientes }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="border-bottom">Clientes</h5>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {todosLosClientes.length === 0 ? (
                            <span className="text-muted">No hay clientes registrados</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {(showAllClients ? todosLosClientes : todosLosClientes.slice(0, 8)).map(client => (
                                    <li
                                        key={client._id}
                                        className="list-group-item py-1 px-2"
                                        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', cursor: 'pointer' }}
                                        onClick={() => handleShowClientDetails(client)}
                                        title="Ver detalles del cliente"
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>
                                                    <i className="bi bi-person-fill text-info me-1"></i>
                                                    {[
                                                        client.Name.FirstName,
                                                        client.Name.SecondName,
                                                        client.LastName.FatherLastName,
                                                        client.LastName.MotherLastName
                                                    ].filter(Boolean).join(' ').toUpperCase()}
                                                </strong>
                                                <br />
                                                <small className="text-muted">{client.CreateDate ? new Date(client.CreateDate).toLocaleDateString('es-ES') : 'Sin fecha'}</small>
                                            </div>
                                            {(() => {
                                                // Calcular si es cliente nuevo (últimos 30 días)
                                                if (!client.CreateDate) return <span className="badge bg-secondary">Sin fecha</span>;
                                                const fechaRegistro = new Date(client.CreateDate);
                                                const fechaActual = new Date();
                                                const diasDiferencia = (fechaActual - fechaRegistro) / (1000 * 60 * 60 * 24);
                                                
                                                if (diasDiferencia <= 30) {
                                                    return <span className="badge bg-success">Nuevo</span>;
                                                } else {
                                                    return <span className="badge bg-info">Cliente</span>;
                                                }
                                            })()}
                                        </div>
                                    </li>
                                ))}
                                {todosLosClientes.length > 8 && (
                                    <li className="list-group-item py-1 px-2 text-center">
                                        <button
                                            className="btn btn-link btn-sm p-0 text-decoration-none"
                                            onClick={() => setShowAllClients(!showAllClients)}
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            {showAllClients ? (
                                                <>
                                                    <i className="bi bi-chevron-up me-1"></i>
                                                    Mostrar menos
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-chevron-down me-1"></i>
                                                    +{todosLosClientes.length - 8} clientes más...
                                                </>
                                            )}
                                        </button>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="dashboard-card" style={{ background: boxColors.admins }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="border-bottom">Administradores Activos</h5>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {userName ? (
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item py-1 px-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{userName}</strong>
                                            <br />
                                            <small className="text-muted">Usuario administrador</small>
                                        </div>
                                        <span className="badge bg-success">Activo</span>
                                    </div>
                                </li>
                            </ul>
                        ) : (
                            <span className="text-muted">No hay usuario logueado</span>
                        )}
                    </div>
                </div>
                <div className="dashboard-card" style={{ background: boxColors.red, flex: '2 1 400px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Estado de Red</h6>
                    </div>
                    <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                        <EstadoRedResumen />
                    </div>
                </div>
                <div className="dashboard-card" style={{ background: boxColors.errores, flex: '1 1 200px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="border-bottom">Registro de Errores</h5>
                    </div>
                    <ErrorDisplay />
                </div>
            </div>

            {/* Segunda fila */}
            <div className="dashboard-row" style={{ minHeight: '250px' }}>
                <div className="dashboard-card" style={{ background: boxColors.radio }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Radio Frecuencia - Paquetes</h6>
                    </div>
                    <p>Total de Clientes: </p>
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                        <RadioChart />
                    </div>
                </div>
                <div className="dashboard-card" style={{ background: boxColors.fibra }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Fibra Optica - Paquetes</h6>
                    </div>
                    <p>Total de Clientes: </p>
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                        <FibraChart />
                    </div>
                </div>
                <div className="dashboard-card dashboard-table" style={{ background: boxColors.tickets }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Tickets</h6>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {tickets.length === 0 ? (
                            <span className="text-muted">No hay tickets registrados</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {(showAllTicketsState ? tickets : tickets.slice(0, 8)).map(ticket => (
                                    <li
                                        key={ticket._id}
                                        className="list-group-item py-1 px-2"
                                        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', cursor: 'pointer' }}
                                        title="Ver detalles del ticket"
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>
                                                    <i className="bi bi-ticket-detailed text-primary me-1"></i>
                                                    {ticket.Folio}
                                                </strong>
                                                <br />
                                                <small className="text-muted">{ticket.Issue}</small>
                                            </div>
                                            <span className={`badge ${ticket.Status === 'Resuelto' ? 'bg-success' :
                                                    ticket.Status === 'En espera' ? 'bg-warning text-dark' :
                                                        ticket.Status === 'En proceso' ? 'bg-info text-dark' :
                                                            'bg-secondary'
                                                }`}>
                                                {ticket.Status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                                {tickets.length > 8 && (
                                    <li className="list-group-item py-1 px-2 text-center">
                                        <button
                                            className="btn btn-link btn-sm p-0 text-decoration-none"
                                            onClick={() => setShowAllTicketsState(!showAllTicketsState)}
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            {showAllTicketsState ? (
                                                <>
                                                    <i className="bi bi-chevron-up me-1"></i>
                                                    Mostrar menos
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-chevron-down me-1"></i>
                                                    +{tickets.length - 8} tickets más...
                                                </>
                                            )}
                                        </button>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="dashboard-card dashboard-table" style={{ background: boxColors.pendientes }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="border-bottom">Tickets Pendientes</h6>
                    </div>
                    <div className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: 200 }}>
                        {pendientes.length === 0 ? (
                            <span className="text-muted">Sin tickets pendientes</span>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {pendientes.slice(0, 8).map(ticket => (
                                    <li
                                        key={ticket._id}
                                        className="list-group-item py-1 px-2"
                                        style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', cursor: 'pointer' }}
                                        title="Ver detalles del ticket pendiente"
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>
                                                    <i className="bi bi-hourglass-split text-warning me-1"></i>
                                                    {ticket.Folio}
                                                </strong>
                                                <br />
                                                <small className="text-muted">{ticket.Issue}</small>
                                            </div>
                                            <span className="badge bg-warning text-dark">{ticket.Status}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeComponent;
