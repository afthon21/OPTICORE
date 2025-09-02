import { Schema, model } from 'mongoose';

const logSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['error', 'warning', 'info'],
    required: true
  },
  user: {
    type: String,
    default: 'System'
  }
}, {
  timestamps: true,
  versionKey: false
});

export default model('Log', logSchema);
