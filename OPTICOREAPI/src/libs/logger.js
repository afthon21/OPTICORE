import Log from '../models/logSchema.js';

// Palabras clave relacionadas a servidores y puertos
const SERVER_KEYWORDS = [
    'puerto', 'port', 'servidor', 'server', 'conexión', 'connection',
    'red', 'network', 'base de datos', 'database', 'mongodb', 'mongoose',
    'host', 'listen', 'timeout', 'econnrefused', 'econnreset',
    'cors', 'tls', 'ssl', 'certificado', 'certificate', 'firewall',
    'api', 'endpoint', 'request', 'response'
];

// Verificar si el mensaje/evento está relacionado con servidores/puertos
const isServerRelated = (source, eventType, message) => {
    const fullText = `${source} ${eventType} ${message}`.toLowerCase();
    return SERVER_KEYWORDS.some(keyword => fullText.includes(keyword));
};

// Función utilitaria para registrar logs automáticamente
export const logError = async (source, eventType, message, originalError = null) => {
    try {
        const fullMessage = originalError ? `${message}: ${originalError.message}` : message;
        
        // Solo registrar y mostrar si está relacionado con servidores/puertos
        if (isServerRelated(source, eventType, fullMessage)) {
            const logEntry = new Log({
                source,
                eventType,
                message: fullMessage,
                level: 'error'
            });
            await logEntry.save();
            console.error(`❌ ERROR [${source}] ${eventType}: ${fullMessage}`);
        }
    } catch (err) {
        console.error('Error al registrar log:', err.message);
    }
};

export const logWarning = async (source, eventType, message) => {
    try {
        // Solo registrar y mostrar si está relacionado con servidores/puertos
        if (isServerRelated(source, eventType, message)) {
            const logEntry = new Log({
                source,
                eventType,
                message,
                level: 'warning'
            });
            await logEntry.save();
            console.warn(`⚠️ WARNING [${source}] ${eventType}: ${message}`);
        }
    } catch (err) {
        console.error('Error al registrar log:', err.message);
    }
};

export const logInfo = async (source, eventType, message) => {
    try {
        // Evitar registrar eventos de 'Inicio de Sesión' en 'Autenticación'
        const src = (source || '').toString().toLowerCase();
        const ev = (eventType || '').toString().toLowerCase();
        if (src.includes('autentic') && ev.includes('inicio')) {
            return; // No guardar este tipo de log
        }

        // Solo registrar y mostrar si está relacionado con servidores/puertos
        if (isServerRelated(source, eventType, message)) {
            const logEntry = new Log({
                source,
                eventType,
                message,
                level: 'info'
            });
            await logEntry.save();
            console.log(`ℹ️ INFO [${source}] ${eventType}: ${message}`);
        }
    } catch (err) {
        console.error('Error al registrar log:', err.message);
    }
};