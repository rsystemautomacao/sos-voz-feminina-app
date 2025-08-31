# 🚀 SOS Voz Feminina - Guia de Implementação

## 📋 Resumo do Projeto

O **SOS Voz Feminina** é uma aplicação web completa para denúncias anônimas de violência contra mulheres, com interface moderna e backend robusto.

### 🎯 Funcionalidades Principais
- ✅ Denúncias anônimas com upload de evidências
- ✅ Sistema de contatos de emergência
- ✅ Interface responsiva e acessível
- ✅ Backend seguro com MongoDB
- ✅ Sistema de logging e monitoramento

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** + TypeScript
- **Vite** (build tool)
- **shadcn/ui** (componentes)
- **Tailwind CSS** (estilização)
- **React Router** (navegação)
- **React Query** (gerenciamento de estado)

### Backend
- **Node.js** + Express
- **MongoDB** (banco de dados)
- **Mongoose** (ODM)
- **Multer** (upload de arquivos)
- **JWT** (autenticação)
- **Winston** (logging)

## 📦 Estrutura do Projeto

```
SOS Voz Feminina/
├── src/                    # Frontend React
│   ├── components/         # Componentes UI
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços de API
│   └── hooks/             # Hooks customizados
├── backend/               # Backend Node.js
│   ├── src/
│   │   ├── models/        # Modelos MongoDB
│   │   ├── routes/        # Rotas da API
│   │   ├── middleware/    # Middlewares
│   │   └── utils/         # Utilitários
│   └── package.json
├── env.example            # Variáveis de ambiente (exemplo)
└── README-IMPLEMENTACAO.md
```

## 🚀 Como Implementar

### 1. Configuração Inicial

#### Frontend
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.local .env.local
```

#### Backend
```bash
# Navegar para pasta do backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp ../env.example .env
```

### 2. Configuração do MongoDB Atlas

1. **Criar conta no MongoDB Atlas**
   - Acesse [mongodb.com/atlas](https://mongodb.com/atlas)
   - Crie uma conta gratuita

2. **Criar cluster**
   - Escolha o plano gratuito (M0)
   - Selecione região (recomendado: São Paulo)
   - Clique em "Create"

3. **Configurar acesso**
   - Vá em "Database Access"
   - Crie um usuário com senha forte
   - Anote as credenciais

4. **Configurar rede**
   - Vá em "Network Access"
   - Adicione IP `0.0.0.0/0` (para desenvolvimento)
   - Para produção, adicione apenas IPs específicos

5. **Obter string de conexão**
   - Vá em "Database" → "Connect"
   - Escolha "Connect your application"
   - Copie a string de conexão

### 3. Configuração das Variáveis de Ambiente

#### Backend (.env)
```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/sos-voz-feminina?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=sua-chave-secreta-muito-segura-aqui

# Configurações de Segurança
CORS_ORIGIN=http://localhost:8080
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Configurações de Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,audio/mpeg,audio/wav
```

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=SOS Voz Feminina
VITE_APP_VERSION=1.0.0
```

### 4. Executando o Projeto

#### Desenvolvimento Local
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

#### Produção
```bash
# Build do frontend
npm run build

# Iniciar backend em produção
cd backend
NODE_ENV=production npm start
```

## 🔧 Configurações de Produção

### 1. Deploy do Backend

#### Opções Recomendadas:
- **Railway** (fácil e gratuito)
- **Render** (fácil e gratuito)
- **Heroku** (pago)
- **DigitalOcean** (VPS)

#### Exemplo com Railway:
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático

### 2. Deploy do Frontend

#### Opções Recomendadas:
- **Vercel** (ótimo para React)
- **Netlify** (fácil e gratuito)
- **GitHub Pages** (gratuito)

#### Exemplo com Vercel:
1. Conecte seu repositório
2. Configure build command: `npm run build`
3. Deploy automático

### 3. Configurações de Segurança

#### Backend
```env
# Produção
NODE_ENV=production
CORS_ORIGIN=https://seu-dominio.com
JWT_SECRET=chave-super-secreta-producao
RATE_LIMIT_MAX_REQUESTS=50
```

#### Frontend
```env
VITE_API_URL=https://seu-backend.railway.app/api
```

## 📊 Monitoramento e Logs

### Logs do Backend
- Arquivos em `backend/logs/`
- `combined.log` - todos os logs
- `error.log` - apenas erros

### Health Check
- Endpoint: `GET /health`
- Monitora status do servidor e banco

## 🔒 Segurança Implementada

### Backend
- ✅ Helmet (headers de segurança)
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Sanitização de dados
- ✅ Validação de entrada
- ✅ Upload seguro de arquivos

### Frontend
- ✅ Validação de formulários
- ✅ Sanitização de dados
- ✅ HTTPS obrigatório em produção

## 🧪 Testando a Aplicação

### 1. Teste de Denúncia
1. Acesse `http://localhost:8080/denuncia`
2. Preencha o formulário
3. Envie uma denúncia
4. Verifique o código de acompanhamento

### 2. Teste de API
```bash
# Health check
curl http://localhost:3000/health

# Criar denúncia
curl -X POST http://localhost:3000/api/denuncias \
  -H "Content-Type: application/json" \
  -d '{"relato":"Teste","tipoViolencia":"psicologica","dataOcorrido":"2024-01-01"}'
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Erro de conexão com MongoDB
```
Error: connect ECONNREFUSED
```
**Solução:** Verifique a string de conexão e credenciais

#### 2. CORS Error
```
Access to fetch at 'http://localhost:3000/api' from origin 'http://localhost:8080' has been blocked
```
**Solução:** Verifique `CORS_ORIGIN` no backend

#### 3. Upload de arquivos não funciona
**Solução:** Verifique permissões da pasta `uploads/`

#### 4. Build do frontend falha
**Solução:** Verifique se todas as dependências estão instaladas

## 📈 Próximos Passos

### Funcionalidades Futuras
- [ ] Sistema de autenticação para administradores
- [ ] Dashboard administrativo
- [ ] Notificações por email
- [ ] Integração com APIs de emergência
- [ ] App mobile (React Native)
- [ ] Sistema de geolocalização
- [ ] Chat de suporte em tempo real

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Monitoramento com Sentry
- [ ] Cache com Redis
- [ ] CDN para arquivos estáticos

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do backend
2. Teste os endpoints da API
3. Verifique as variáveis de ambiente
4. Consulte a documentação das tecnologias

## 📄 Licença

Este projeto é de uso livre para fins educacionais e de proteção às mulheres.

---

**⚠️ Importante:** Este é um projeto de proteção social. Em caso de emergência, sempre ligue para 180 (Central de Atendimento à Mulher) ou 190 (Polícia Militar).
