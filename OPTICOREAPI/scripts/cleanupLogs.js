import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Log from '../src/models/logSchema.js';

dotenv.config();

async function main() {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI not found in environment. Aborting.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const filter = {
            source: { $regex: 'Autenticación', $options: 'i' },
            eventType: { $regex: 'Inicio de Sesión', $options: 'i' }
        };

        const existing = await Log.countDocuments(filter);
        console.log(`Found ${existing} matching log(s) to delete.`);

        if (existing === 0) {
            console.log('No matching logs found. Nothing to delete.');
            await mongoose.disconnect();
            process.exit(0);
        }

        // Ask for final confirmation by environment flag to avoid accidental deletes when run unintentionally
        // If CLEANUP_CONFIRM environment variable is set to 'yes', proceed; otherwise abort.
        if (process.env.CLEANUP_CONFIRM !== 'yes') {
            console.log("Aborting deletion. To actually delete, set environment variable CLEANUP_CONFIRM=yes and re-run this script.");
            await mongoose.disconnect();
            process.exit(0);
        }

        const result = await Log.deleteMany(filter);
        console.log(`Deleted ${result.deletedCount} log(s).`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error during cleanup:', err);
        try { await mongoose.disconnect(); } catch(e){}
        process.exit(1);
    }
}

main();
