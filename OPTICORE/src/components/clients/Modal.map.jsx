import styleModal from '../clients/css/clientModalMap.module.css'

import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function ModalGoogleMap({ center, handleMarker }) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAP;
    const mapId = import.meta.env.VITE_MAP_ID;
    const defaultCenter = { lat: 19.419444444444, lng: -99.145555555556 };
    const [location, setLocation] = useState({ lat: 0, lng: 0});
    const [forceCenter, setForceCenter] = useState(false);
    const [marker, setMarker] = useState({ lat: 0, lng: 0});

    useEffect(() => {
        if (center && center.lat && center.lng) {
            setLocation({ lat: center.lat, lng: center.lng });
            setForceCenter(true);
        }
    }, [center]);

    const handleMapMove = () => {
        setForceCenter(false); // Permite mover el mapa sin que vuelva a centrarse
    };

    const handleMapClick = (e) => {
        setMarker({
            lat: e.detail.latLng.lat,
            lng: e.detail.latLng.lng
        });
    }

    const saveMarker = async ()  => {
        const confirm = await Swal.fire({
            icon: 'warning',
            title: '¿Esta seguro?',
            text: '¿Esta seguro de colocar el marcador en esa posición?',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2a9d8f',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#404040',
            toast: true,
            position: 'top'
        });

        if(confirm.isConfirmed) {
            handleMarker(marker);

            Swal.fire({
                icon: 'success',
                title: 'Guardado',
                text: 'Marcador colocado',
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true,
                toast: true,
                position: 'top'
            })
        }
    }

    return (
        <div className="modal fade" id="GoogleMapModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="ModalLabel">Colocar Marcador</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <APIProvider apiKey={apiKey}>
                            <div style={{ width: "100%", height: "400px" }}>
                                <Map
                                    defaultZoom={15}
                                    mapId={mapId}
                                    defaultCenter={defaultCenter}
                                    center={forceCenter ? location : undefined}
                                    onLoad={() => setForceCenter(false)}
                                    onDrag={handleMapMove}
                                    onIdle={handleMapMove}
                                    onClick={handleMapClick} />
                                {marker && <AdvancedMarker position={marker} />}
                            </div>
                        </APIProvider>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className={styleModal['btn-close']} data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" className={styleModal['btn-submit']} onClick={saveMarker}>Colocar marcador</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalGoogleMap;
