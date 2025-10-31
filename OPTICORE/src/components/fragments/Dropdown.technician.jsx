import styleDrop from './css/dropdown.module.css';
import { LoadFragment } from "./Load.fragment.jsx";

export function DropdownTechnicians({ filteredOptions, onOptionClick }) {
    if (!filteredOptions) return <LoadFragment />;

    if (filteredOptions.length === 0) {
        return (
            <ul className={`list-group ${styleDrop['drop-list']}`}>
                <li className="list-group-item text-muted">No hay técnicos</li>
            </ul>
        );
    }

    return (
        <ul className={`list-group ${styleDrop['drop-list']}`}>
            {filteredOptions.map((option, index) => {
                // Manejar ambas estructuras de datos
                const fullName = option.apellidoP 
                    ? `${option.nombre} ${option.apellidoP} ${option.apellidoA || ''}`.replace(/\s+/g, ' ').trim()
                    : option.nombre; // Si no hay apellidoP, usar solo el nombre
                    
                return (
                    <li
                        className="list-group-item"
                        role="button"
                        key={index}
                        onMouseDown={() => onOptionClick(option)}
                    >
                        {fullName}
                        {option.mercado && <small className="text-muted d-block">{option.mercado}</small>}
                    </li>
                );
            })}
        </ul>
    );
}