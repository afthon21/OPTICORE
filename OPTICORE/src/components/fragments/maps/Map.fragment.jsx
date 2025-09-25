import { APIProvider, Map, Pin, AdvancedMarker } from "@vis.gl/react-google-maps";

import { useState, useEffect } from "react";

function MapGoogle({ position }) {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAP;
    const mapId = import.meta.env.VITE_MAP_ID;

    const [location, setLocation] = useState({lat: 0, lng:0});
    const [marker, setMarker] = useState({lat: 0, lng:0});
    const [forceCenter, setForceCenter] = useState(false);

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
                    onLoad={() => setForceCenter(false)}
                    onDrag={handleMapMove}
                    onIdle={handleMapMove}>
                    {marker && <AdvancedMarker position={marker} />}
                </Map>
            </div>
        </APIProvider>
    );
}

export default MapGoogle;