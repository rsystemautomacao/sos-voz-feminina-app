import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

// Middleware para verificar token JWT
export const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔐 Verificando token de autenticação...');
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      console.log('❌ Token não fornecido');
      return res.status(401).json({
        error: 'Token de acesso não fornecido'
      });
    }

    console.log('🔑 Token recebido:', token.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔓 Token decodificado:', decoded);
    
    // Buscar usuário no banco
    const user = await AdminUser.findById(decoded.userId);
    console.log('👤 Usuário encontrado no banco:', user ? 'Sim' : 'Não');
    
    if (!user || !user.isActive) {
      console.log('❌ Usuário não encontrado ou inativo');
      return res.status(401).json({
        error: 'Usuário não encontrado ou inativo'
      });
    }

    console.log('✅ Usuário autenticado:', user.email);
    
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.log('❌ Token JWT inválido');
      return res.status(401).json({
        error: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      console.log('❌ Token JWT expirado');
      return res.status(401).json({
        error: 'Token expirado'
      });
    }

    console.error('💥 Erro na autenticação:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se é super admin
export const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      error: 'Acesso negado. Apenas super administradores podem realizar esta ação.'
    });
  }
  next();
};

// Middleware para verificar se é admin ou super admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({
      error: 'Acesso negado. Apenas administradores podem realizar esta ação.'
    });
  }
  next();
};

// Função para gerar token JWT
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};
