import LoginComponent from '../login/Login.component.jsx'
import RegisterComponent from '../register/Register.component.jsx';

function StartComponent() {
    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-start bg-light text-center pt-5">
                <div className="mb-5">
                    <h1 className="display-3 text-primary fw-bold">optifiberx</h1>
                </div>

                <div className="mb-5">
                    <h2 className="h3 mb-4 fw-semibold text-secondary">¡Bienvenido a OptiFiberX!</h2>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        OptiFiberX, la solución integral para optimizar tus redes. Inicia
                        sesión con tus credenciales o regístrate para descubrir nuestras herramientas avanzadas.
                    </p>
                </div>
            </div>

            <div className="w-100 d-flex flex-column align-items-center">
                <button className="btn btn-primary btn-lg w-50 mb-4" data-bs-toggle="modal" data-bs-target="#loginModal">Iniciar Sesión</button>
                <button className="btn btn-secondary btn-lg w-50" data-bs-toggle="modal" data-bs-target="#registerModal">Regístrate</button>
            </div>

            <LoginComponent />
            <RegisterComponent />
        </>
    );
}

export default StartComponent;