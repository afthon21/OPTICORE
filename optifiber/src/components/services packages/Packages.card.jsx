import styleCard from '../services packages/css/paymentCard.module.css';

import { useState } from "react";

function PackageCard({ services = [], onSelected }) {
    const [search, setSearch] = useState('');

    const handleInputSearch = (e) => {
        setSearch(e.target.value);
    }

    const filteredName = services.filter(services => {
        let packageName = services.Name.replace(/\s+/g, ' ').trim()
        return packageName.toLowerCase().includes(search.toLowerCase());
    })

    return (
        <div className="d-flex justify-content-center row align-content-center">
            <div className={`d-flex justify-content-between align-items-end ${styleCard['header']}`}>
                <span className={`me-2 ${styleCard['title']}`}>Paquetes</span>
                <div className={styleCard['group']}>
                    <input required type="text"
                        className={styleCard['input']}
                        onChange={handleInputSearch} />
                    <span className={styleCard['highlight']} />
                    <span className={styleCard['bar']} />
                    <label className={styleCard['place-holder']}>
                        <i className="bi bi-search me-1"></i>
                        Buscar...
                    </label>
                </div>
            </div>

                
        </div>
    );
}

export default PackageCard;