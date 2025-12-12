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
import PackagesContainer from './components/services packages/PackagesContainer.jsx';
import CreatePackage from './components/services packages/Create.Packages.jsx';
import RecoveryPwdComponent from './components/auth/recoveryPwd/recovery.component.jsx';
import ResetPwdComponent from './components/auth/recoveryPwd/resetPwd.components.jsx';
import { NavbarFragmentAll } from './components/fragments/Navbar.fragment.jsx';
import { RegionProvider } from './hooks/RegionContext';
//import Radiofrecuencia from './components/network/Radiofrecuencia.jsx';
import FibraOptica from './components/network/FibraOptica.jsx';
import Mapa from './components/network/Mapa.jsx';
import Topologia from './components/network/Topologia.jsx';
import Logs from './components/network/Logs.jsx';
import OltPorts from './components/network/OltPorts';
import NetworkHealth from './components/network/NetworkHealth';
import Onus from './components/network/Onus.jsx';
import ArchivedClients from './components/clients/ArchivedClients.jsx';
import ArchivedTickets from './components/tickets/Ticket.Archived.jsx';
import ArchivedPayments from './components/payments/ArchivedPayments.jsx';
import ArchivedPackages from './components/services packages/ArchivedPackages.jsx';
import { ViewTechnicians } from './components/technician/technician.component.jsx';
import { CreateTechnician } from './components/technician/create.technician.jsx';




function App() {
  return (
    <RegionProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <NavbarFragmentAll />
        <div className="container d-flex content">
          <Routes>
            <Route path='/' Component={StartComponent}></Route>
            <Route path='/home/:adminId' element={<ProtectedRoute> <HomeComponent /> </ProtectedRoute>}></Route>
            <Route path='/profile/:adminId' element={<ProtectedRoute> <ProfileComponent /> </ProtectedRoute>}></Route>
            {/* tickets rutas */}
            <Route path='/ticket/:adminId' element={<ProtectedRoute> <TicketComponent /> </ProtectedRoute>}></Route>
            <Route path='/ticket/create/:adminId' element={<ProtectedRoute> <CreateTicket /> </ProtectedRoute>}></Route>
            <Route path='/ticket/archived/:adminId' element={<ProtectedRoute><ArchivedTickets /> </ProtectedRoute>}></Route>
            {/* clientes rutas */}
            <Route path='/clients/:adminId' element={<ProtectedRoute> <ClientsComponent /> </ProtectedRoute>}></Route>
            <Route path='/clients/register/:adminId' element={<ProtectedRoute> <CreateClient /> </ProtectedRoute>}></Route>
            <Route path='/clients/archived/:adminId' element={<ProtectedRoute><ArchivedClients /> </ProtectedRoute>}></Route>
            

            {/* pagos rutas */}
            <Route path='/payment/:adminId' element={<ProtectedRoute> <PaymentComponent /> </ProtectedRoute>}></Route>
            <Route path='/payment/create/:adminId' element={<ProtectedRoute> <CreatePayment /> </ProtectedRoute>}></Route>
            <Route path='/payment/archived/:adminId' element={<ProtectedRoute><ArchivedPayments /> </ProtectedRoute>}></Route>
            {/* Paquetes rutas */}
            <Route path='/packageServices/:id' element={<ProtectedRoute> <PackagesContainer /> </ProtectedRoute>}></Route>
            <Route path='/packageServices/create/:id' element={<ProtectedRoute> <CreatePackage /> </ProtectedRoute>}></Route>
            <Route path='/packageServices/archived/:id' element={<ProtectedRoute> <ArchivedPackages /> </ProtectedRoute>}></Route>
           
            {/* Técnicos rutas */}
            <Route path='/tecnicos/:adminId' element={<ProtectedRoute> <ViewTechnicians /> </ProtectedRoute>}></Route>
            <Route path='/tecnicos/create/:adminId' element={<ProtectedRoute> <CreateTechnician /> </ProtectedRoute>}></Route>

            {/* Monitoreo de red */}
            {/**<Route path='/network/radiofrecuencia/:adminId' element={<Radiofrecuencia />}></Route>
            <Route path='/network/radiofrecuencia/ports/:adminId' element={<ProtectedRoute><OltPorts /></ProtectedRoute>}></Route>
            <Route path='/network/radiofrecuencia/health/:adminId' element={<ProtectedRoute><NetworkHealth /></ProtectedRoute>}></Route>
            <Route path='/network/radiofrecuencia/mapa/:adminId' element={<ProtectedRoute><Mapa /></ProtectedRoute>}></Route>
            <Route path='/network/radiofrecuencia/topologia/:adminId' element={<ProtectedRoute><Topologia /></ProtectedRoute>}></Route>
            <Route path='/network/radiofrecuencia/logs/:adminId' element={<ProtectedRoute><Logs /></ProtectedRoute>}></Route>
            <Route path='/network/radiofrecuencia/onus/:adminId' element={<ProtectedRoute><Onus /></ProtectedRoute>}></Route>**/}
            <Route path='/network/fibra-optica/:adminId' element={<FibraOptica />}></Route>
            <Route path='/network/fibra-optica/ports/:adminId' element={<ProtectedRoute><OltPorts /></ProtectedRoute>}></Route>
            <Route path='/network/fibra-optica/health/:adminId' element={<ProtectedRoute><NetworkHealth /></ProtectedRoute>}></Route>
            <Route path='/network/fibra-optica/mapa/:adminId' element={<ProtectedRoute><Mapa /></ProtectedRoute>}></Route>
            <Route path='/network/fibra-optica/topologia/:adminId' element={<ProtectedRoute><Topologia /></ProtectedRoute>}></Route>
            <Route path='/network/fibra-optica/logs/:adminId' element={<ProtectedRoute><Logs /></ProtectedRoute>}></Route>
            <Route path='/network/fibra-optica/onus/:adminId' element={<ProtectedRoute><Onus /></ProtectedRoute>}></Route>
            {/* Recuperar contraseña */}
            <Route path='/reset-password' element = {<RecoveryPwdComponent />}></Route>
            <Route path='/reset-password-new' element={<ResetPwdComponent />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </RegionProvider>
  )
}

export default App;