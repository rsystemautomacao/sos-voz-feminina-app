# Instruções de Deploy para Produção

## 🚨 PROBLEMA CRÍTICO IDENTIFICADO

O frontend está tentando se conectar com `http://localhost:3000/api` em vez da URL de produção do backend.

## ✅ SOLUÇÕES NECESSÁRIAS

### 1. Configurar Variáveis de Ambiente no Vercel

No painel do Vercel, adicione as seguintes variáveis de ambiente:

```
VITE_API_URL=https://sos-voz-feminina-backend.onrender.com/api
VITE_APP_NAME=S.O.S Voz Feminina
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false
```

### 2. Configurar Variáveis de Ambiente no Render

No painel do Render, adicione as seguintes variáveis de ambiente:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://sosvozfeminina:SosVoz2024!@cluster0.wyktcyy.mongodb.net/sos-voz-feminina?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=sos_voz_feminina_jwt_secret_key_2024_very_secure
JWT_EXPIRES_IN=24h
SUPER_ADMIN_EMAIL=sosvozfeminina@administrador.com
SUPER_ADMIN_PASSWORD=@VozAdministrador!25
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
CORS_ORIGIN=https://sos-voz-feminina.vercel.app
```

### 3. Verificar se o Backend está Rodando

Acesse: `https://sos-voz-feminina-backend.onrender.com/api/health`

Deve retornar: `{"status":"ok","timestamp":"..."}`

### 4. Testar Login

Após configurar as variáveis:
1. Acesse: `https://sos-voz-feminina.vercel.app/login`
2. Use as credenciais:
   - Email: `sosvozfeminina@administrador.com`
   - Senha: `@VozAdministrador!25`

## 🔧 COMANDOS PARA DEPLOY

### Vercel (Frontend)
```bash
# Conectar repositório no Vercel
# Configurar variáveis de ambiente
# Deploy automático via Git
```

### Render (Backend) - CONFIGURAÇÃO MANUAL
```bash
# 1. Acessar https://render.com
# 2. Criar nova Web Service
# 3. Conectar repositório GitHub
# 4. Configurar:
#    - Name: sos-voz-feminina-backend
#    - Environment: Node
#    - Build Command: cd backend && npm install
#    - Start Command: cd backend && npm start
#    - Plan: Starter (Free)
```

## 🚨 PROBLEMA IDENTIFICADO: Backend não está rodando no Render

**Status atual:**
- ✅ Frontend: Funcionando no Vercel
- ❌ Backend: 404 - Não encontrado no Render
- ❌ URL: https://sos-voz-feminina-backend.onrender.com/api/auth/login

**Ação necessária:**
1. **Deployar backend no Render manualmente**
2. **Configurar variáveis de ambiente**
3. **Verificar se está rodando**

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Backend deployado no Render
- [ ] Frontend deployado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] MongoDB conectado
- [ ] Health check funcionando
- [ ] Login funcionando

## 🚨 AÇÕES URGENTES

1. **Configurar VITE_API_URL no Vercel** (CRÍTICO)
2. **Verificar se backend está rodando no Render**
3. **Configurar CORS_ORIGIN no Render**
4. **Testar login após configurações**

## 📞 SUPORTE

Se o problema persistir:
1. Verificar logs do Render
2. Verificar logs do Vercel
3. Testar endpoints manualmente
4. Verificar conectividade com MongoDB
