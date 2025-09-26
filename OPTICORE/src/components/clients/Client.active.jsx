import PropTypes from 'prop-types';

function ClientActive({ client }) {
    if (!client) return <p>Seleccione un cliente.</p>;
    return (
        <div>
            <h5>Estado del cliente</h5>
            <span className={`badge ${client.Status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                {client.Status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
            </span>
        </div>
    );
}

export default ClientActive;

ClientActive.propTypes = {
    client: PropTypes.shape({
        Status: PropTypes.string
    })
};