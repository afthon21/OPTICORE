import MapGoogle from "../../fragments/maps/Map.fragment";

import ApiRequest from "../../hooks/apiRequest";
import { useState, useEffect } from "react";

function ClientLocation({ client }) {
    const [marker, setMarker] = useState({
        lat: client.Location.Latitude || 19.4326, // Ciudad de México por defecto
        lng: client.Location.Length || -99.1332
    });

    useEffect(() => {
        // Si ya tiene coordenadas válidas, usarlas
        if (client.Location.Latitude && client.Location.Length && 
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
                const geocoder = new google.maps.Geocoder();
                
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

    console.log('Marker actual:', marker);

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