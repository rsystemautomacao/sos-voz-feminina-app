import mongoose from 'mongoose';
import crypto from 'crypto';

const passwordResetSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
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
passwordResetSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Método para verificar se o reset expirou
passwordResetSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Método para marcar como usado
passwordResetSchema.methods.markAsUsed = function() {
  this.isUsed = true;
  this.usedAt = new Date();
  return this.save();
};

// Índices para melhor performance
passwordResetSchema.index({ userEmail: 1 });
passwordResetSchema.index({ token: 1 });
passwordResetSchema.index({ expiresAt: 1 });
passwordResetSchema.index({ isUsed: 1 });
passwordResetSchema.index({ createdAt: -1 });

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;
