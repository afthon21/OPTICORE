// Barrel file for clients components
export { default as ClientsComponent } from './Clients.component.jsx';
export { default as CreateClient } from './Create.client.jsx';
export { default as ClientsInfo } from './Clients.info.jsx';
export { default as ClientsCard } from './Clients.card.jsx';
export { default as ArchivedClients } from './ArchivedClients.jsx';
export { default as ClientData } from './Client.data.jsx';
export { default as ClientActive } from './Client.active.jsx';
export { default as EditClientModal } from './EditClientModal.jsx';
export { default as ModalGoogleMap } from './Modal.map.jsx';
// subfolders (documents, tickets, notes, payment) can be imported from their own barrels if needed
export * from './documents';
export * from './tickets';
export * from './notes';
export * from './payment';
