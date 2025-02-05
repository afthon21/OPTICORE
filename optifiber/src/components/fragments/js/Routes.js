const adminId = sessionStorage.getItem('adminId');

export const handleLogout = (navigate) => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('adminId');
    navigate('/')
}

export const handleHome = (navigate) => {
    const homeUrl = `/home/${adminId}`;
    navigate(homeUrl);
}

export const handleProfile = (navigate) => {
    const profileUrl = `/profile/${adminId}`;
    navigate(profileUrl)
}

export const handleTicket = (navigate) => {
    const ticketUrl = `/ticket/${adminId}`;
    navigate(ticketUrl);
}

export const handleCreateTicket = (navigate) => {
    const ticketUrl = `/ticket/create/${adminId}`;
    navigate(ticketUrl);
}

export const handleClients = (navigate) => {
    const clientsUrl = `/clients/${adminId}`;
    navigate(clientsUrl);
}

export const handleCreateClient = (navigate) => {
    const clientsUrl = `/clients/register/${adminId}`;
    navigate(clientsUrl);
}

export const handlePayments = (navigate) => {
    const paysUrl = `/payment/${adminId}`;
    navigate(paysUrl);
}

export const handleCreatePayment = (navigate) => {
    const paysUrl = `/payment/create/${adminId}`;
    navigate(paysUrl);
}

export const handlePackages = (navigate) => {
    const servicesUrl = `/packageServices/${adminId}`;
    navigate(servicesUrl);
}

export const handleCreatePackages = (navigate) => {
    const servicesUrl = `/packageServices/create/${adminId}`;
    navigate(servicesUrl);
}

export const handleRecoveryPassword = (navigate) => {
    const recoveryUrl = '/reset-password';
    navigate(recoveryUrl);
}