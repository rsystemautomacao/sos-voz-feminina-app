import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = 3000;

// Middleware de segurança
app.use(helmet());

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por windowMs
  message: {
    error: 'Muitas requisições deste IP, tente novamente mais tarde.'
  }
});
app.use('/api/', limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'test'
  });
});

// Rota de teste para autenticação
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simular autenticação
  if (email === 'sosvozfeminina@administrador.com' && password === '@VozAdministrador!25') {
    res.json({
      user: {
        id: '1',
        email: email,
        role: 'super_admin',
        lastLogin: new Date().toISOString()
      },
      token: 'test_jwt_token_123'
    });
  } else {
    res.status(401).json({
      error: 'Email ou senha inválidos'
    });
  }
});

// Rota de teste para usuários
app.get('/api/admin/users', (req, res) => {
  res.json({
          users: [
        {
          id: '1',
          email: 'sosvozfeminina@administrador.com',
          role: 'super_admin',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true
        }
      ]
  });
});

// Rota de teste para convites
app.get('/api/admin/invites', (req, res) => {
  res.json({
    invites: []
  });
});

// Rota de teste para logs
app.get('/api/admin/logs', (req, res) => {
  res.json({
    logs: []
  });
});

// Rota de teste para estatísticas
app.get('/api/admin/stats', (req, res) => {
  res.json({
    stats: {
      totalAdmins: 1,
      activeAdmins: 1,
      superAdmins: 1,
      totalActions: 0,
      actionsLast30Days: 0
    }
  });
});

// Rota para 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de teste rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: test`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`✅ Credenciais de teste:`);
    console.log(`   Email: sosvozfeminina@administrador.com`);
    console.log(`   Senha: @VozAdministrador!25`);
});

export default app;
