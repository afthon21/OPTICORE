import Log from '../models/logSchema.js';

// Función utilitaria para registrar logs automáticamente
export const logError = async (source, eventType, message, originalError = null) => {
    try {
        const logEntry = new Log({
            source,
            eventType,
            message: originalError ? `${message}: ${originalError.message}` : message,
            level: 'error'
        });
        await logEntry.save();
        // Removido console.log para no mostrar en terminal
    } catch (err) {
        // Removido console.error para no mostrar en terminal
    }
};

export const logWarning = async (source, eventType, message) => {
    try {
        const logEntry = new Log({
            source,
            eventType,
            message,
            level: 'warning'
        });
        await logEntry.save();
        // Removido console.log para no mostrar en terminal
    } catch (err) {
        // Removido console.error para no mostrar en terminal
    }
};

export const logInfo = async (source, eventType, message) => {
    try {
        const logEntry = new Log({
            source,
            eventType,
            message,
            level: 'info'
        });
        await logEntry.save();
        // Removido console.log para no mostrar en terminal
    } catch (err) {
        // Removido console.error para no mostrar en terminal
    }
};