import express from 'express';
import { body, validationResult } from 'express-validator';
import AdminUser from '../models/AdminUser.js';
import AdminInvite from '../models/AdminInvite.js';
import PasswordReset from '../models/PasswordReset.js';
import AdminLog from '../models/AdminLog.js';
import { authenticateToken, requireSuperAdmin, requireAdmin } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

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

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// ===== ROTAS DE USUÁRIOS =====

// Listar todos os usuários
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await AdminUser.find({}, '-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar usuário por email
router.get('/users/:email', requireAdmin, async (req, res) => {
  try {
    const user = await AdminUser.findOne(
      { email: req.params.email.toLowerCase() },
      '-password'
    );
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar último login
router.put('/users/:email/last-login', requireAdmin, async (req, res) => {
  try {
    const user = await AdminUser.findOne({ email: req.params.email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    await user.updateLastLogin();
    res.json({ message: 'Último login atualizado' });
  } catch (error) {
    console.error('Erro ao atualizar último login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Excluir usuário
router.delete('/users/:email', requireSuperAdmin, async (req, res) => {
  try {
    const { adminEmail } = req.body;
    
    if (req.params.email === req.user.email) {
      return res.status(400).json({ error: 'Você não pode excluir sua própria conta' });
    }
    
    const user = await AdminUser.findOne({ email: req.params.email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    if (user.role === 'super_admin') {
      return res.status(400).json({ error: 'Não é possível excluir super administradores' });
    }
    
    await AdminUser.findByIdAndDelete(user._id);
    
    await createLog(adminEmail, 'DELETE_USER', `Usuário ${req.params.email} excluído`, req);
    
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS DE CONVITES =====

// Criar convite
router.post('/invites', requireSuperAdmin, [
  body('email').isEmail().normalizeEmail(),
  body('createdBy').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { email, createdBy } = req.body;

    // Verificar se já existe um convite ativo
    const existingInvite = await AdminInvite.findOne({
      email: email.toLowerCase(),
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (existingInvite) {
      return res.status(400).json({
        error: 'Já existe um convite ativo para este email'
      });
    }

    // Criar convite
    const invite = new AdminInvite({
      email: email.toLowerCase(),
      token: AdminInvite.generateToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      createdBy
    });

    await invite.save();

    await createLog(createdBy, 'INVITE_USER', `Convite criado para ${email}`, req);

    res.json({ invite });
  } catch (error) {
    console.error('Erro ao criar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar convites
router.get('/invites', requireSuperAdmin, async (req, res) => {
  try {
    const invites = await AdminInvite.find().sort({ createdAt: -1 });
    res.json({ invites });
  } catch (error) {
    console.error('Erro ao buscar convites:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Validar convite
router.get('/invites/validate/:token', async (req, res) => {
  try {
    const invite = await AdminInvite.findOne({
      token: req.params.token,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!invite) {
      return res.status(404).json({ error: 'Convite inválido ou expirado' });
    }

    res.json({ invite });
  } catch (error) {
    console.error('Erro ao validar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Usar convite
router.post('/invites/:token/use', [
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { password } = req.body;

    const invite = await AdminInvite.findOne({
      token: req.params.token,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!invite) {
      return res.status(404).json({ error: 'Convite inválido ou expirado' });
    }

    // Criar usuário
    const user = new AdminUser({
      email: invite.email,
      password,
      role: 'admin'
    });

    await user.save();

    // Marcar convite como usado
    await invite.markAsUsed();

    await createLog(invite.email, 'USER_CREATED', 'Usuário criado via convite', req);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao usar convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Excluir convite
router.delete('/invites/:id', requireSuperAdmin, async (req, res) => {
  try {
    const { adminEmail } = req.body;
    
    const invite = await AdminInvite.findByIdAndDelete(req.params.id);
    
    if (!invite) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    await createLog(adminEmail, 'DELETE_INVITE', `Convite para ${invite.email} excluído`, req);

    res.json({ message: 'Convite excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir convite:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS DE RESET DE SENHA =====

// Criar reset de senha
router.post('/password-reset', requireSuperAdmin, [
  body('userEmail').isEmail().normalizeEmail(),
  body('adminEmail').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { userEmail, adminEmail } = req.body;

    // Verificar se usuário existe
    const user = await AdminUser.findOne({ email: userEmail.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Criar reset
    const reset = new PasswordReset({
      userEmail: userEmail.toLowerCase(),
      token: PasswordReset.generateToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      createdBy: adminEmail
    });

    await reset.save();

    await createLog(adminEmail, 'PASSWORD_RESET', `Reset de senha criado para ${userEmail}`, req);

    res.json({ token: reset.token });
  } catch (error) {
    console.error('Erro ao criar reset de senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Validar token de reset
router.get('/password-reset/validate/:token', async (req, res) => {
  try {
    const reset = await PasswordReset.findOne({
      token: req.params.token,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!reset) {
      return res.status(404).json({ error: 'Token inválido ou expirado' });
    }

    res.json({
      reset: {
        userEmail: reset.userEmail,
        expiresAt: reset.expiresAt
      }
    });
  } catch (error) {
    console.error('Erro ao validar token de reset:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Aplicar reset de senha
router.post('/password-reset/:token/apply', [
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { newPassword } = req.body;

    const reset = await PasswordReset.findOne({
      token: req.params.token,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!reset) {
      return res.status(404).json({ error: 'Token inválido ou expirado' });
    }

    // Atualizar senha do usuário
    const user = await AdminUser.findOne({ email: reset.userEmail });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    user.password = newPassword;
    await user.save();

    // Marcar reset como usado
    await reset.markAsUsed();

    await createLog(reset.userEmail, 'PASSWORD_CHANGED', 'Senha alterada via reset', req);

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao aplicar reset de senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS DE LOGS =====

// Listar logs
router.get('/logs', requireSuperAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, adminEmail, action, startDate, endDate } = req.query;
    
    const query = {};
    
    if (adminEmail) query.adminEmail = adminEmail.toLowerCase();
    if (action) query.action = action;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await AdminLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AdminLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Logs por admin
router.get('/logs/admin/:email', requireSuperAdmin, async (req, res) => {
  try {
    const logs = await AdminLog.find({
      adminEmail: req.params.email.toLowerCase()
    }).sort({ timestamp: -1 });

    res.json({ logs });
  } catch (error) {
    console.error('Erro ao buscar logs do admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Logs por período
router.get('/logs/range', requireSuperAdmin, async (req, res) => {
  try {
    const { start, end } = req.query;
    
    const query = {};
    if (start || end) {
      query.timestamp = {};
      if (start) query.timestamp.$gte = new Date(start);
      if (end) query.timestamp.$lte = new Date(end);
    }

    const logs = await AdminLog.find(query).sort({ timestamp: -1 });
    res.json({ logs });
  } catch (error) {
    console.error('Erro ao buscar logs por período:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS DE ESTATÍSTICAS =====

// Estatísticas gerais
router.get('/stats', requireSuperAdmin, async (req, res) => {
  try {
    const totalAdmins = await AdminUser.countDocuments();
    const activeAdmins = await AdminUser.countDocuments({ isActive: true });
    const superAdmins = await AdminUser.countDocuments({ role: 'super_admin' });
    const totalActions = await AdminLog.countDocuments();
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const actionsLast30Days = await AdminLog.countDocuments({
      timestamp: { $gte: thirtyDaysAgo }
    });

    res.json({
      stats: {
        totalAdmins,
        activeAdmins,
        superAdmins,
        totalActions,
        actionsLast30Days
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
