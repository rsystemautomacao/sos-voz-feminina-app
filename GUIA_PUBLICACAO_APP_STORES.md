# 📱 Guia Completo para Publicação nas App Stores

## 🎯 Visão Geral

Este guia detalha todos os passos necessários para publicar o **S.O.S Voz Feminina** na **Apple App Store** e **Google Play Store**.

---

## ⚠️ IMPORTANTE: Escolha da Abordagem

Atualmente, seu app é uma **PWA (Progressive Web App)** rodando em React. Para publicar nas lojas, você tem **3 opções**:

### **Opção 1: Capacitor (RECOMENDADA) ⭐**
- Converte seu PWA em app nativo
- Mantém 99% do código atual
- Acesso a recursos nativos (câmera, GPS, notificações push)
- Melhor performance
- Mais fácil de manter

### **Opção 2: PWABuilder**
- Gera wrappers nativos automaticamente
- Mais simples, mas menos controle
- Recursos nativos limitados

### **Opção 3: React Native (NÃO RECOMENDADA)**
- Requer reescrever TODO o app
- Muito trabalho
- Não vale a pena neste caso

**👉 Vou focar na Opção 1 (Capacitor) que é a melhor para seu caso.**

---

## 📋 PARTE 1: PREPARAÇÃO DO PROJETO

### 1.1 Instalar e Configurar o Capacitor

```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli

# Inicializar Capacitor
npx cap init

# Quando perguntado:
# - App name: S.O.S Voz Feminina
# - App package ID: com.sosvozfeminina.app (ou seu domínio invertido)
# - Web asset directory: dist

# Adicionar plataformas
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

### 1.2 Instalar Plugins Necessários

```bash
# Plugins essenciais para seu app
npm install @capacitor/geolocation
npm install @capacitor/camera
npm install @capacitor/filesystem
npm install @capacitor/share
npm install @capacitor/splash-screen
npm install @capacitor/status-bar
npm install @capacitor/push-notifications
npm install @capacitor/network
npm install @capacitor/app
```

### 1.3 Atualizar package.json

Adicionar scripts úteis:

```json
{
  "scripts": {
    "build": "vite build",
    "cap:sync": "npx cap sync",
    "cap:open:android": "npx cap open android",
    "cap:open:ios": "npx cap open ios",
    "build:mobile": "npm run build && npx cap sync"
  }
}
```

### 1.4 Configurar capacitor.config.ts

Criar arquivo `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sosvozfeminina.app',
  appName: 'S.O.S Voz Feminina',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'app.sosvozfeminina.com',
    allowNavigation: [
      'sos-voz-feminina.vercel.app',
      'api-sos-voz-feminina.onrender.com'
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B008B',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#8B008B'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
```

---

## 🍎 PARTE 2: APPLE APP STORE

### 2.1 Requisitos Prévios

#### ✅ Contas e Ferramentas
- [ ] **Apple Developer Account** ($99/ano)
  - Cadastro: https://developer.apple.com/programs/
  - Processo de aprovação: 1-2 dias
  
- [ ] **Mac** com macOS atualizado
  - Obrigatório para builds iOS
  - Alternativa: usar serviço de build na nuvem (Codemagic, Bitrise)

- [ ] **Xcode** instalado (via App Store)
  - Versão mais recente
  - Necessário para compilar

#### ✅ Documentos Legais
- [ ] Razão social ou CPF (pessoa física pode publicar)
- [ ] Endereço completo
- [ ] Dados bancários (para receber pagamentos, se aplicável)

### 2.2 Assets Necessários (iOS)

#### Ícones do App (todos PNG, sem transparência)
```
App Store:
- 1024x1024px (App Store Icon)

iPhone:
- 180x180px (iPhone @3x)
- 120x120px (iPhone @2x)
- 60x60px (iPhone @1x)

iPad:
- 167x167px (iPad Pro @2x)
- 152x152px (iPad @2x)
- 76x76px (iPad @1x)

Notificações:
- 60x60px (@3x)
- 40x40px (@2x)
- 20x20px (@1x)

Settings:
- 87x87px (@3x)
- 58x58px (@2x)
- 29x29px (@1x)
```

#### Screenshots (PNG ou JPEG)
```
iPhone 6.7" (iPhone 14 Pro Max, 15 Pro Max):
- 1290 x 2796 px (mínimo 3 screenshots, máximo 10)

iPhone 6.5" (iPhone 11 Pro Max, XS Max):
- 1242 × 2688 px

iPhone 5.5" (opcional):
- 1242 × 2208 px

iPad Pro 12.9":
- 2048 × 2732 px (mínimo 3 screenshots)
```

#### Splash Screen
- PNG com logo centralizado
- Fundo roxo (#8B008B)
- Vários tamanhos para diferentes dispositivos

### 2.3 Informações da App Store

Preparar os seguintes textos:

#### Nome do App
```
S.O.S Voz Feminina
```

#### Subtítulo (30 caracteres)
```
Denúncia Anônima e Segura
```

#### Palavras-chave (100 caracteres, separadas por vírgula)
```
denúncia,violência,mulher,segurança,anônimo,proteção,ajuda,socorro,apoio
```

#### Descrição Curta (170 caracteres)
```
App de denúncia anônima para proteção e apoio às mulheres. 100% seguro, confidencial e com resposta rápida. Sua voz importa!
```

#### Descrição Completa (até 4000 caracteres)
```
🆘 S.O.S VOZ FEMININA

O S.O.S Voz Feminina é um aplicativo dedicado à proteção e apoio de mulheres em situação de vulnerabilidade. Nossa missão é fornecer um canal seguro, anônimo e confidencial para denúncias de violência.

✨ PRINCIPAIS RECURSOS:

🔒 100% ANÔNIMO
Suas denúncias são completamente anônimas. Não coletamos dados pessoais identificáveis.

⚡ RESPOSTA RÁPIDA
Nossa equipe está pronta para responder e encaminhar sua denúncia rapidamente.

📱 FÁCIL DE USAR
Interface intuitiva e acessível para todas as idades.

🌐 SEMPRE DISPONÍVEL
Acesse a qualquer momento, de qualquer lugar.

📸 EVIDÊNCIAS SEGURAS
Envie fotos e áudios de forma segura e criptografada.

📊 ACOMPANHAMENTO
Consulte o status da sua denúncia a qualquer momento.

🎯 TIPOS DE VIOLÊNCIA COBERTOS:

• Violência Doméstica
• Violência Física
• Violência Psicológica
• Violência Sexual
• Assédio
• Stalking (perseguição)
• Cyberbullying
• Outros tipos de violência

🛡️ SEGURANÇA E PRIVACIDADE:

Levamos sua segurança muito a sério. Todas as denúncias são:
• Criptografadas de ponta a ponta
• Armazenadas em servidores seguros
• Acessíveis apenas por profissionais autorizados
• Completamente anônimas

📞 CONTATOS DE EMERGÊNCIA:

O app também oferece acesso rápido a:
• 190 - Polícia Militar
• 180 - Central de Atendimento à Mulher
• 181 - Disque Denúncia

💜 SOBRE NÓS:

O S.O.S Voz Feminina é uma iniciativa de proteção e apoio às mulheres, desenvolvida para facilitar denúncias e oferecer suporte em situações de violência.

🌟 JUNTE-SE A NÓS:

Baixe agora e ajude a construir um mundo mais seguro para todas as mulheres!

---

⚠️ EM CASO DE EMERGÊNCIA IMEDIATA, LIGUE 190 (POLÍCIA MILITAR) OU 192 (SAMU)
```

#### Notas de Privacidade
```
DADOS COLETADOS:
- Localização aproximada (apenas com sua permissão)
- Informações da denúncia
- Evidências enviadas voluntariamente

USO DOS DADOS:
- Processar e encaminhar denúncias
- Melhorar o serviço
- Estatísticas anônimas

COMPARTILHAMENTO:
- Apenas com autoridades competentes quando necessário
- Dados sempre anonimizados

Conformidade total com LGPD (Lei Geral de Proteção de Dados).
```

#### Categoria
```
Primária: Estilo de Vida
Secundária: Medicina / Saúde
```

#### Classificação Etária
```
12+ (temas sensíveis de violência)
```

### 2.4 Processo de Submissão (iOS)

#### Passo 1: Build do App
```bash
# Build de produção
npm run build

# Sincronizar com Capacitor
npx cap sync ios

# Abrir no Xcode
npx cap open ios
```

#### Passo 2: Configurar no Xcode
1. Abrir arquivo `.xcworkspace` (não `.xcodeproj`)
2. Selecionar seu Team (Apple Developer Account)
3. Configurar Bundle Identifier: `com.sosvozfeminina.app`
4. Definir versão (1.0.0) e build number (1)
5. Configurar Signing & Capabilities:
   - Automatic Signing (recomendado)
   - Adicionar capabilities necessárias:
     - Location When In Use
     - Camera
     - Photo Library
     - Push Notifications

#### Passo 3: Criar Perfil no App Store Connect
1. Acessar https://appstoreconnect.apple.com
2. Clicar em "My Apps" → "+" → "New App"
3. Preencher:
   - Platform: iOS
   - Name: S.O.S Voz Feminina
   - Primary Language: Portuguese (Brazil)
   - Bundle ID: com.sosvozfeminina.app
   - SKU: sosvozfeminina001
   - User Access: Full Access

#### Passo 4: Upload do Build
```bash
# No Xcode:
# Product → Archive
# Quando terminar: Window → Organizer
# Selecionar o archive → Distribute App → App Store Connect
# Upload
```

#### Passo 5: Preencher Informações no App Store Connect
1. Adicionar screenshots (obrigatório 3+ para iPhone, 3+ para iPad)
2. Preencher descrição, palavras-chave, etc.
3. Adicionar ícone 1024x1024
4. Definir preço (gratuito)
5. Adicionar informações de privacidade
6. Selecionar build enviado
7. Adicionar informações de contato
8. Adicionar notas de revisão (opcional, mas recomendado)

#### Passo 6: Submeter para Revisão
1. Clicar em "Submit for Review"
2. Responder questionário de Export Compliance (geralmente "No")
3. Responder questionário de Advertising Identifier (se usar analytics, "Yes")
4. Aguardar aprovação (1-7 dias)

---

## 🤖 PARTE 3: GOOGLE PLAY STORE

### 3.1 Requisitos Prévios

#### ✅ Contas e Ferramentas
- [ ] **Google Play Console Account** ($25 taxa única)
  - Cadastro: https://play.google.com/console/signup
  - Aprovação instantânea (geralmente)
  
- [ ] **Android Studio** instalado
  - Download: https://developer.android.com/studio
  - Funciona em Windows, Mac ou Linux

#### ✅ Documentos Legais
- [ ] Razão social ou CPF
- [ ] Endereço completo
- [ ] Categoria de conteúdo
- [ ] Política de privacidade (URL pública)

### 3.2 Assets Necessários (Android)

#### Ícone do App
```
- 512x512px (PNG, 32-bit, sem transparência)
- Feature Graphic: 1024x500px
```

#### Screenshots
```
Telefone (obrigatório):
- Mínimo 2, máximo 8
- JPEG ou PNG 24-bit
- Tamanho mínimo: 320px
- Tamanho máximo: 3840px
- Proporção recomendada: 16:9 ou 9:16

Tablet 7" (opcional):
- Mesmas regras

Tablet 10" (opcional):
- Mesmas regras
```

#### Vídeo Promocional (opcional)
```
- YouTube URL
- Aparece na página da loja
```

#### Splash Screen
- PNG com logo centralizado
- Fundo roxo (#8B008B)
- 1080x1920px (ou proporções similares)

### 3.3 Informações da Play Store

#### Título (máximo 50 caracteres)
```
S.O.S Voz Feminina
```

#### Descrição Curta (máximo 80 caracteres)
```
Denúncia anônima e segura. Proteção e apoio às mulheres.
```

#### Descrição Completa (máximo 4000 caracteres)
```
[Mesma descrição da App Store, adaptada se necessário]
```

#### Categoria
```
Primária: Estilo de Vida
Tags: segurança, mulher, denúncia, proteção
```

#### Classificação de Conteúdo
```
Público: 12+
Temas: Violência moderada, temas sensíveis
```

#### Informações de Contato
```
Email: [seu email de suporte]
Website: https://sos-voz-feminina.vercel.app
Política de Privacidade: [URL da política]
```

### 3.4 Processo de Submissão (Android)

#### Passo 1: Build do App
```bash
# Build de produção
npm run build

# Sincronizar com Capacitor
npx cap sync android

# Abrir no Android Studio
npx cap open android
```

#### Passo 2: Configurar no Android Studio

1. **Atualizar build.gradle (app level)**:
```gradle
android {
    defaultConfig {
        applicationId "com.sosvozfeminina.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
    
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

2. **Configurar permissões no AndroidManifest.xml**:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

#### Passo 3: Gerar Keystore (Chave de Assinatura)

```bash
# Executar no terminal
keytool -genkey -v -keystore sos-voz-feminina.keystore -alias sosvoz -keyalg RSA -keysize 2048 -validity 10000

# Preencher as informações solicitadas:
# - Password: [escolha uma senha forte e GUARDE]
# - Nome: S.O.S Voz Feminina
# - Organização: [sua organização]
# - Cidade, Estado, País
```

⚠️ **MUITO IMPORTANTE**: 
- Guarde o arquivo `.keystore` em local SEGURO
- Guarde a senha em gerenciador de senhas
- Se perder, NUNCA mais poderá atualizar o app!

#### Passo 4: Configurar Assinatura no Android Studio

Criar arquivo `keystore.properties` na raiz do projeto Android:

```properties
storePassword=SUA_SENHA
keyPassword=SUA_SENHA
keyAlias=sosvoz
storeFile=../sos-voz-feminina.keystore
```

Atualizar `build.gradle`:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

android {
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ... resto da configuração
        }
    }
}
```

#### Passo 5: Gerar AAB (Android App Bundle)

```bash
# No Android Studio:
# Build → Generate Signed Bundle / APK
# Selecionar "Android App Bundle"
# Escolher release
# Selecionar keystore criado
# Finish

# Ou via linha de comando:
cd android
./gradlew bundleRelease

# AAB gerado em: android/app/build/outputs/bundle/release/app-release.aab
```

#### Passo 6: Criar App no Google Play Console

1. Acessar https://play.google.com/console
2. "Criar app"
3. Preencher:
   - Nome do app: S.O.S Voz Feminina
   - Idioma padrão: Português (Brasil)
   - App ou jogo: App
   - Gratuito ou pago: Gratuito
   - Declarações: aceitar termos

#### Passo 7: Preencher Informações Obrigatórias

**Painel Principal → Configurar app:**

1. **Privacidade**:
   - Política de privacidade: URL
   - Acesso a dados: preencher formulário
   - Segurança de dados: declarar dados coletados

2. **Acesso ao app**:
   - Selecionar se há requisitos especiais (geralmente "não")

3. **Anúncios**:
   - O app contém anúncios? (Sim/Não)

4. **Classificação de conteúdo**:
   - Preencher questionário
   - Categoria: App não-jogo
   - Temas sensíveis: violência

5. **Público-alvo e conteúdo**:
   - Faixa etária: 18+
   - Público: Brasil (ou adicionar outros países)

6. **Notícias**:
   - É app de notícias? Não

**Painel Principal → Países e regiões:**
- Adicionar países onde o app estará disponível
- Começar só com Brasil é uma boa opção

#### Passo 8: Criar Versão para Produção

1. **Versão → Produção → Criar nova versão**
2. **Upload do AAB**: arrastar arquivo `.aab`
3. **Notas da versão** (o que há de novo):
```
Primeira versão do S.O.S Voz Feminina!

✨ Recursos:
• Denúncias 100% anônimas
• Upload de evidências (fotos e áudios)
• Acompanhamento de status
• Contatos de emergência
• Interface intuitiva e segura
```

4. **Revisão e lançamento**:
   - Revisar todas as informações
   - Clicar em "Iniciar lançamento para produção"

#### Passo 9: Aguardar Aprovação
- Geralmente leva de 1 a 3 dias
- Google pode solicitar informações adicionais
- Após aprovação, app fica disponível em até 24h

---

## 📄 PARTE 4: DOCUMENTOS LEGAIS NECESSÁRIOS

### 4.1 Política de Privacidade

Você PRECISA de uma política de privacidade pública (URL). Crie uma página no seu site ou use serviços como:

- https://www.privacypolicygenerator.info/
- https://www.termsfeed.com/privacy-policy-generator/

**Pontos que DEVEM estar na política:**
- Quais dados são coletados
- Como são armazenados
- Com quem são compartilhados
- Como o usuário pode solicitar exclusão (LGPD)
- Contato para questões de privacidade

### 4.2 Termos de Uso

Recomendado ter também, especialmente para um app de denúncias:

- Responsabilidades do usuário
- Uso apropriado do serviço
- Limitações de responsabilidade
- Legislação aplicável

### 4.3 Formulário de Segurança de Dados (Google)

Google Play exige declarar:
- ✅ Localização aproximada
- ✅ Fotos e vídeos
- ✅ Arquivos de áudio
- ✅ Conteúdo gerado pelo usuário

E explicar para cada um:
- Por que é coletado
- Como é usado
- Se é compartilhado
- Se usuário pode optar por não fornecer

---

## 🎨 PARTE 5: CRIAÇÃO DE ASSETS

### 5.1 Ferramentas Recomendadas

**Design:**
- Figma (gratuito): https://figma.com
- Canva (templates): https://canva.com
- Adobe Illustrator (pago)

**Geração Automática de Ícones:**
- https://www.appicon.co/ (gera todos os tamanhos)
- https://icon.kitchen/ (específico para apps)
- Capacitor Assets: `npm install @capacitor/assets`

**Screenshots:**
- Use emuladores (Xcode/Android Studio)
- ScreenshotGo (ferramenta)
- Figma (criar mockups)

### 5.2 Script para Gerar Todos os Ícones

Se você tiver uma imagem 1024x1024, pode usar o plugin do Capacitor:

```bash
npm install @capacitor/assets --save-dev

# Criar pasta
mkdir resources

# Colocar icon.png (1024x1024) e splash.png (2732x2732) em resources/

# Gerar todos os ícones
npx capacitor-assets generate --iconBackgroundColor '#8B008B' --splashBackgroundColor '#8B008B'
```

---

## ⚙️ PARTE 6: CONFIGURAÇÕES TÉCNICAS ADICIONAIS

### 6.1 Atualizar Manifest para Mobile

`public/manifest.json`:

```json
{
  "name": "S.O.S Voz Feminina",
  "short_name": "SOS Voz",
  "description": "App de denúncia anônima para proteção e apoio às mulheres",
  "start_url": "/?source=pwa",
  "display": "standalone",
  "background_color": "#8B008B",
  "theme_color": "#8B008B",
  "orientation": "portrait",
  "scope": "/",
  "version": "1.0.0",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["lifestyle", "safety"],
  "lang": "pt-BR"
}
```

### 6.2 Adicionar Meta Tags para Mobile

No `index.html`:

```html
<head>
  <!-- Existing tags -->
  
  <!-- iOS Meta Tags -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="S.O.S Voz">
  
  <!-- iOS Icons -->
  <link rel="apple-touch-icon" sizes="180x180" href="/icon-180x180.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/icon-120x120.png">
  
  <!-- Android Meta Tags -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#8B008B">
</head>
```

### 6.3 Configurar Deep Links

Para permitir abrir denúncias específicas pelo app:

**iOS (Info.plist):**
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>sosvozfeminina</string>
    </array>
  </dict>
</array>
```

**Android (AndroidManifest.xml):**
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="sosvozfeminina" />
</intent-filter>
```

---

## 🧪 PARTE 7: TESTES ANTES DE PUBLICAR

### 7.1 Checklist de Testes

#### Funcionalidades Core:
- [ ] Criar denúncia (com e sem localização)
- [ ] Upload de fotos
- [ ] Upload de áudios
- [ ] Consultar status de denúncia
- [ ] Login de admin
- [ ] Todas as rotas funcionam

#### Testes de Permissões:
- [ ] Solicitar localização funciona
- [ ] Solicitar câmera funciona
- [ ] Solicitar galeria funciona
- [ ] App funciona quando permissões são negadas

#### Testes de Conectividade:
- [ ] App funciona com internet
- [ ] App mostra mensagem apropriada sem internet
- [ ] Dados são salvos localmente quando offline (se aplicável)

#### Testes de UI/UX:
- [ ] Todas as telas aparecem corretamente
- [ ] Navegação funciona
- [ ] Botões respondem ao toque
- [ ] Textos estão legíveis
- [ ] Cores estão corretas
- [ ] Ícones aparecem

#### Testes de Performance:
- [ ] App abre em menos de 3 segundos
- [ ] Transições são suaves
- [ ] Sem travamentos ou crashes
- [ ] Uso de memória razoável

#### Testes de Segurança:
- [ ] HTTPS está funcionando
- [ ] Tokens são salvos corretamente
- [ ] Logout limpa dados sensíveis
- [ ] URLs da API estão corretas (produção)

### 7.2 TestFlight (iOS) e Internal Testing (Android)

Antes de publicar publicamente:

**iOS - TestFlight:**
1. Adicionar testadores no App Store Connect
2. Enviar build para TestFlight
3. Convide 5-10 pessoas para testar
4. Coletar feedback
5. Corrigir bugs
6. Depois submeter para App Store

**Android - Internal Testing:**
1. Google Play Console → Testing → Internal testing
2. Criar release
3. Adicionar emails de testadores
4. Distribuir
5. Coletar feedback
6. Corrigir bugs
7. Promover para produção

---

## 📊 PARTE 8: PÓS-PUBLICAÇÃO

### 8.1 Monitoramento

**Métricas importantes:**
- Downloads
- Avaliações e reviews
- Crashes e bugs (Firebase Crashlytics)
- Tempo de uso
- Retenção de usuários

**Ferramentas:**
- Google Analytics for Firebase
- App Store Analytics
- Google Play Console Analytics

### 8.2 Atualizações

Quando precisar atualizar:

1. **Incrementar versões**:
   - `versionName`: "1.0.1" → "1.0.2" (bug fixes)
   - `versionName`: "1.0.0" → "1.1.0" (novas features)
   - `versionCode`: 1 → 2 → 3... (sempre incrementar)

2. **Rebuild**:
```bash
npm run build
npx cap sync
# Gerar novo AAB/IPA
```

3. **Upload**:
   - iOS: via Xcode
   - Android: via Play Console

4. **Notas da versão**: sempre explicar o que mudou

### 8.3 Responder Reviews

- Responda sempre (principalmente negativos)
- Seja educado e profissional
- Agradeça feedback positivo
- Ofereça soluções para problemas
- Convide usuários a atualizar após correções

---

## 💰 CUSTOS TOTAIS

| Item | Apple | Google | Comentário |
|------|-------|--------|------------|
| **Conta de Desenvolvedor** | $99/ano | $25 (taxa única) | Obrigatório |
| **Mac/Serviço de Build** | $0 - $1000+ | $0 | Mac necessário para iOS |
| **Certificados SSL** | $0 | $0 | Já tem (Vercel/Render) |
| **Assets/Design** | $0 - $500 | $0 - $500 | Pode fazer você mesmo |
| **Testes** | $0 | $0 | TestFlight e Internal Testing grátis |
| **Total Primeiro Ano** | ~$99 | ~$25 | Mínimo |
| **Total Anos Seguintes** | ~$99/ano | $0 | Manutenção |

**Total mínimo para começar: ~$124 USD (~R$ 620)**

---

## 🚀 CRONOGRAMA REALISTA

| Fase | Tempo Estimado | Dependências |
|------|----------------|--------------|
| **1. Preparação do Projeto** | 2-3 dias | Instalar Capacitor, configurar |
| **2. Criação de Assets** | 2-4 dias | Design de ícones, screenshots |
| **3. Testes Internos** | 3-5 dias | Corrigir bugs encontrados |
| **4. Documentação Legal** | 1-2 dias | Política de privacidade, termos |
| **5. Configuração iOS** | 1-2 dias | Xcode, certificados |
| **6. Configuração Android** | 1-2 dias | Android Studio, keystore |
| **7. Submissão iOS** | 1 dia | Upload, preencher formulários |
| **8. Submissão Android** | 1 dia | Upload, preencher formulários |
| **9. Aprovação iOS** | 1-7 dias | Aguardar Apple |
| **10. Aprovação Android** | 1-3 dias | Aguardar Google |
| **TOTAL** | **14-30 dias** | Variável |

---

## ✅ CHECKLIST FINAL ANTES DE SUBMETER

### Geral:
- [ ] Todos os links funcionam
- [ ] URLs de API apontam para produção
- [ ] Versões estão corretas
- [ ] Ícones estão corretos
- [ ] Splash screen funciona
- [ ] Sem console.logs desnecessários
- [ ] Sem dados de teste hardcoded

### iOS:
- [ ] Conta Apple Developer ativa
- [ ] Bundle ID configurado
- [ ] Certificados válidos
- [ ] Screenshots (mínimo 3 para iPhone, 3 para iPad)
- [ ] Ícone 1024x1024
- [ ] Descrição completa
- [ ] Política de privacidade (URL)
- [ ] Informações de contato
- [ ] Build testado no TestFlight

### Android:
- [ ] Conta Google Play ativa
- [ ] Keystore gerado e GUARDADO
- [ ] Package ID configurado
- [ ] Screenshots (mínimo 2)
- [ ] Ícone 512x512
- [ ] Feature Graphic 1024x500
- [ ] Descrição completa
- [ ] Política de privacidade (URL)
- [ ] Classificação de conteúdo
- [ ] Questionário de segurança de dados
- [ ] Build testado no Internal Testing

---

## 🆘 PROBLEMAS COMUNS E SOLUÇÕES

### "Meu app foi rejeitado pela Apple"

**Motivos comuns:**
1. **Informações incompletas**: revisar todos os campos
2. **Crashes**: testar muito antes de submeter
3. **Violação de guidelines**: ler https://developer.apple.com/app-store/review/guidelines/
4. **Conteúdo inapropriado**: revisar classificação etária
5. **Funcionalidade quebrada**: testar TUDO

**Solução:**
- Ler cuidadosamente o motivo da rejeição
- Corrigir o problema
- Resubmeter
- Adicionar notas explicativas na próxima submissão

### "Não tenho um Mac para build iOS"

**Opções:**
1. **Usar serviço na nuvem** (recomendado):
   - Codemagic: https://codemagic.io
   - Bitrise: https://bitrise.io
   - Ionic Appflow: https://ionic.io/appflow
   
2. **Alugar um Mac virtual**:
   - MacStadium: https://macstadium.com
   - MacinCloud: https://macincloud.com

3. **Empréstimo**: pedir emprestado de alguém por algumas horas

### "KeyStore perdido/esqueci a senha"

**Situação:**
- Se perder keystore ou senha, NUNCA mais poderá atualizar o app
- Terá que publicar um app NOVO (novo package ID)
- Perderá todos os downloads e reviews

**Prevenção:**
- Guardar em 3+ lugares diferentes
- Usar gerenciador de senhas
- Backup em nuvem criptografada
- Compartilhar com pessoa de confiança

### "App muito grande (>100MB)"

**Soluções:**
- Otimizar imagens (WebP, compressão)
- Remover dependências não utilizadas
- Habilitar minify e shrink resources
- Usar App Bundle (Android) para download otimizado
- Considerar lazy loading de recursos

---

## 📚 RECURSOS ÚTEIS

### Documentação Oficial:
- **Capacitor**: https://capacitorjs.com/docs
- **Apple Developer**: https://developer.apple.com/documentation/
- **Android Developer**: https://developer.android.com/docs
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policy**: https://play.google.com/about/developer-content-policy/

### Comunidades:
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/capacitor
- **Capacitor Forum**: https://forum.ionicframework.com/c/capacitor/13
- **Reddit**: r/iOSProgramming, r/androiddev

### Ferramentas:
- **App Icon Generator**: https://www.appicon.co/
- **Screenshot Generator**: https://screenshots.pro/
- **Privacy Policy Generator**: https://www.privacypolicygenerator.info/
- **ASO Tools** (otimização de store): https://www.appannie.com/

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

1. **Decidir**: você quer mesmo publicar nas lojas ou PWA é suficiente?
   - PWA = mais simples, funciona em qualquer dispositivo
   - Nativo = melhor performance, mais recursos, presença nas lojas

2. **Se decidir por lojas**:
   - Começar criando as contas (Apple $99, Google $25)
   - Enquanto aguarda aprovação, preparar assets
   - Instalar e configurar Capacitor
   - Fazer testes extensivos

3. **Ou começar pequeno**:
   - Só Android (mais barato, mais fácil)
   - Validar com usuários
   - Depois expandir para iOS

4. **Marketing**:
   - Preparar página de divulgação
   - Criar conteúdo para redes sociais
   - Planejar estratégia de lançamento

---

## 💡 DICA FINAL

**Não tenha pressa!** 

A primeira publicação é sempre a mais trabalhosa. É melhor:
- Testar MUITO antes de submeter
- Garantir que tudo funciona perfeitamente
- Ter documentação legal completa
- Preparar assets de qualidade

Uma rejeição atrasa em 1-2 semanas. Vale a pena investir tempo na preparação.

**Boa sorte! 🚀**

---

*Este guia foi preparado especificamente para o S.O.S Voz Feminina. Para dúvidas ou assistência, entre em contato.*

