# 🔧 Configuração do Banco de Dados

## 📋 Passos para Configurar

### 1. Configurar Credenciais do MongoDB Atlas

Você já tem a URI do MongoDB Atlas. Agora precisa configurar as credenciais:

```bash
# Copie o arquivo de configuração
cp mongodb-config.env .env

# Edite o arquivo .env e substitua as credenciais
# Substitua <db_username> e <db_password> pelas suas credenciais reais
```

### 2. Sua URI do MongoDB Atlas

```
mongodb+srv://<db_username>:<db_password>@cluster0.wyktcyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Substitua:**
- `<db_username>` pelo seu nome de usuário do MongoDB Atlas
- `<db_password>` pela sua senha do MongoDB Atlas

### 3. Configurar Whitelist no MongoDB Atlas

1. Acesse o MongoDB Atlas
2. Vá em "Network Access"
3. Clique em "Add IP Address"
4. Adicione seu IP atual ou `0.0.0.0/0` para permitir todos os IPs

### 4. Executar Configuração

```bash
# Configurar banco de dados
npm run setup-db

# Se der erro, verifique:
# 1. Se as credenciais estão corretas
# 2. Se o IP está na whitelist
# 3. Se o cluster está ativo
```

### 5. Testar Conexão

```bash
# Executar servidor de teste
npm run test-server

# Ou executar servidor completo
npm run dev
```

## 🔑 Credenciais de Acesso

Após a configuração, você poderá acessar com:

- **Email:** `sosvozfeminina@administrador.com`
- **Senha:** `@VozAdministrador!25`

## 🚨 Importante

- Altere a senha do super admin após o primeiro login
- Mantenha as credenciais do MongoDB Atlas seguras
- Não compartilhe o arquivo `.env`

## 🆘 Solução de Problemas

### Erro de Conexão
- Verifique se as credenciais estão corretas
- Verifique se o IP está na whitelist do MongoDB Atlas
- Verifique se o cluster está ativo

### Erro de Autenticação
- Verifique se o usuário tem permissões de leitura/escrita
- Verifique se o banco de dados existe

### Erro de Rede
- Verifique sua conexão com a internet
- Verifique se não há firewall bloqueando a conexão
