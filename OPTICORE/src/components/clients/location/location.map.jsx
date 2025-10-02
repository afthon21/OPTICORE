import MapGoogle from "../../fragments/maps/Map.fragment";
import PropTypes from 'prop-types';

function ClientLocation({ client }) {
    // Mostrar mensaje si no hay cliente seleccionado
    if (!client) {
        return <p>Seleccione un cliente para ver su ubicación.</p>;
    }

    const marker = {
        lat: client.Location.Latitude,
        lng: client.Location.Length
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

export default ClientLocation;

ClientLocation.propTypes = {
    client: PropTypes.shape({
        Location: PropTypes.shape({
            Latitude: PropTypes.number,
            Length: PropTypes.number
        })
    })
};