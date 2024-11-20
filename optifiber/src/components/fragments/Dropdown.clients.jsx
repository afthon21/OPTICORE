import styleDrop from './css/dropdown.module.css'

import { LoadFragment } from "./Load.fragment.jsx";

export function DropdownClients({ filteredOptions, onOptionClick }) {
    return (
        <>
            {filteredOptions ? (
                <ul className={`list-group ${styleDrop['drop-list']}`}>
                    {filteredOptions.map((option, index) => {
                        const clientName = `${option.Name.FirstName} 
                        ${option.Name.SecondName || ''} 
                        ${option.LastName.FatherLastName} 
                        ${option.LastName.MotherLastName}`
                            .replace(/\s+/g, ' ').trim();
                        return (
                            <>
                                <li
                                    className="list-group-item list-group-item-action"
                                    role="button"
                                    key={index}
                                    onMouseDown={() => onOptionClick(option)}>
                                    {clientName}
                                </li>
                            </>
                        );
                    })}
                </ul>
            ) : (
                <LoadFragment />
            )}
        </>
    );
}