import { useState } from "react";

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
  {
    name: "HBO Max",
    price: 50,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/160px-HBO_Max_Logo.svg.png",
  },
  {
    name: "Netflix",
    price: 60,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/160px-Netflix_2015_logo.svg.png",
  },
  {
    name: "Disney+",
    price: 40,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/160px-Disney%2B_logo.svg.png",
  },
  {
    name: "Prime Video",
    price: 45,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Prime_Video.png/160px-Prime_Video.png",
  },
  {
    name: "Spotify",
    price: 30,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/2024_Spotify_Logo.svg/160px-2024_Spotify_Logo.svg.png",
  },
  {
    name: "Roku",
    price: 25,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Roku_logo.svg/500px-Roku_logo.svg.png"
  },
]; 

const whatsappLogo = "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";

export default function Card() {
  const [type, setType] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

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

  const handleConfirm = () => {
    if (!selectedPackage) return;
    setConfirmed(true);
  };

  const resetAll = () => {
    setType(null);
    setSelectedPackage(null);
    setSelectedPlatforms([]);
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
        backgroundColor: "#fafafa",
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
        Elige tu paquete
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
          { label: "Radio Frecuencia", value: "radio" },
          { label: "Eliminar", value: "delete" },
        ].map(({ label, value }) => {
          const selected = type === value;
          const isDelete = value === "delete";

          return (
            <button
              key={value}
              onClick={() => {
                if (isDelete) {
                  resetAll();
                } else {
                  setType(value);
                  setSelectedPackage(null);
                  setSelectedPlatforms([]);
                  setConfirmed(false);
                }
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
          {(type === "fiber" ? fiberPackages : radioPackages).map((pkg) => (
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
              overflow: "visible",
              minHeight: 120,
            }}
          >
            {platforms.map((p) => {
              console.log("Renderizando:", p.name);
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
          <p style={{ fontSize: 22, marginBottom: 14 }}>
            Total: <strong>${getTotal()}</strong> / mes
          </p>
          <button
            onClick={handleConfirm}
            disabled={confirmed}
            style={{
              backgroundColor: confirmed ? "#ccc" : blueColor,
              color: "#fff",
              fontWeight: "700",
              fontSize: 22,
              padding: "14px 40px",
              borderRadius: 12,
              border: "none",
              cursor: confirmed ? "default" : "pointer",
              userSelect: "none",
              boxShadow: !confirmed ? `0 8px 24px ${blueColor}bb` : "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!confirmed) {
                e.currentTarget.style.backgroundColor = "#005bb5";
                e.currentTarget.style.boxShadow = `0 10px 28px #005bb5cc`;
              }
            }}
            onMouseLeave={(e) => {
              if (!confirmed) {
                e.currentTarget.style.backgroundColor = blueColor;
                e.currentTarget.style.boxShadow = `0 8px 24px ${blueColor}bb`;
              }
            }}
          >
            {confirmed ? "Paquete confirmado" : "Confirmar paquete"}
          </button>
        </div>
      )}

      {confirmed && (
        <div
          style={{
            maxWidth: 800,
            backgroundColor: "#dff0d8",
            padding: 24,
            borderRadius: 16,
            boxShadow: `0 4px 14px ${blueColor}55`,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 20, fontWeight: "600", marginBottom: 16 }}>
            Gracias por elegir tu paquete.
          </p>
          <p style={{ fontSize: 18, marginBottom: 16 }}>
            Para finalizar tu contratación, por favor envíanos vía WhatsApp al número{" "}
            <strong>55 6519 8466</strong> los siguientes requisitos:
          </p>
          <ul
            style={{
              listStyle: "none",
              paddingLeft: 0,
              fontSize: 16,
              maxWidth: 600,
              margin: "0 auto 24px",
              textAlign: "left",
              lineHeight: 1.6,
            }}
          >
            <li>• Foto de la INE</li>
            <li>• Dos números de referencia</li>
            <li>• Correo electrónico</li>
            <li>• Ubicación del domicilio</li>
            <li>• Foto de la fachada</li>
            <li>• Comprobante de domicilio</li>
          </ul>
          <p style={{ fontSize: 16, fontWeight: "600", marginBottom: 24 }}>
            Sin costo de instalación.
          </p>
          <a
            href={`https://wa.me/5565198466`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#25d366",
              padding: "10px 18px",
              borderRadius: 30,
              color: "white",
              fontWeight: "700",
              fontSize: 18,
              textDecoration: "none",
              boxShadow: "0 4px 12px #25d366aa",
            }}
          >
            <img
              src={whatsappLogo}
              alt="WhatsApp"
              style={{ width: 26, height: 26, userSelect: "none" }}
            />
            55 6519 8466
          </a>
        </div>
      )}
    </div>
  );
}
