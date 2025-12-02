export const handleLogout = (navigate) => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('adminId');
    sessionStorage.removeItem('adminRegion');
    sessionStorage.removeItem('adminRole');
    navigate('/')
}

export const handleHome = (navigate, adminId) => {
    const homeUrl = `/home/${adminId}`;
    navigate(homeUrl);
}

export const handleProfile = (navigate, adminId) => {
    const profileUrl = `/profile/${adminId}`;
    navigate(profileUrl)
}

export const handleTicket = (navigate, adminId) => {
    const ticketUrl = `/ticket/${adminId}`;
    navigate(ticketUrl);
}

export const handleCreateTicket = (navigate, adminId) => {
    const ticketUrl = `/ticket/create/${adminId}`;
    navigate(ticketUrl);
}

export const handleClients = (navigate, adminId) => {
    const clientsUrl = `/clients/${adminId}`;
    navigate(clientsUrl);
}

export const handleCreateClient = (navigate, adminId) => {
    const clientsUrl = `/clients/register/${adminId}`;
    navigate(clientsUrl);
}

export const handlePayments = (navigate, adminId) => {
    const paysUrl = `/payment/${adminId}`;
    navigate(paysUrl);
}

export const handleCreatePayment = (navigate, adminId) => {
    const paysUrl = `/payment/create/${adminId}`;
    navigate(paysUrl);
}

export const handlePackages = (navigate, adminId) => {
    const servicesUrl = `/packageServices/${adminId}`;
    navigate(servicesUrl);
}

export const handleCreatePackages = (navigate, adminId) => {
    const servicesUrl = `/packageServices/create/${adminId}`;
    navigate(servicesUrl);
}

export const handleRecoveryPassword = (navigate) => {
    const recoveryUrl = '/reset-password';
    navigate(recoveryUrl);
}

export const handleResetPassword = (navigate) => {
    const resetPassUrl = '/reset-password-new';
    navigate(resetPassUrl);
}
export const handleArchiveClients = (navigate, adminId) => {
    navigate(`/clients/archived/${adminId}`);
};
export const handleArchiveTickets = (navigate, adminId) => {
    navigate(`/ticket/archived/${adminId}`);
}
export const handleArchivePayments = (navigate, adminId) => {
    navigate(`/payment/archived/${adminId}`);
};


export const handleTechnicians = (navigate, adminId) => {
    navigate(`/tecnicos/${adminId}`); 
};

export const handleCreateTechnician = (navigate, adminId) => {
    navigate(`/tecnicos/create/${adminId}`);
};