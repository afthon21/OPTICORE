import React, { createContext, useContext, useState } from 'react';

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  // EdoMéx por defecto
  const [region, setRegion] = useState('EdoMéx');

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => useContext(RegionContext);


