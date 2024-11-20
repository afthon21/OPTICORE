export const handleLoadPay = async (client) => {
    try {
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:3200/api/pay/all/${client}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const errorDetails = await res.json(); // obtener el error
            console.log('Server response error:', errorDetails);

            return;
        }

        const result = await res.json();
        return result;
    } catch (error) {
        console.log(error);
    }
}