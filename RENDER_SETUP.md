# Configuração do Render para Backend

## 🚨 PROBLEMA CRÍTICO: Backend não está rodando

**Erro atual:** `404 (Not Found)` em `https://sos-voz-feminina-backend.onrender.com/api/auth/login`

## ✅ SOLUÇÃO: Deploy Manual no Render

### Passo 1: Acessar Render
1. Acesse: https://render.com
2. Faça login ou crie uma conta
3. Clique em "New +" → "Web Service"

### Passo 2: Conectar Repositório
1. **Connect a repository**: Selecione o repositório `sos-voz-feminina-app`
2. **Name**: `sos-voz-feminina-backend`
3. **Environment**: `Node`
4. **Region**: `Oregon (US West)`
5. **Branch**: `main`
6. **Root Directory**: Deixe vazio (usar raiz do projeto)

### Passo 3: Configurar Build e Start
```
Build Command: cd backend && npm install
Start Command: cd backend && npm start
```

### Passo 4: Configurar Variáveis de Ambiente
Adicione as seguintes variáveis:

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

### Passo 5: Configurar Plano
- **Plan**: `Starter` (Free)
- **Auto-Deploy**: `Yes`

### Passo 6: Deploy
1. Clique em "Create Web Service"
2. Aguarde o build (pode levar 5-10 minutos)
3. Verifique os logs para erros

## 🔍 Verificações Pós-Deploy

### 1. Health Check
Acesse: `https://sos-voz-feminina-backend.onrender.com/api/health`

**Deve retornar:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-04T..."
}
```

### 2. Teste de Login
Acesse: `https://sos-voz-feminina.vercel.app/login`

**Credenciais:**
- Email: `sosvozfeminina@administrador.com`
- Senha: `@VozAdministrador!25`

### 3. Verificar Logs
No painel do Render, verifique:
- Build logs (deve mostrar "npm install" e "npm start")
- Runtime logs (deve mostrar "Conectado ao MongoDB Atlas")

## 🚨 Troubleshooting

### Se o build falhar:
1. Verificar se `backend/package.json` existe
2. Verificar se `backend/server.js` existe
3. Verificar logs de build no Render

### Se o runtime falhar:
1. Verificar variáveis de ambiente
2. Verificar conexão com MongoDB
3. Verificar logs de runtime no Render

### Se retornar 404:
1. Verificar se o serviço está rodando
2. Verificar se a porta está correta (3000)
3. Verificar se as rotas estão configuradas

## 📞 URLs Importantes

- **Render Dashboard**: https://dashboard.render.com
- **Backend URL**: https://sos-voz-feminina-backend.onrender.com
- **Health Check**: https://sos-voz-feminina-backend.onrender.com/api/health
- **Frontend**: https://sos-voz-feminina.vercel.app

## ✅ Checklist Final

- [ ] Backend deployado no Render
- [ ] Health check funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado
- [ ] Login funcionando
- [ ] MongoDB conectado
- [ ] Logs sem erros
