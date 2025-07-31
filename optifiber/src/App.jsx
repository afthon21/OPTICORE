/** estilos globales */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './public/css/Navbar.css';
import './public/css/App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import StartComponent from './components/start/Start.component.jsx';
import HomeComponent from './components/home/Home.component.jsx';
import ProtectedRoute from './components/auth/protectedRoutes.jsx';
import ProfileComponent from './components/profile/Profile.component.jsx';
import TicketComponent from './components/tickets/Tickets.component.jsx';
import CreateTicket from './components/tickets/Create.ticket.jsx';
import ClientsComponent from './components/clients/Clients.component.jsx';
import CreateClient from './components/clients/Create.client.jsx';
import PaymentComponent from './components/payments/Payment.component.jsx';
import CreatePayment from './components/payments/Create.payment.jsx';
import ServicePackagesComponent from './components/services packages/services.component.jsx';
import CreatePackage from './components/services packages/Create.Packages.jsx';
import RecoveryPwdComponent from './components/auth/recoveryPwd/recovery.component.jsx';
import ResetPwdComponent from './components/auth/recoveryPwd/resetPwd.components.jsx';
import { NavbarFragmentAll } from './components/fragments/Navbar.fragment.jsx';
import Radiofrecuencia from './components/network/Radiofrecuencia.jsx';
import FibraOptica from './components/network/FibraOptica.jsx';

function App() {
  return (
    <BrowserRouter>
      <NavbarFragmentAll />
      <div className="container d-flex content">
        <Routes>
          <Route path='/' Component={StartComponent}></Route>
          <Route path='/home/:adminId' element={<ProtectedRoute> <HomeComponent /> </ProtectedRoute>}></Route>
          <Route path='/profile/:adminId' element={<ProtectedRoute> <ProfileComponent /> </ProtectedRoute>}></Route>
          {/* tickets rutas */}
          <Route path='/ticket/:adminId' element={<ProtectedRoute> <TicketComponent /> </ProtectedRoute>}></Route>
          <Route path='/ticket/create/:adminId' element={<ProtectedRoute> <CreateTicket /> </ProtectedRoute>}></Route>
          {/* clientes rutas */}
          <Route path='/clients/:adminId' element={<ProtectedRoute> <ClientsComponent /> </ProtectedRoute>}></Route>
          <Route path='/clients/register/:adminId' element={<ProtectedRoute> <CreateClient /> </ProtectedRoute>}></Route>
          {/* pagos rutas */}
          <Route path='/payment/:adminId' element={<ProtectedRoute> <PaymentComponent /> </ProtectedRoute>}></Route>
          <Route path='/payment/create/:adminId' element={<ProtectedRoute> <CreatePayment /> </ProtectedRoute>}></Route>
          {/* Paquetes rutas */}
          <Route path='/packageServices/:id' element={<ProtectedRoute> <ServicePackagesComponent /> </ProtectedRoute>}></Route>
          <Route path='/packageServices/create/:id' element={<ProtectedRoute> <CreatePackage /> </ProtectedRoute>}></Route>
          {/* Monitoreo de red */}
          <Route path='/network/radiofrecuencia/:adminId' element={<Radiofrecuencia />}></Route>
          <Route path='/network/fibra-optica/:adminId' element={<FibraOptica />}></Route>
          {/* Recuperar contraseña */}
          <Route path='/reset-password' element = {<RecoveryPwdComponent />}></Route>
          <Route path='/reset-password-new' element={<ResetPwdComponent />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;