# 📱 Como Testar o App no Android - Passo a Passo

## 🎯 Objetivo
Testar o S.O.S Voz Feminina como app nativo Android pela primeira vez!

---

## 🛠️ OPÇÃO 1: Testar no Emulador (Recomendado para Iniciantes)

### Passo 1: Instalar Android Studio

1. **Download**:
   - Acesse: https://developer.android.com/studio
   - Baixar "Android Studio" (botão verde grande)
   - Tamanho: ~1GB

2. **Instalar**:
   - Executar o instalador
   - Aceitar configurações padrão
   - Marcar: "Android Virtual Device" (AVD)
   - Aguardar instalação (~10 minutos)

3. **Primeira execução**:
   - Abrir Android Studio
   - Aguardar download de componentes (primeira vez demora)
   - Aceitar licenças Android SDK

---

### Passo 2: Abrir o Projeto

No terminal do seu projeto:

```bash
# Certificar que está na branch correta
git branch
# Deve mostrar: * capacitor-implementation

# Abrir Android Studio com o projeto
npm run android
```

**O que vai acontecer:**
- Android Studio vai abrir
- Projeto "android" será carregado
- Gradle vai sincronizar (5-10 minutos na primeira vez)
- Aguarde até aparecer "Gradle sync successful"

---

### Passo 3: Criar um Emulador

1. **No Android Studio**:
   - Clicar em: `Tools` → `Device Manager`
   - Ou clicar no ícone de celular na barra superior

2. **Create Device**:
   - Clicar em "Create Device" (ou "+")

3. **Escolher Hardware**:
   - Categoria: Phone
   - Dispositivo recomendado: **Pixel 5** ou **Pixel 6**
   - Clicar "Next"

4. **Escolher System Image**:
   - Aba "Recommended"
   - Selecionar: **Android 12.0 (S)** ou superior
   - Clicar "Download" ao lado (se necessário)
   - Aguardar download
   - Clicar "Next"

5. **Configurar AVD**:
   - Nome: deixar padrão (ex: "Pixel 5 API 31")
   - Orientação: Portrait
   - Clicar "Finish"

✅ **Emulador criado!**

---

### Passo 4: Executar o App

1. **No Android Studio**:
   - Certificar que Gradle sync terminou (barra de progresso no rodapé)
   - No topo, selecionar seu emulador (ex: "Pixel 5 API 31")
   - Clicar no botão verde **▶️ Run** (ou Shift+F10)

2. **Aguardar**:
   - Emulador vai iniciar (1-2 minutos primeira vez)
   - App será compilado
   - App será instalado no emulador
   - App abrirá automaticamente

3. **Ver a Mágica** ✨:
   - Seu app S.O.S Voz Feminina abrirá no emulador!
   - Tela inicial com botões "Fazer Denúncia", "Consultar Status", etc.
   - Funciona como um celular real!

---

### Passo 5: Testar Funcionalidades

#### ✅ Teste 1: Navegação
- [ ] Clicar em "Fazer Denúncia"
- [ ] Formulário abre
- [ ] Voltar funciona
- [ ] Clicar em "Sobre"
- [ ] Informações aparecem

#### ✅ Teste 2: Criar Denúncia
- [ ] Preencher tipo de violência
- [ ] Preencher descrição
- [ ] Preencher data
- [ ] Clicar em "Enviar Denúncia"
- [ ] Ver mensagem de sucesso
- [ ] Receber ID da denúncia

#### ✅ Teste 3: Upload de Foto (Emulador)
- [ ] No formulário de denúncia
- [ ] Clicar em "Adicionar Foto"
- [ ] Emulador vai mostrar galeria padrão
- [ ] Selecionar uma imagem (emulador tem imagens padrão)
- [ ] Foto aparece no formulário

#### ✅ Teste 4: Localização (Emulador)
- [ ] No formulário de denúncia
- [ ] Marcar "Incluir Localização"
- [ ] Aceitar permissão quando solicitado
- [ ] Localização deve aparecer (padrão do emulador: Mountain View, CA)

**Dica**: Para simular localizações no emulador:
- Clicar em "..." (Extended Controls) no emulador
- Ir em "Location"
- Inserir coordenadas ou buscar endereço
- Clicar "Send"

#### ✅ Teste 5: Consultar Status
- [ ] Voltar para tela inicial
- [ ] Clicar em "Consultar Status"
- [ ] Inserir ID da denúncia criada
- [ ] Ver detalhes da denúncia

#### ✅ Teste 6: Login Admin
- [ ] Menu → Login
- [ ] Inserir credenciais admin
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Ver lista de denúncias

---

## 📱 OPÇÃO 2: Testar em Celular Real (Mais Realista)

### Passo 1: Preparar o Celular Android

1. **Habilitar Modo Desenvolvedor**:
   ```
   Configurações
   → Sobre o telefone (ou Sistema)
   → Informações do software
   → Número da versão (ou Número de compilação)
   → Tocar 7 VEZES rapidamente
   → Aparecerá: "Você agora é um desenvolvedor!"
   ```

2. **Ativar Depuração USB**:
   ```
   Configurações
   → Opções do desenvolvedor (nova opção apareceu)
   → Ativar "Depuração USB"
   → Confirmar
   ```

3. **Conectar ao PC**:
   - Usar cabo USB
   - No celular, aparecerá: "Permitir depuração USB?"
   - Marcar "Sempre permitir deste computador"
   - Clicar "OK"

---

### Passo 2: Executar no Celular

```bash
# No terminal do projeto
npm run android
```

**No Android Studio**:
- No topo, selecionar SEU CELULAR (ex: "Galaxy S21")
- Se não aparecer:
  - Verificar se cabo USB está conectado
  - Verificar se depuração USB está ativada
  - Tentar desconectar e reconectar
- Clicar em **▶️ Run**

**No Celular**:
- App será instalado
- App abrirá automaticamente
- Testar tudo!

---

### Passo 3: Testar Funcionalidades Nativas

#### ✅ Câmera Real
- [ ] Criar denúncia
- [ ] Adicionar foto
- [ ] Escolher "Tirar Foto"
- [ ] Câmera abre
- [ ] Tirar foto
- [ ] Foto aparece no app

#### ✅ GPS Real
- [ ] Marcar "Incluir Localização"
- [ ] Aceitar permissão
- [ ] Localização REAL é capturada
- [ ] Ver coordenadas corretas

#### ✅ Compartilhamento
- [ ] Após criar denúncia
- [ ] Tentar compartilhar ID
- [ ] Menu nativo de compartilhamento abre

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Problema: "Gradle sync failed"
**Solução**:
1. Aguardar. Primeira vez demora 5-10 minutos
2. Se persistir:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

### Problema: "SDK not found"
**Solução**:
1. Android Studio → Preferences (Windows/Linux) ou Settings (Mac)
2. Appearance & Behavior → System Settings → Android SDK
3. Verificar que Android SDK está instalado
4. Instalar se necessário

### Problema: "Emulador não inicia"
**Solução**:
1. Verificar virtualização está habilitada no BIOS
2. Fechar outros emuladores/VMs
3. Reabrir Android Studio
4. Tentar criar novo emulador

### Problema: "App não conecta com backend"
**Solução**:
1. Verificar se backend está rodando (Render)
2. Verificar `capacitor.config.ts`:
   ```typescript
   allowNavigation: [
     'api-sos-voz-feminina.onrender.com'  // ← Deve estar aqui
   ]
   ```
3. Rebuild:
   ```bash
   npm run build
   npx cap sync
   ```

### Problema: "Celular não aparece no Android Studio"
**Solução**:
1. Desconectar e reconectar USB
2. Verificar depuração USB está ativada
3. Trocar porta USB
4. Trocar cabo USB (alguns cabos são só carga)
5. Instalar drivers USB do fabricante:
   - Samsung: https://developer.samsung.com/mobile/android-usb-driver.html
   - Xiaomi: https://www.xiaomitool.com/V2/guide/drivers
   - Outros: pesquisar "USB drivers [marca do celular]"

### Problema: "White screen / Tela branca"
**Solução**:
1. Verificar se build foi feito:
   ```bash
   npm run build
   npx cap sync
   ```
2. Verificar console no Android Studio (Logcat)
3. Procurar erros em vermelho

---

## 📊 MÉTRICAS DE SUCESSO

Considere o teste **BEM-SUCEDIDO** se:

✅ App abre sem crash  
✅ Tela inicial aparece corretamente  
✅ Navegação funciona  
✅ Criar denúncia funciona  
✅ Upload de arquivo funciona  
✅ Consultar status funciona  
✅ Login admin funciona  
✅ Todas as cores/design estão corretos  

---

## 🎯 APÓS TESTES BEM-SUCEDIDOS

### Opção A: Fazer Merge para Main
```bash
# Voltar para main
git checkout main

# Fazer merge
git merge capacitor-implementation

# Push
git push origin main
```

### Opção B: Gerar APK para Distribuir
```bash
cd android
./gradlew assembleDebug
```
APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

Enviar para amigos/testers via WhatsApp!

### Opção C: Publicar no Play Store
Seguir guia: `GUIA_PUBLICACAO_APP_STORES.md`

---

## 🆘 PRECISA DE AJUDA?

### Documentação:
- Android Studio: https://developer.android.com/studio/intro
- Capacitor: https://capacitorjs.com/docs/android

### Comunidade:
- Stack Overflow: [android], [capacitor]
- Reddit: r/androiddev

### Seus Guias:
- `CAPACITOR_IMPLEMENTACAO.md` - Implementação detalhada
- `GUIA_PUBLICACAO_APP_STORES.md` - Como publicar
- `RESUMO_CAPACITOR.md` - Resumo visual

---

## 🎊 BOA SORTE!

Você está prestes a ver seu site React rodando como um app nativo Android! 🚀

**Primeiro teste? Prepare-se para ficar impressionado!** ✨

---

**Criado em 09/10/2025 com ❤️**

