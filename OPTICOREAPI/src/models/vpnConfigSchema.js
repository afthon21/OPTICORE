import mongoose from 'mongoose';

const VpnConfigSchema = new mongoose.Schema({
  vpnId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  
  // SNMP (para queries SNMP directas)
  snmpHost: { type: String },
  snmpCommunityEncrypted: { type: String },
  snmpVersion: { type: String, enum: ['v2c', 'v3'], default: 'v2c' },
  
  // UISP (para topología UISP)
  uispBase: { type: String },
  uispUserEncrypted: { type: String },
  uispPassEncrypted: { type: String },
  
  // V-SOL Web Panel (acceso HTTP al OLT)
  webPanelUrl: { type: String }, // ej: https://192.168.8.208
  webPanelUserEncrypted: { type: String },
  webPanelPassEncrypted: { type: String },
  
  // Control de acceso
  allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'admin' }],
  
  // Metadata
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

VpnConfigSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('VpnConfig', VpnConfigSchema);