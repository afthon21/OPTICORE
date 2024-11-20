import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { APIProvider,Map,Pin, Marker } from "@vis.gl/react-google-maps";

function MapGoogle({ zoom, marker}) {
    const API_KEY = ''
    
    return (
        <APIProvider apiKey={API_KEY}>
            <div style={{width: "100%", height: "400px"}}>
                <Map zoom={zoom} center={marker}>
                    <Marker position={marker}/>
                </Map>
            </div>
        </APIProvider>
    );
}

export default MapGoogle;
