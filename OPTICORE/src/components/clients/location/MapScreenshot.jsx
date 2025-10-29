import { FaMapMarkerAlt } from "react-icons/fa";

function MapScreenshot({ client }) {

    return (
        <div 
            data-component="map-screenshot"
            style={{
                padding: '0',
                backgroundColor: 'transparent',
                margin: '0'
            }}>

            <div 
                id="map-preview-area"
                style={{
                    height: '400px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '10px',
                    border: '2px solid #94a3b8',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundImage: `
                        linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                }}>
                {/* Calles principales simuladas */}
                <div style={{
                    position: 'absolute',
                    top: '30%',
                    left: '0',
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#64748b',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '70%',
                    left: '0',
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#64748b'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '25%',
                    width: '6px',
                    height: '100%',
                    backgroundColor: '#64748b'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '75%',
                    width: '6px',
                    height: '100%',
                    backgroundColor: '#64748b'
                }} />
                
                {/* Edificios/Areas simuladas */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '12%',
                    height: '15%',
                    backgroundColor: '#e2e8f0',
                    border: '1px solid #cbd5e1',
                    borderRadius: '3px'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    right: '15%',
                    width: '8%',
                    height: '12%',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '15%',
                    width: '10%',
                    height: '10%',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '50%'
                }} />
                
                {/* Nombres de calles */}
                <div style={{
                    position: 'absolute',
                    top: '28%',
                    left: '5px',
                    fontSize: '11px',
                    color: '#475569',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                }}>
                    C. Popocatepetl
                </div>
                <div style={{
                    position: 'absolute',
                    top: '68%',
                    left: '5px',
                    fontSize: '11px',
                    color: '#475569',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                }}>
                    Av. Principal
                </div>
                
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                }}>
                    <FaMapMarkerAlt style={{
                        fontSize: '48px',
                        color: '#ea4335',
                        marginBottom: '10px',
                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                    }} />
                    <p style={{
                        margin: '0 0 8px 0',
                        fontSize: '16px',
                        color: '#1f2937',
                        fontWeight: '700',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                    }}>
                        CLIENTE AQUI
                    </p>
                    {client?.Location?.Latitude && client?.Location?.Length && (
                        <p style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#1f2937',
                            fontFamily: 'monospace',
                            fontWeight: '600',
                            textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                        }}>
                            {client.Location.Latitude}, {client.Location.Length}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MapScreenshot;