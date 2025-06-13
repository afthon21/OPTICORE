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
                const fullName = `${option.nombre} ${option.apellidoP || ''} ${option.apellidoA || ''}`.replace(/\s+/g, ' ').trim();
                return (
                    <li
                        className="list-group-item"
                        role="button"
                        key={index}
                        onMouseDown={() => onOptionClick(option)}
                    >
                        {fullName}
                    </li>
                );
            })}
        </ul>
    );
}