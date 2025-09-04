import express from 'express';
import { body, validationResult } from 'express-validator';
import AdminUser from '../models/AdminUser.js';
import AdminLog from '../models/AdminLog.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Função para criar log
const createLog = async (adminEmail, action, details, req) => {
  try {
    await AdminLog.create({
      adminEmail,
      action,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });
  } catch (error) {
    console.error('Erro ao criar log:', error);
  }
};

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    console.log('🔐 Tentativa de login:', { email: req.body.email, passwordLength: req.body.password?.length });
    
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erros de validação:', errors.array());
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { email, password } = req.body;
    console.log('📧 Email recebido:', email);

    // Buscar usuário
    const user = await AdminUser.findOne({ email: email.toLowerCase() });
    console.log('👤 Usuário encontrado:', user ? 'Sim' : 'Não');
    
    if (!user) {
      console.log('❌ Usuário não encontrado para:', email);
      return res.status(401).json({
        error: 'Email ou senha inválidos'
      });
    }

    if (!user.isActive) {
      console.log('❌ Usuário inativo:', email);
      return res.status(401).json({
        error: 'Conta desativada'
      });
    }

    console.log('🔑 Verificando senha...');
    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔑 Senha válida:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Senha inválida para:', email);
      return res.status(401).json({
        error: 'Email ou senha inválidos'
      });
    }

    console.log('✅ Login bem-sucedido para:', email);
    // Atualizar último login
    await user.updateLastLogin();

    // Gerar token
    const token = generateToken(user._id);

    // Criar log
    await createLog(user.email, 'LOGIN', 'Login realizado com sucesso', req);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      },
      token
    });

  } catch (error) {
    console.error('💥 Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token não fornecido'
      });
    }

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await AdminUser.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Usuário não encontrado ou inativo'
      });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado'
      });
    }

    console.error('Erro ao verificar token:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await AdminUser.findById(decoded.userId);
      if (user) {
        await createLog(user.email, 'LOGOUT', 'Logout realizado', req);
      }
    }

    res.json({
      message: 'Logout realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

export default router;
