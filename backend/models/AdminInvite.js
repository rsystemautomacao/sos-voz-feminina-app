import mongoose from 'mongoose';
import crypto from 'crypto';

const adminInviteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Método estático para gerar token seguro
adminInviteSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Método para verificar se o convite expirou
adminInviteSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Método para marcar como usado
adminInviteSchema.methods.markAsUsed = function() {
  this.isUsed = true;
  this.usedAt = new Date();
  return this.save();
};

// Índices para melhor performance
adminInviteSchema.index({ email: 1 });
adminInviteSchema.index({ token: 1 });
adminInviteSchema.index({ expiresAt: 1 });
adminInviteSchema.index({ isUsed: 1 });
adminInviteSchema.index({ createdAt: -1 });

const AdminInvite = mongoose.model('AdminInvite', adminInviteSchema);

export default AdminInvite;
