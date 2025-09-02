import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  adminEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'CREATE_DENUNCIA',
      'UPDATE_STATUS',
      'UPDATE_PRIORITY',
      'ADD_OBSERVATION',
      'EXPORT_DATA',
      'INVITE_USER',
      'DELETE_USER',
      'PASSWORD_RESET',
      'PASSWORD_CHANGED',
      'SYSTEM_INIT',
      'USER_CREATED',
      'DELETE_INVITE'
    ]
  },
  details: {
    type: String,
    required: true
  },
  denunciaId: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para melhor performance
adminLogSchema.index({ adminEmail: 1 });
adminLogSchema.index({ action: 1 });
adminLogSchema.index({ timestamp: -1 });
adminLogSchema.index({ denunciaId: 1 });
adminLogSchema.index({ createdAt: -1 });

const AdminLog = mongoose.model('AdminLog', adminLogSchema);

export default AdminLog;
