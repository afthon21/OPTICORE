import { useRegion } from '../../hooks/RegionContext';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Mapa() {
    const { region } = useRegion();
    const [mapaData, setMapaData] = useState([]);

     useEffect(() => {
        fetch(`/api/mapa?region=${region}`)
            .then(res => res.json())
            .then(data => setMapaData(data));
    }, [region]);
       const defaultCenter = [19.3587, -99.7060];
        const noData = !mapaData || mapaData.length === 0;

    return (
        <div>
            <h2>Mapa de Fibra Óptica</h2>
            <p>Este es el componente del Mapa.</p>
            <div style={{
    border: "2px solid #1976d2",
    borderRadius: "12px",
    padding: "16px",
    background: "#f5f5f5",
    maxWidth: "700px",
    margin: "32px auto",
    minHeight: "500px" // <-- Agrega esto
}}>
    
    <h2 style={{ textAlign: "center" }}>Mapa de Fibra Óptica - {region}</h2>
    <div style={{ minHeight: "400px", position: "relative" }}></div>
          {noData && (
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "rgba(255, 255, 255, 0.8)",
                        padding: "24px",
                        borderRadius: "8px",
                        textAlign: "center",
                        zIndex: 1000
                    }}>
                        No hay nodos para mostrar en esta región.
                    </div>
                )}
            </div>
        </div>
    );
}   

export default Mapa;
