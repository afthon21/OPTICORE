// Script para eliminar el índice único y crear uno nuevo sin restricción única
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const removeUniqueIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database');
        
        const db = mongoose.connection.db;
        const collection = db.collection('packages');
        
        try {
            // Eliminar el índice único existente
            await collection.dropIndex('name_1_Client_1');
            console.log('Successfully dropped unique index name_1_Client_1');
        } catch (error) {
            if (error.codeName === 'IndexNotFound') {
                console.log('Index name_1_Client_1 not found, continuing...');
            } else {
                console.log('Error dropping index:', error.message);
            }
        }
        
        // Crear el nuevo índice sin restricción única
        try {
            await collection.createIndex({ name: 1, Client: 1 }, { unique: false });
            console.log('Successfully created non-unique compound index on name + Client');
        } catch (error) {
            console.log('Error creating index:', error.message);
        }
        
        console.log('Database indexes updated successfully');
        
    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    }
};

removeUniqueIndex();