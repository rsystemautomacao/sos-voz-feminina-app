# Backend - S.O.S Voz Feminina

Backend completo para o sistema S.O.S Voz Feminina, construído com Node.js, Express e MongoDB Atlas.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB Atlas** - Banco de dados na nuvem
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **express-validator** - Validação de dados
- **helmet** - Segurança
- **cors** - Cross-Origin Resource Sharing

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no MongoDB Atlas
- Conta no Render ou Vercel (para deploy)

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `env.example` para `.env` e configure:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sos-voz-feminina?retryWrites=true&w=majority

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRES_IN=24h

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app

# Super Admin (opcional)
SUPER_ADMIN_EMAIL=admin@sosvozfeminina.com
SUPER_ADMIN_PASSWORD=admin123456

# Segurança
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:8080
```

### 3. Inicializar super admin

```bash
npm run init-admin
```

### 4. Executar em desenvolvimento

```bash
npm run dev
```

### 5. Executar em produção

```bash
npm start
```

## 📚 Estrutura do Projeto

```
backend/
├── models/              # Modelos do MongoDB
│   ├── AdminUser.js     # Usuários administradores
│   ├── AdminInvite.js   # Convites de administradores
│   ├── PasswordReset.js # Reset de senhas
│   └── AdminLog.js      # Logs de auditoria
├── routes/              # Rotas da API
│   ├── auth.js          # Autenticação
│   ├── admin.js         # Administração
│   ├── denuncia.js      # Denúncias
│   └── contatos.js      # Contatos
├── middleware/          # Middlewares
│   └── auth.js          # Autenticação JWT
├── scripts/             # Scripts utilitários
│   └── init-super-admin.js
├── server.js            # Servidor principal
├── package.json
└── README.md
```

## 🔌 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/logout` - Logout

### Administração
- `GET /api/admin/users` - Listar usuários
- `POST /api/admin/invites` - Criar convite
- `GET /api/admin/invites` - Listar convites
- `GET /api/admin/invites/validate/:token` - Validar convite
- `POST /api/admin/invites/:token/use` - Usar convite
- `POST /api/admin/password-reset` - Criar reset de senha
- `GET /api/admin/password-reset/validate/:token` - Validar token de reset
- `POST /api/admin/password-reset/:token/apply` - Aplicar reset de senha
- `GET /api/admin/logs` - Listar logs
- `GET /api/admin/stats` - Estatísticas

### Denúncias
- `POST /api/denuncias` - Registrar denúncia

### Contatos
- `POST /api/contatos` - Enviar mensagem

## 🔒 Segurança

- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **helmet** para headers de segurança
- **rate limiting** para prevenir spam
- **CORS** configurado
- **Validação** de dados com express-validator

## 🚀 Deploy

### Render

1. Conecte seu repositório ao Render
2. Configure as variáveis de ambiente
3. Deploy automático

### Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

## 📝 Logs

O sistema mantém logs detalhados de todas as ações dos administradores:

- Login/Logout
- Criação de convites
- Reset de senhas
- Exclusão de usuários
- Todas as ações administrativas

## 🔧 Desenvolvimento

Para desenvolvimento local:

```bash
# Instalar dependências
npm install

# Configurar .env
cp env.example .env

# Inicializar super admin
npm run init-admin

# Executar em desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com a equipe de desenvolvimento.
