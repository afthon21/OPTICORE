export const handleLogout = (navigate) => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('adminId');
    navigate('/')
}

export const handleHome = (navigate) => {
    const adminId = localStorage.getItem('adminId');
    const homeUrl = `/home/${adminId}`;
    navigate(homeUrl);
}

export const handleProfile = (navigate) => {
    const adminId = localStorage.getItem('adminId');
    const profileUrl = `/profile/${adminId}`;
    navigate(profileUrl)
}

export const handleTicket = (navigate) => {
    const adminId = localStorage.getItem('adminId');
    const ticketUrl = `/ticket/${adminId}`;
    navigate(ticketUrl);
}

export const handleCreateTicket = (navigate) => {
    const adminId = localStorage.getItem('adminId');
    const ticketUrl = `/ticket/create/${adminId}`;
    navigate(ticketUrl);
}

export const handleClients = (navigate) => {
    const adminId = localStorage.getItem('adminId');
    const clientsUrl = `/clients/${adminId}`;
    navigate(clientsUrl);
}

export const handleCreateClient = (navigate) => {
    const adminId = localStorage.getItem('adminId');
    const clientsUrl = `/clients/register/${adminId}`;
    navigate(clientsUrl);
}

export const handlePayments = (navigate) => {
    const adminId = localStorage.getItem('adminId');
    const paysUrl = `/payment/${adminId}`;
    navigate(paysUrl);
}

export const handleCreatePayment = (navigate) => {
    const adminId = localStorage.getItem('adminId');
    const paysUrl = `/payment/create/${adminId}`;
    navigate(paysUrl);
}