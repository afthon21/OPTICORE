import React, { createContext, useContext, useState } from 'react';

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  // Estado de México por defecto
  const [region, setRegion] = useState('Estado de México');

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => useContext(RegionContext);


