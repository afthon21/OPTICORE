import React, { createContext, useContext, useState, useEffect } from 'react';

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  // Inicializar con la región del admin logueado o Estado de México por defecto
  const [region, setRegion] = useState(() => {
    const savedRegion = sessionStorage.getItem('adminRegion');
    return savedRegion || 'Estado de México';
  });

  // Sincronizar con sessionStorage cuando cambie la región
  useEffect(() => {
    const savedRegion = sessionStorage.getItem('adminRegion');
    if (savedRegion && savedRegion !== region) {
      setRegion(savedRegion);
    }
  }, []);

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => useContext(RegionContext);


