export const handleLogout = (navigate) => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('adminId');
    navigate('/')
}

export const handleHome = (navigate) => {
    const adminId = sessionStorage.getItem('adminId');
    const homeUrl = `/home/${adminId}`;
    navigate(homeUrl);
}

export const handleProfile = (navigate) => {
    const adminId = sessionStorage.getItem('adminId');
    const profileUrl = `/profile/${adminId}`;
    navigate(profileUrl)
}

export const handleTicket = (navigate) => {
    const adminId = sessionStorage.getItem('adminId');
    const ticketUrl = `/ticket/${adminId}`;
    navigate(ticketUrl);
}

export const handleCreateTicket = (navigate) => {
    const adminId = sessionStorage.getItem('adminId');
    const ticketUrl = `/ticket/create/${adminId}`;
    navigate(ticketUrl);
}

export const handleClients = (navigate) => {
    const adminId = sessionStorage.getItem('adminId');
    const clientsUrl = `/clients/${adminId}`;
    navigate(clientsUrl);
}

export const handleCreateClient = (navigate) => {
    const adminId = sessionStorage.getItem('adminId');
    const clientsUrl = `/clients/register/${adminId}`;
    navigate(clientsUrl);
}

export const handlePayments = (navigate) => {
    const adminId = sessionStorage.getItem('adminId');
    const paysUrl = `/payment/${adminId}`;
    navigate(paysUrl);
}

export const handleCreatePayment = (navigate) => {
    const adminId = sessionStorage.getItem('adminId');
    const paysUrl = `/payment/create/${adminId}`;
    navigate(paysUrl);
}