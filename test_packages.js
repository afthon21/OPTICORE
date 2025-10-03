// Script de prueba para crear paquetes
const testCreatePackage = async () => {
    const packageData = {
        name: "100 Megas - Fibra Óptica + Netflix",
        price: 455,
        description: "Paquete de 100 Megas con Fibra Óptica. Plataformas incluidas: Netflix"
    };

    try {
        const response = await fetch('http://localhost:3000/api/packages/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Aquí deberías incluir el token de autenticación si es necesario
                // 'Authorization': 'Bearer your-token-here'
            },
            body: JSON.stringify(packageData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Paquete creado exitosamente:', result);
        } else {
            const error = await response.json();
            console.error('Error al crear paquete:', error);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
};

const testGetPackages = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/packages/all', {
            headers: {
                // Aquí deberías incluir el token de autenticación si es necesario
                // 'Authorization': 'Bearer your-token-here'
            }
        });

        if (response.ok) {
            const packages = await response.json();
            console.log('Paquetes obtenidos:', packages);
        } else {
            const error = await response.json();
            console.error('Error al obtener paquetes:', error);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
};

// Ejecutar las pruebas
console.log('Probando crear paquete...');
testCreatePackage();

setTimeout(() => {
    console.log('Probando obtener paquetes...');
    testGetPackages();
}, 2000);