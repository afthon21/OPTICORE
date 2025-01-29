import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { APIProvider,Map,Pin, Marker } from "@vis.gl/react-google-maps";

function MapGoogle() {
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

    return (
        <APIProvider apiKey={API_KEY} onLoad={() => console.log('Map has loaded')}>
            <div style={{width: "100%", height: "400px"}}>
                <Map defaultZoom={8} defaultCenter={{lat: 19.419444444444, lng: -99.145555555556}}>
                    
                </Map>
            </div>
        </APIProvider>
    );
}

export default MapGoogle;
