import styleDocuments from '../css/clientsDocuments.module.css';

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { UploadDoc } from './Upload.modal.jsx';
import { LoadFragment } from '../../fragments/Load.fragment.jsx';
import ApiRequest from '../../hooks/apiRequest.jsx';

function ClientDocuments({ client }) {
    const { makeRequest, loading, error } = ApiRequest(import.meta.env.VITE_API_BASE);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const res = await makeRequest(`/document/all/${client}`)
            setData(res)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [makeRequest]);

    function documentModal(document, title) {
        Swal.fire({
            imageAlt: title,
            imageUrl: document,
            showCloseButton: true,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            cancelButtonColor: '#404040',
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

    const handleDelete = async (name, document) => {
        const confirm = await Swal.fire({
            icon: 'warning',
            title: 'Precaución!',
            text: `Eliminar ${name}?`,
            showCancelButton: true,
            toast: true,
            position: 'top',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#2a9d8f',
            cancelButtonColor: '#404040',
            iconColor: '#e5be01'
        });

        if (confirm.isConfirmed) {
            try {
                await makeRequest(`/document/delete/${document}`, 'DELETE');
                //Refrescar la lista
                fetchData();
                // Mostrar mensaje de éxito
                Swal.fire({
                    toast: true,
                    icon: 'success',
                    title: 'Documento Eliminado',
                    timer: 1200,
                    showConfirmButton: false,
                    position: 'top',
                    background: '#e5e8e8'
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    if (loading) return <LoadFragment />

    if (error) return <p>Error!</p>

    return (
        <>
            <table className="table table-hover table-sm">
                <thead className={styleDocuments['head']}>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th className="text-center">Archivo</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className={`text-wrap ${styleDocuments['body']}`}>
                    {data.map((item) => (
                        <tr key={item._id} className={styleDocuments['select-row']}>
                            <td style={{ width: '1.5rem' }}><i className="bi bi-file-earmark-richtext-fill"></i></td>
                            <td style={{ width: '12rem' }}>{item.Description || ''}</td>
                            <td className="text-center" style={{ width: '5rem' }}>
                                <a
                                    className={`${styleDocuments['btn-view']}`}
                                    role="button"
                                    onClick={() => documentModal(item.Document, item.Description)}>
                                    Ver Archivo
                                </a>
                            </td>
                            <td style={{ width: '5rem' }}>
                                <button
                                    onClick={() => handleDownload(item.Document)}
                                    className={`${styleDocuments['Btn']}`}>
                                    <svg className={styleDocuments['svgIcon']} viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" /></svg>
                                    <span className={styleDocuments['icon2']} />
                                </button>
                            </td>
                            <td style={{ width: '5rem' }}>
                                <button
                                    className={styleDocuments['bin-button']}
                                    onClick={() => handleDelete(item.Description, item._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 39 7" className={styleDocuments['bin-top']}>
                                        <line strokeWidth={4} stroke="white" y2={5} x2={39} y1={5} />
                                        <line strokeWidth={3} stroke="white" y2="1.5" x2="26.0357" y1="1.5" x1={12} />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 33 39" className={styleDocuments['bin-bottom']}>
                                        <mask fill="white" id="path-1-inside-1_8_19">
                                            <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
                                        </mask>
                                        <path mask="url(#path-1-inside-1_8_19)" fill="white" d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" />
                                        <path strokeWidth={4} stroke="white" d="M12 6L12 29" />
                                        <path strokeWidth={4} stroke="white" d="M21 6V29" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 89 80" className={styleDocuments['garbage']}>
                                        <path fill="white" d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-end mt-4">
                <button
                    className={`${styleDocuments['button']}`}
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#uploadModal">

                    <svg className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                    <span className={styleDocuments['text']}>
                        Subir archivo
                    </span>
                </button>

                <UploadDoc client={client} onUploadSuccess={fetchData}
                />
            </div>
        </>

    );
}

export default ClientDocuments;