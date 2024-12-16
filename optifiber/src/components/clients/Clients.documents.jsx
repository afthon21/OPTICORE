import styleDocs from './css/clientsDocuments.module.css';
import styleTable from './css/clientsDocuments.module.css'

import { useEffect, useState } from "react";
import { handleLoadDocuments } from "./js/clientLoadData.js";
import Swal from "sweetalert2";
import { UploadDoc } from './Upload.modal.jsx';
import { LoadFragment } from '../fragments/Load.fragment.jsx';

function ClientDocuments({ client }) {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const result = await handleLoadDocuments(client);
            setData(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [client]);

    function documentModal(document, title) {
        Swal.fire({
            imageAlt: title,
            imageUrl: document,
            showCloseButton: true,
            showConfirmButton: false,
            background: '#ededed'
        })
    }


    const handleDownload = async (url) => {
        const imgUrl = url;
        const response = await fetch(imgUrl);

        const blob = await response.blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "img.jpg"; // Nombre del archivo
        link.click();
    
        // Limpia la URL para evitar problemas de memoria
        URL.revokeObjectURL(link.href);
    }


    if (!client) return <LoadFragment />

    return (
        <>
            <table className="table table-hover table-sm">
                <thead className={styleTable['head']}>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th className="text-center">Archivo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className={`text-wrap ${styleTable['body']}`}>
                    {data.map((item) => (
                        <tr key={item._id} className={styleTable['select-row']}>
                            <td style={{width: '1.5rem'}}><i className="bi bi-file-earmark-richtext-fill"></i></td>
                            <td style={{width: '12rem'}}>{item.Description || ''}</td>
                            <td className="text-center" style={{width: '5rem'}}>
                                <a  
                                    className={`${styleTable['btn-view']}`}
                                    role="button"
                                    onClick={() => documentModal(item.Document, item.Description)}>
                                    Ver Archivo
                                </a>
                            </td>
                            <td style={{width: '5rem'}}>
                                <button
                                    onClick={() => handleDownload(item.Document)} 
                                    className={`${styleDocs['Btn']}`}>
                                    <svg className={styleDocs['svgIcon']} viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" /></svg>
                                    <span className={styleDocs['icon2']} />
                                    <span className={styleDocs['tooltip']}>Descargar</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-end mt-4">
                <button 
                    className={`${styleDocs['button']}`} 
                    type="button" 
                    data-bs-toggle="modal" 
                    data-bs-target="#uploadModal">

                    <svg className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                    <span className={styleDocs['text']}>
                        Subir archivo
                    </span>
                </button>

                <UploadDoc client={client}/>
            </div>
        </>

    );
}

export default ClientDocuments;