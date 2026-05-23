import { useEffect, useState } from "react";
import ApiRequest from "../hooks/apiRequest";
import Swal from 'sweetalert2';
import { useRegion } from '../../hooks/RegionContext.jsx';



const fiberPackages = [
  { name: "50 Megas", price: 349 },
  { name: "100 Megas", price: 395 },
  { name: "200 Megas", price: 445 },
  { name: "300 Megas", price: 495 },
];

const radioPackages = [
  { name: "10 Megas", price: 295 },
  { name: "15 Megas", price: 360 },
  { name: "20 Megas", price: 395 },
];

// Plataformas con logo HBO Max con texto
const platforms = [
  { name: "HBO Max", price: 50, img: "/platforms/hbo-max.svg" },
  { name: "Netflix", price: 60, img: "/platforms/netflix.svg" },
  { name: "Disney+", price: 40, img: "/platforms/disney-plus.svg" },
  { name: "Prime Video", price: 45, img: "/platforms/prime-video.svg" },
  { name: "Spotify", price: 30, img: "/platforms/spotify.svg" },
  { name: "Roku", price: 25, img: "/platforms/roku.svg" },
];

const whatsappLogo = "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";

export default function Card({ onPackageCreated }) {
  const { region } = useRegion();
  const [type, setType] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const { makeRequest, error } = ApiRequest(import.meta.env.VITE_API_BASE);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  const getFilteredPackages = (packageType) => {
    const packages = packageType === "fiber" ? fiberPackages : radioPackages;
      if (region === "Puebla") {
        return packages.filter(pkg => pkg.name !== "50 Megas");
      }
      return packages;
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await makeRequest('/client/all');
        setClients(res || []);
      } catch (error) {
        console.log('Error fetching clients:', error);
      }
    };
    fetchClients();
  }, [makeRequest]);



  const handlePlatformToggle = (name) => {
    setSelectedPlatforms((prev) =>
      prev.includes(name)
        ? prev.filter((p) => p !== name)
        : [...prev, name]
    );
  };

  const getTotal = () => {
    const pkg = [...fiberPackages, ...radioPackages].find(
      (p) => p.name === selectedPackage
    );
    const basePrice = pkg ? pkg.price : 0;
    const platformsPrice = selectedPlatforms.reduce((sum, name) => {
      const p = platforms.find((pl) => pl.name === name);
      return sum + (p?.price || 0);
    }, 0);
    return basePrice + platformsPrice;
  };

  const handleConfirm = async () => {
    if (!selectedClient) {
      await Swal.fire({
        icon: 'warning',
        title: 'Cliente requerido',
        text: 'Por favor selecciona un cliente para asignar el paquete.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top',
        timerProgressBar: true,
      });
      return;
    }

    try {
      // Crear el paquete con la estructura que espera el backend
      const timestamp = new Date().toLocaleString('es-ES');
      const selectedPlatformData = selectedPlatforms.map(platformName => {
        const platformInfo = platforms.find(p => p.name === platformName);
        return {
          name: platformName,
          price: platformInfo?.price || 0
        };
      });

      const packageData = {
        name: `${selectedPackage} - ${type === "fiber" ? "Fibra Óptica" : "Radio Frecuencia"}${selectedPlatforms.length > 0 ? ` + ${selectedPlatforms.join(', ')}` : ''} (${timestamp})`,
        packageSpeed: selectedPackage, // Velocidad del paquete (100 Megas, etc.)
        type: type === "fiber" ? "Fibra Óptica" : "Radio Frecuencia",
        price: getTotal(),
        description: `Paquete de ${selectedPackage} con ${type === "fiber" ? "Fibra Óptica" : "Radio Frecuencia"}${selectedPlatforms.length > 0 ? `. Plataformas incluidas: ${selectedPlatforms.join(', ')}` : ''}. Creado el ${timestamp}`,
        platforms: selectedPlatformData,
        clientId: selectedClient
      };

      // Crear el paquete usando el endpoint de packages
      const response = await makeRequest('/packages/new', 'POST', packageData);
      
      console.log("Response from server:", response);
      console.log("Error from hook:", error);

      // Verificar si hay error en el hook
      if (error) {
        throw new Error(error);
      }

      // Verificar si la respuesta es null o undefined (indica error en makeRequest)
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }

      if (response && response.message) {
        // Mostrar mensaje de éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Paquete confirmado!',
          text: `Paquete "${packageData.name}" ha sido creado con un precio de $${packageData.price}.`,
          timer: 2500,
          showConfirmButton: false,
          toast: true,
          position: 'top',
          timerProgressBar: true,
        });

        setConfirmed(true);
        
        // Notifica al padre para recargar la tabla primero
        if (onPackageCreated) onPackageCreated();

        // Opcional: reiniciar todo después de un momento
        setTimeout(() => {
          resetAll();
        }, 3000);
      } else {
        throw new Error('No se recibió respuesta válida del servidor');
      }

    } catch (error) {
      console.error('Error detallado al crear paquete:', error);
      
      // Mostrar mensaje de error con más detalles
      await Swal.fire({
        icon: 'error',
        title: 'Error al crear paquete',
        text: error.message || 'Hubo un error al crear el paquete. Por favor, intenta de nuevo.',
        timer: 4000,
        showConfirmButton: true,
        toast: false,
        position: 'center',
        timerProgressBar: true,
      });
    }
  };

  const resetAll = () => {
    setType(null);
    setSelectedPackage(null);
    setSelectedPlatforms([]);
    setSelectedClient('');
    setConfirmed(false);
  };

  const blueColor = "#0074e8";



    return (
    <div
      className="p-8"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "100vw",
        minHeight: "100vh",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 80,
      }}
    >
      <h1
        style={{
          fontSize: "3.6rem",
          fontWeight: "700",
          marginBottom: 60,
          color: "#000",
          fontFamily: "'Montserrat', sans-serif",
          userSelect: "none",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        Elige el paquete
      </h1>

            <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 30,
          flexWrap: "wrap",
          maxWidth: 900,
          width: "100%",
          marginBottom: 60,
        }}
      >
        {[
          { label: "Fibra Óptica", value: "fiber" },
          { label: "Radio Frecuencia", value: "radio" }
        ].map(({ label, value }) => {
          const selected = type === value;
          return (
            <button
              key={value}
              onClick={() => {
                setType(value);
                setSelectedPackage(null);
                setSelectedPlatforms([]);
                setConfirmed(false);
              }}
              style={{
                flex: "1 1 280px",
                padding: "16px 24px",
                borderRadius: 12,
                fontSize: 22,
                fontWeight: "600",
                color: selected ? "#fff" : blueColor,
                backgroundColor: selected ? blueColor : "#fff",
                border: `2px solid ${blueColor}`,
                boxShadow: selected
                  ? `0 6px 18px ${blueColor}88`
                  : "0 2px 6px rgba(0,0,0,0.1)",
                cursor: "pointer",
                userSelect: "none",
                transition: "all 0.3s ease",
                letterSpacing: "0.03em",
              }}
              onMouseEnter={(e) => {
                if (!selected) {
                  e.currentTarget.style.backgroundColor = blueColor;
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.boxShadow = `0 8px 22px ${blueColor}bb`;
                }
              }}
              onMouseLeave={(e) => {
                if (!selected) {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.color = blueColor;
                  e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
                }
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

            {type && type !== "delete" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
            width: "100%",
            maxWidth: 1000,
            marginBottom: 60,
          }}
        >
          
          {getFilteredPackages(type).map((pkg) => (
            <div
              key={pkg.name}
              onClick={() => {
                setSelectedPackage(pkg.name);
                setSelectedPlatforms([]);
                setConfirmed(false);
              }}
              style={{
                padding: 22,
                borderRadius: 20,
                cursor: "pointer",
                userSelect: "none",
                background:
                  selectedPackage === pkg.name
                    ? blueColor
                    : "#fff",
                color: selectedPackage === pkg.name ? "#fff" : "#222",
                border: `2px solid ${blueColor}`,
                boxShadow:
                  selectedPackage === pkg.name
                    ? `0 10px 28px ${blueColor}aa`
                    : "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                textAlign: "center",
                fontWeight: "600",
              }}
              onMouseEnter={e => {
                if (selectedPackage !== pkg.name) {
                  e.currentTarget.style.boxShadow = `0 8px 20px ${blueColor}55`;
                }
              }}
              onMouseLeave={e => {
                if (selectedPackage !== pkg.name) {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                }
              }}
            >
              <h2 style={{ fontSize: 26, marginBottom: 8 }}>{pkg.name}</h2>
              <p style={{ fontSize: 16, marginBottom: 6 }}>
                {type === "fiber" ? "Fibra óptica" : "Radio frecuencia"}
              </p>
              <p style={{ fontSize: 22, fontWeight: "800" }}>${pkg.price} / mes</p>
            </div>
          ))}
        </div>
             )}

      {selectedPackage && (
        <>
          <h3
            style={{
              fontSize: 24,
              fontWeight: "700",
              marginBottom: 20,
              color: "#000",
              textAlign: "center",
            }}
          >
            Plataformas adicionales
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 20,
              marginBottom: 50,
              maxWidth: 900,
              width: "100%",
            }}
          >
            {platforms.map((p) => {
              const selected = selectedPlatforms.includes(p.name);
              return (
                <button
                  key={p.name}
                  onClick={() => handlePlatformToggle(p.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "10px 24px",
                    borderRadius: 24,
                    fontWeight: 600,
                    fontSize: 16,
                    border: selected ? "none" : `2px solid ${blueColor}`,
                    backgroundColor: selected ? blueColor : "#fff",
                    color: selected ? "#fff" : blueColor,
                    cursor: "pointer",
                    userSelect: "none",
                    boxShadow: selected ? `0 6px 18px ${blueColor}99` : "0 2px 6px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    minWidth: 180,
                    height: 56,
                    textAlign: "center",
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/wifi.svg';
                    }}
                    style={{
                      height: 40,
                      width: 120,
                      objectFit: "contain",
                      userSelect: "none",
                    }}
                  />
                  <span style={{ fontWeight: "700" }}>+${p.price}</span>
                </button>
              );
            })}
          </div>
        </>
      )}


      {selectedPackage && (
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            maxWidth: 600,
            width: "100%",
          }}
        >
          {/* Selector de cliente */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              marginBottom: 40,
              width: "100%",
            }}
          >
            <label
              htmlFor="client-select"
              style={{
                fontWeight: 600,
                fontSize: 18,
                marginBottom: 8,
                alignSelf: "flex-start",
              }}
            >
              Selecciona el cliente para asignar el paquete:
            </label>
            <select
              value={selectedClient}
              onChange={e => {
                setSelectedClient(e.target.value);
                setConfirmed(false);
              }}
              style={{
                width: "100%",
                maxWidth: 400,
                padding: 12,
                borderRadius: 8,
                border: "2px solid #ddd",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: "#fff",
                color: "#222",
                transition: "border-color 0.3s ease",
              }}
            >
              <option value="">Selecciona un cliente</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>
                  {`${client.Name?.FirstName || ''} ${client.Name?.SecondName || ''} ${client.LastName?.FatherLastName || ''} ${client.LastName?.MotherLastName || ''}`.replace(/\s+/g, ' ').trim()}
                </option>
              ))}
            </select>
          </div>

          <p style={{ fontSize: 22, marginBottom: 14 }}>
            Total: <strong>${getTotal()}</strong> / mes
          </p>
          <button
            onClick={handleConfirm}
            disabled={confirmed || !selectedClient}
            style={{
              backgroundColor: confirmed || !selectedClient ? "#ccc" : blueColor,
              color: "#fff",
              fontWeight: "700",
              fontSize: 22,
              padding: "14px 40px",
              borderRadius: 12,
              border: "none",
              cursor: confirmed || !selectedClient ? "default" : "pointer",
              userSelect: "none",
              boxShadow: !confirmed && selectedClient ? `0 8px 24px ${blueColor}bb` : "none",
              transition: "all 0.3s ease",
            }}
          >
            {confirmed ? "Paquete confirmado" : "Crear paquete"}
          </button>
        </div>
      )}
    </div>
  );
}