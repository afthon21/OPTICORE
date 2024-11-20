import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { NavbarFragmentAll } from '../fragments/Navbar.fragment';
import CardCreateClient from './Create.card';

function CreateClient() {
    return (
        <>
            <NavbarFragmentAll />

            <div className="d-flex container-fluid justify-content-center mt-4">
                <CardCreateClient />
            </div>
        </>
    );
}

export default CreateClient;