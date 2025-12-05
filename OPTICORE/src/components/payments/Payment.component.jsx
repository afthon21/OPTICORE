import { useState, useEffect, useCallback } from 'react';
import ApiRequest from '../hooks/apiRequest.jsx';
import PaymentCard from './Payment.card.jsx';
import PaymentInfo from './Payment.info.jsx';
import { LoadFragment } from '../fragments/Load.fragment.jsx'

function PaymentComponent() {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);
    const [select, setSelect] = useState(null);

    const handleLoad = useCallback(async () => {
        try {
            const res = await makeRequest('/pay/all');
            setData(res);
        } catch (error) {
            console.log(error);
        }
    }, [makeRequest]);

    useEffect(() => {
        handleLoad()
    }, [handleLoad]);

    useEffect(() => {
        const handleCloseInfo = () => setSelect(null);
        window.addEventListener('closePaymentInfo', handleCloseInfo);
        return () => window.removeEventListener('closePaymentInfo', handleCloseInfo);
    }, []);

    const handlePaymentUpdate = (paymentId) => {
        setData(prev => prev.filter(p => p._id !== paymentId));
        // Si el pago actualizado está seleccionado, lo deseleccionamos
        if (select && select._id === paymentId) {
            setSelect(null);
        }
    };

    if (loading) return <LoadFragment />;

    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="container-fluid mt-1" style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <PaymentCard 
                        payments={data ? data : []} 
                        onSelected={setSelect} 
                        onPaymentUpdate={handlePaymentUpdate}
                    />
                </div>
                {select && (
                    <PaymentInfo
                        payment={select}
                        onStatusChange={(updatedPayment)=> {
                            setData (prev =>
                                prev.map(t => t._id=== updatedPayment._id ? updatedPayment : t)
                            );
                        }}
                    />
                )}
            </div>
        </>
    );
}

export default PaymentComponent;