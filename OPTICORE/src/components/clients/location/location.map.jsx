import MapGoogle from "../../fragments/maps/Map.fragment";

import ApiRequest from "../../hooks/apiRequest";
import { useState } from "react";

function ClientLocation({ client }) {
    const marker = {
        lat: client.Location.Latitude,
        lng: client.Location.Length
    }

    console.log(marker)

    return (
        <MapGoogle position={marker}/>
    );
}

export default ClientLocation