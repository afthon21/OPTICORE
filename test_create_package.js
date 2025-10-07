// Test simple para crear un paquete
const testCreatePackageWithAuth = async () => {
    // Primero necesitamos hacer login para obtener un token
    const loginData = {
        Email: 'admin@test.com', // Cambia por un email válido
        Password: 'password123'  // Cambia por una contraseña válida
    };

    try {
        // Login
        console.log('Intentando hacer login...');
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (!loginResponse.ok) {
            const loginError = await loginResponse.json();
            console.error('Error en login:', loginError);
            return;
        }

        const loginResult = await loginResponse.json();
        const token = loginResult.token;
        console.log('Login exitoso, token obtenido');

        // Obtener clientes para seleccionar uno
        console.log('Obteniendo clientes...');
        const clientsResponse = await fetch('http://localhost:3000/api/client/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!clientsResponse.ok) {
            console.error('Error al obtener clientes');
            return;
        }

        const clients = await clientsResponse.json();
        if (!clients || clients.length === 0) {
            console.error('No hay clientes disponibles');
            return;
        }

        const firstClient = clients[0];
        console.log('Cliente seleccionado:', firstClient._id);

        // Crear paquete
        const packageData = {
            name: "100 Megas - Fibra Óptica + Netflix (Test)",
            packageSpeed: "100 Megas",
            type: "Fibra Óptica",
            price: 455,
            description: "Paquete de prueba con 100 Megas y Netflix",
            platforms: [{ name: "Netflix", price: 60 }],
            clientId: firstClient._id
        };

        console.log('Creando paquete con datos:', packageData);

        const packageResponse = await fetch('http://localhost:3000/api/packages/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(packageData)
        });

        if (packageResponse.ok) {
            const result = await packageResponse.json();
            console.log('✅ Paquete creado exitosamente:', result);
        } else {
            const error = await packageResponse.json();
            console.error('❌ Error al crear paquete:', error);
        }

    } catch (error) {
        console.error('💥 Error de red:', error);
    }
};

// Ejecutar el test
testCreatePackageWithAuth();