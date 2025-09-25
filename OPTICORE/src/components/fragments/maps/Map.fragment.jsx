import { APIProvider, Map, Pin, AdvancedMarker } from "@vis.gl/react-google-maps";

import { useState, useEffect } from "react";

function MapGoogle({ position, onMapLoad }) {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAP;
    const mapId = import.meta.env.VITE_MAP_ID;

    const [location, setLocation] = useState({lat: 0, lng:0});
    const [marker, setMarker] = useState({lat: 0, lng:0});
    const [forceCenter, setForceCenter] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);

    useEffect(() => {
        if (position && position.lat && position.lng) {
            setLocation({ lat: position.lat, lng: position.lng });
            setMarker({ lat: position.lat, lng: position.lng })
            setForceCenter(true);
        }
    }, [position]);

    const handleMapMove = () => {
        setForceCenter(false); // Permite mover el mapa sin que vuelva a centrarse
    };

    const handleMapLoad = (map) => {
        setMapInstance(map);
        setForceCenter(false);
        
        // Almacenar la referencia del mapa globalmente para acceso desde la descarga
        window.currentMapInstance = map;
        
        // Llamar al callback si se proporciona
        if (onMapLoad && typeof onMapLoad === 'function') {
            onMapLoad(map);
        }
    };

    const handleZoomChanged = (map) => {
        // Actualizar la referencia global cuando cambie el zoom
        window.currentMapInstance = map;
        setMapInstance(map);
    };

    const handleCenterChanged = (map) => {
        // Actualizar la referencia global cuando cambie el centro
        window.currentMapInstance = map;
        setMapInstance(map);
    };

    return (
        <APIProvider apiKey={API_KEY}>
            <div style={{ 
                width: "100%", 
                height: "400px", 
                borderRadius: "0px", 
                overflow: "hidden", 
                border: "none",
                margin: "0",
                padding: "0"
            }}>
                <Map 
                    mapId={mapId}
                    defaultZoom={15} 
                    defaultCenter={{ lat: 19.419444444444, lng: -99.145555555556 }} 
                    center={forceCenter ? location : undefined}
                    onLoad={handleMapLoad}
                    onZoomChanged={() => handleZoomChanged(window.currentMapInstance)}
                    onCenterChanged={() => handleCenterChanged(window.currentMapInstance)}
                    onDrag={handleMapMove}
                    onIdle={handleMapMove}>
                    {marker && <AdvancedMarker position={marker} />}
                </Map>
            </div>
        </APIProvider>
    );
}

export default MapGoogle;