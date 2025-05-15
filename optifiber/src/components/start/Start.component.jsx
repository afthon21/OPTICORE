import LoginComponent from '../auth/login/Login.component.jsx';
import RegisterComponent from '../auth/register/Register.component.jsx';

function StartComponent() {
    return (
        <>
            {/* Fondo con degradado y centrado total */}
            <div
                className="position-absolute top-50 start-50 translate-middle w-100 text-center px-3"
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #1d2b64, #f8cdda)', // Degradado azul y rosa
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* Título */}
                <h1 className="display-2 fw-bold text-uppercase mb-4" style={{ letterSpacing: '2px' }}>
                    FIBERTRACK
                </h1>

                {/* Subtítulo */}
                <h2 className="h4 fw-semibold mb-3" style={{ color: '#f0f0f0' }}>
                    ¡Bienvenido a FiberTrack!
                </h2>

                {/* Descripción */}
                <p className="lead mb-5" style={{ maxWidth: '600px', color: '#e0e0e0' }}>
                    Con <strong>FiberTrack</strong>, optimiza y gestiona tus redes de manera fácil y eficiente. Inicia sesión con tu cuenta o regístrate ahora y accede a nuestras herramientas avanzadas diseñadas para mejorar tu experiencia.
                </p>

                {/* Botones */}
                <div className="d-flex flex-column align-items-center" style={{ width: '280px' }}>
                    <button
                        className="btn btn-light btn-lg w-100 mb-3"
                        data-bs-toggle="modal"
                        data-bs-target="#loginModal"
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        className="btn btn-outline-light btn-lg w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#registerModal"
                    >
                        Regístrate
                    </button>
                </div>
            </div>

            {/* Modales */}
            <LoginComponent />
            <RegisterComponent />
        </>
    );
}

export default StartComponent;
