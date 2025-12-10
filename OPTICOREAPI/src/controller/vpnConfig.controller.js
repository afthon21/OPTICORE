import VpnConfig from '../models/vpnConfigSchema.js';
import { encrypt } from '../libs/secretStore.js';
import { logInfo, logError } from '../libs/logger.js';

/**
 * Crear nueva configuración de VPN (admin)
 */
export async function createVpnConfig(req, res) {
    try {
        const { vpnId, name, snmpHost, snmpCommunity, snmpVersion, uispBase, uispUser, uispPass, allowedUsers } = req.body;

        if (!vpnId || !name) {
            return res.status(400).json({ message: 'vpnId and name are required' });
        }

        const existing = await VpnConfig.findOne({ vpnId });
        if (existing) {
            return res.status(400).json({ message: 'VPN config with this vpnId already exists' });
        }

        const cfg = new VpnConfig({
            vpnId,
            name,
            snmpHost,
            snmpVersion: snmpVersion || 'v2c',
            uispBase,
            allowedUsers: allowedUsers || [],
            snmpCommunityEncrypted: snmpCommunity ? encrypt(snmpCommunity) : null,
            uispUserEncrypted: uispUser ? encrypt(uispUser) : null,
            uispPassEncrypted: uispPass ? encrypt(uispPass) : null
        });

        await cfg.save();
        await logInfo('VPN Config', 'Crear', `VPN config creada: ${vpnId} por admin ${req.adminId}`);
        return res.status(201).json({ message: 'VPN config created', vpnId });
    } catch (err) {
        await logError('VPN Config', 'Crear', 'Error creando VPN config', err);
        return res.status(500).json({ message: 'Error creating VPN config', error: String(err) });
    }
}

/**
 * Listar todas las VPN configs activas (sin exponer credenciales)
 */
export async function listVpnConfigs(req, res) {
    try {
        const configs = await VpnConfig.find({ active: true })
            .select('-snmpCommunityEncrypted -uispUserEncrypted -uispPassEncrypted')
            .lean();
        return res.json(configs);
    } catch (err) {
        await logError('VPN Config', 'Listar', 'Error listando VPN configs', err);
        return res.status(500).json({ message: 'Error listing VPN configs', error: String(err) });
    }
}

/**
 * Ver una VPN config por ID (sin credenciales)
 */
export async function getVpnConfigById(req, res) {
    try {
        const { vpnId } = req.params;
        const cfg = await VpnConfig.findOne({ vpnId, active: true })
            .select('-snmpCommunityEncrypted -uispUserEncrypted -uispPassEncrypted')
            .lean();
        if (!cfg) return res.status(404).json({ message: 'VPN config not found' });
        return res.json(cfg);
    } catch (err) {
        await logError('VPN Config', 'Ver', 'Error obteniendo VPN config', err);
        return res.status(500).json({ message: 'Error getting VPN config', error: String(err) });
    }
}

/**
 * Actualizar VPN config (admin)
 */
export async function updateVpnConfig(req, res) {
    try {
        const { vpnId } = req.params;
        const { name, snmpHost, snmpCommunity, snmpVersion, uispBase, uispUser, uispPass, allowedUsers } = req.body;

        const cfg = await VpnConfig.findOne({ vpnId });
        if (!cfg) return res.status(404).json({ message: 'VPN config not found' });

        if (name) cfg.name = name;
        if (snmpHost !== undefined) cfg.snmpHost = snmpHost;
        if (snmpVersion) cfg.snmpVersion = snmpVersion;
        if (uispBase !== undefined) cfg.uispBase = uispBase;
        if (allowedUsers !== undefined) cfg.allowedUsers = allowedUsers;

        // actualizar credenciales solo si se envían
        if (snmpCommunity) cfg.snmpCommunityEncrypted = encrypt(snmpCommunity);
        if (uispUser) cfg.uispUserEncrypted = encrypt(uispUser);
        if (uispPass) cfg.uispPassEncrypted = encrypt(uispPass);

        await cfg.save();
        await logInfo('VPN Config', 'Actualizar', `VPN config actualizada: ${vpnId} por admin ${req.adminId}`);
        return res.json({ message: 'VPN config updated', vpnId });
    } catch (err) {
        await logError('VPN Config', 'Actualizar', 'Error actualizando VPN config', err);
        return res.status(500).json({ message: 'Error updating VPN config', error: String(err) });
    }
}

/**
 * Desactivar (soft delete) VPN config
 */
export async function deleteVpnConfig(req, res) {
    try {
        const { vpnId } = req.params;
        const cfg = await VpnConfig.findOne({ vpnId });
        if (!cfg) return res.status(404).json({ message: 'VPN config not found' });

        cfg.active = false;
        await cfg.save();
        await logInfo('VPN Config', 'Eliminar', `VPN config desactivada: ${vpnId} por admin ${req.adminId}`);
        return res.json({ message: 'VPN config deactivated', vpnId });
    } catch (err) {
        await logError('VPN Config', 'Eliminar', 'Error eliminando VPN config', err);
        return res.status(500).json({ message: 'Error deleting VPN config', error: String(err) });
    }
}