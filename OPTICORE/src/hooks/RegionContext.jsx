import React, { createContext, useContext, useState, useEffect } from 'react';

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  // Obtener rol y región del admin logueado
  const [region, setRegion] = useState(() => {
    const savedRegion = sessionStorage.getItem('adminRegion');
    return savedRegion || 'Estado de México';
  });

  const [userRole, setUserRole] = useState(() => {
    const savedRole = sessionStorage.getItem('adminRole');
    return savedRole || null;
  });

  // Función para verificar si el usuario es admin
  const isAdmin = () => {
    const adminRoles = ['admin', 'Admin', 'ADMIN', 'administrador', 'Administrador'];
    const isAdminUser = adminRoles.includes(userRole);
    return isAdminUser;
  };

  // Función personalizada para cambiar región (solo para admins)
  const changeRegion = (newRegion) => {
    
    // Verificar directamente si el rol permite cambios
    const adminRoles = ['admin', 'Admin', 'ADMIN', 'administrador', 'Administrador'];
    const canChange = adminRoles.includes(userRole);

    
    if (canChange) {
      setRegion(newRegion);
      sessionStorage.setItem('adminRegion', newRegion);
    } else {
      console.warn('❌ Solo los administradores pueden cambiar de región');
      console.warn('❌ Rol actual:', userRole);
      console.warn('❌ Tipo de rol:', typeof userRole);
    }
  };

  // Sincronizar con sessionStorage cuando cambie la información de sesión
  useEffect(() => {
    const savedRegion = sessionStorage.getItem('adminRegion');
    const savedRole = sessionStorage.getItem('adminRole');

    
    // Solo actualizar el rol si cambió
    if (savedRole !== userRole) {
      setUserRole(savedRole);
    }

    // Solo actualizar la región si cambió Y el usuario es admin O es la primera carga
    if (savedRegion && savedRegion !== region) {
      // Si es admin, siempre respetar su región guardada
      if (savedRole && ['admin', 'Admin', 'ADMIN', 'administrador', 'Administrador'].includes(savedRole)) {
        
        setRegion(savedRegion);
      } 
      // Si no es admin, forzar Estado de México solo si no está ya en esa región
      else if (savedRole && savedRegion !== 'Estado de México') {
        const defaultRegion = 'Estado de México';
        
        setRegion(defaultRegion);
        sessionStorage.setItem('adminRegion', defaultRegion);
      }
      // Si no es admin pero ya está en Estado de México, no hacer nada
      else if (savedRegion === 'Estado de México') {
        setRegion(savedRegion);
      }
    }
  }, []); // Solo ejecutar una vez al montar el componente

  // Efecto separado para manejar cambios de rol después del login
  useEffect(() => {
    const savedRole = sessionStorage.getItem('adminRole');
    if (savedRole !== userRole && savedRole) {
      setUserRole(savedRole);
      
      // Si cambió a no-admin, forzar región por defecto
      if (!['admin', 'Admin', 'ADMIN', 'administrador', 'Administrador'].includes(savedRole)) {
        const defaultRegion = 'Estado de México';
        setRegion(defaultRegion);
        sessionStorage.setItem('adminRegion', defaultRegion);
      }
    }
  }, [userRole]);

  // Función para reinicializar después del login
  const initializeAfterLogin = () => {
    const savedRegion = sessionStorage.getItem('adminRegion');
    const savedRole = sessionStorage.getItem('adminRole');
    
    if (savedRole) {
      setUserRole(savedRole);
    }
    
    if (savedRegion) {
      setRegion(savedRegion);
    }
  };

  // Evaluar si el usuario actual es admin
  const adminRoles = ['admin', 'Admin', 'ADMIN', 'administrador', 'Administrador'];
  const currentUserIsAdmin = adminRoles.includes(userRole);

  return (
    <RegionContext.Provider value={{ 
      region, 
      setRegion: changeRegion, // Usar función controlada
      isAdmin: currentUserIsAdmin,
      userRole,
      canChangeRegion: currentUserIsAdmin,
      initializeAfterLogin // Función para reinicializar
    }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => useContext(RegionContext);


