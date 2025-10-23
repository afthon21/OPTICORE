import MapGoogle from "../../fragments/maps/Map.fragment";

import { useState, useEffect } from "react";


function ClientLocation({ client }) {
    const [marker, setMarker] = useState({
        lat: client?.Location?.Latitude ?? 19.4326, // Ciudad de México por defecto
        lng: client?.Location?.Length ?? -99.1332
    });

    const [mapsAvailable, setMapsAvailable] = useState(false);

    useEffect(() => {
        // Verificar si Google Maps está disponible y configurado
        const googleMapsKey = import.meta.env.VITE_GOOGLE_MAP;
        
        if (!googleMapsKey) {
            console.log('🗺️ Google Maps deshabilitado - no hay API key configurada');
            setMapsAvailable(false);
            return;
        }

        console.log('🗺️ Google Maps habilitado con API key:', googleMapsKey.substring(0, 10) + '...');
        setMapsAvailable(true);

        // Si ya tiene coordenadas válidas, usarlas
        if (client?.Location?.Latitude && client?.Location?.Length && 
            client.Location.Latitude !== 0 && client.Location.Length !== 0) {
            setMarker({
                lat: client.Location.Latitude,
                lng: client.Location.Length
            });
            return;
        }

        // Si no tiene coordenadas, usar geocodificación con la dirección
        const geocodeAddress = async () => {
            try {
                // Construir la dirección completa
                const addressParts = [
                    client.Location.Address,
                    client.Location.Cologne,
                    client.Location.Municipality,
                    client.Location.State,
                    client.Location.ZIP
                ].filter(Boolean);

                const fullAddress = addressParts.join(', ');
                
                if (!fullAddress) {
                    console.log('No hay dirección disponible para geocodificar');
                    return;
                }

                console.log('Geocodificando dirección:', fullAddress);

                // Usar la API de geocodificación de Google
                const geocoder = new window.google.maps.Geocoder();

                geocoder.geocode({ address: fullAddress }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        const location = results[0].geometry.location;
                        const newMarker = {
                            lat: location.lat(),
                            lng: location.lng()
                        };
                        
                        console.log('Coordenadas obtenidas:', newMarker);
                        setMarker(newMarker);
                    } else {
                        console.log('Error en geocodificación:', status);
                    }
                });
            } catch (error) {
                console.error('Error al geocodificar:', error);
            }
        };

        // Verificar si Google Maps está disponible
        if (window.google && window.google.maps) {
            geocodeAddress();
        } else {
            console.log('Google Maps no está disponible');
        }
    }, [client]);

    // console.log('Marker actual:', marker); // Debug removido para reducir logs

    // Si Google Maps no está disponible, mostrar información alternativa
    if (!mapsAvailable) {
        return (
            <div style={{ 
                padding: "20px", 
                margin: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
                textAlign: "center"
            }}>
                <h5>📍 Ubicación del Cliente</h5>
                <p><strong>Dirección:</strong> {client.Location.Address}</p>
                <p><strong>Colonia:</strong> {client.Location.Cologne}</p>
                <p><strong>Municipio:</strong> {client.Location.Municipality}</p>
                <p><strong>Estado:</strong> {client.Location.State}</p>
                <p><strong>CP:</strong> {client.Location.ZIP}</p>
                <small className="text-muted">Google Maps no disponible</small>
            </div>
        );
    }



    return (
        <div style={{ 
            padding: "0px", 
            margin: "0px"
        }}>
            <MapGoogle position={marker}/>
        </div>
    );
}

export default ClientLocation