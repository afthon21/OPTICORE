// Script para eliminar el índice único del campo name en la colección packages
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixPackagesIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database');
        
        const db = mongoose.connection.db;
        const collection = db.collection('packages');
        
        try {
            // Intentar eliminar el índice único en name
            await collection.dropIndex('name_1');
            console.log('Successfully dropped unique index on name field');
        } catch (error) {
            if (error.codeName === 'IndexNotFound') {
                console.log('Index name_1 not found, continuing...');
            } else {
                console.log('Error dropping index:', error.message);
            }
        }
        
        // Crear el nuevo índice compuesto
        try {
            await collection.createIndex({ name: 1, Client: 1 }, { unique: true });
            console.log('Successfully created compound unique index on name + Client');
        } catch (error) {
            console.log('Error creating compound index:', error.message);
        }
        
        console.log('Database indexes updated successfully');
        
    } catch (error) {
        console.error('Error fixing indexes:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
        process.exit(0);
    }
};

fixPackagesIndex();