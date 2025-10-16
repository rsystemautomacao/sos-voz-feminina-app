image.png# 🚀 Início Rápido - Transformar em App Mobile

Este é um guia resumido para começar AGORA. Para detalhes completos, veja `GUIA_PUBLICACAO_APP_STORES.md`.

---

## 📱 PASSO 1: Instalar Capacitor (5 minutos)

```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli

# Inicializar
npx cap init

# Respostas:
# App name: S.O.S Voz Feminina
# App package ID: com.sosvozfeminina.app
# Web asset directory: dist

# Adicionar plataformas
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

---

## 🔧 PASSO 2: Instalar Plugins Essenciais (3 minutos)

```bash
npm install @capacitor/geolocation @capacitor/camera @capacitor/filesystem @capacitor/share @capacitor/splash-screen @capacitor/status-bar @capacitor/push-notifications @capacitor/network @capacitor/app
```

---

## ⚙️ PASSO 3: Configurar Capacitor

Criar arquivo `capacitor.config.ts` na raiz do projeto:

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
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#8B008B'
    }
  }
};

export default config;
```

---

## 📦 PASSO 4: Build e Sync (2 minutos)

```bash
# Build de produção
npm run build

# Sincronizar com plataformas
npx cap sync
```

---

## 🤖 PASSO 5: Testar no Android (10 minutos)

### Pré-requisitos:
- Instalar Android Studio: https://developer.android.com/studio

### Comandos:
```bash
# Abrir projeto no Android Studio
npx cap open android

# No Android Studio:
# 1. Aguardar sincronização do Gradle
# 2. Conectar celular via USB (ou criar emulador)
# 3. Clicar no botão "Play" (▶️)
# 4. App vai instalar e abrir no dispositivo
```

---

## 🍎 PASSO 6: Testar no iOS (apenas se tiver Mac)

### Pré-requisitos:
- Mac com macOS atualizado
- Xcode instalado (App Store)
- Conta Apple Developer (grátis para testar, $99/ano para publicar)

### Comandos:
```bash
# Abrir projeto no Xcode
npx cap open ios

# No Xcode:
# 1. Selecionar seu Team (Apple Developer Account)
# 2. Conectar iPhone via USB (ou usar simulador)
# 3. Clicar no botão "Play" (▶️)
# 4. App vai instalar e abrir no dispositivo
```

---

## 🎨 PASSO 7: Gerar Ícones (5 minutos)

```bash
# Instalar gerador de assets
npm install @capacitor/assets --save-dev

# Criar pasta
mkdir resources

# Colocar nesta pasta:
# - icon.png (1024x1024px, PNG)
# - splash.png (2732x2732px, PNG)

# Gerar todos os ícones automaticamente
npx capacitor-assets generate --iconBackgroundColor '#8B008B' --splashBackgroundColor '#8B008B'
```

**Onde conseguir os arquivos base?**
- Use o logo atual: `public/logo-sos-voz-feminina.png`
- Redimensione para 1024x1024 (use Photoshop, GIMP, ou online: https://www.iloveimg.com/resize-image)
- Para splash: centralize o logo em canvas 2732x2732 com fundo roxo

---

## 📝 PASSO 8: Atualizar package.json

Adicionar scripts úteis:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:mobile": "npm run build && npx cap sync",
    "android": "npx cap open android",
    "ios": "npx cap open ios",
    "sync": "npx cap sync"
  }
}
```

Agora você pode usar:
```bash
npm run build:mobile  # Build e sincronizar
npm run android       # Abrir Android Studio
npm run ios           # Abrir Xcode
```

---

## ✅ CHECKLIST - O que funciona agora?

Após seguir os passos acima, você terá:

- ✅ App rodando nativamente no Android
- ✅ App rodando nativamente no iOS (se tiver Mac)
- ✅ Ícones e splash screen personalizados
- ✅ Acesso a recursos nativos (câmera, GPS, etc.)
- ✅ Performance melhorada
- ✅ Instalação como app real (não mais PWA)

---

## 🚀 Próximos Passos

### Para Testar com Usuários Reais:

**Android:**
```bash
# 1. Gerar APK de teste
cd android
./gradlew assembleDebug

# 2. APK estará em: android/app/build/outputs/apk/debug/app-debug.apk
# 3. Enviar APK para testers via WhatsApp, email, etc.
# 4. Testers instalam direto (precisa habilitar "Fontes desconhecidas")
```

**iOS (precisa Mac):**
```bash
# 1. No Xcode: Product → Archive
# 2. Window → Organizer
# 3. Distribute App → Ad Hoc
# 4. Enviar IPA para testers (eles precisam do UDID registrado)
```

### Para Publicar nas Lojas:

**Veja o guia completo:** `GUIA_PUBLICACAO_APP_STORES.md`

**Resumo:**
1. **Criar contas**: Apple Developer ($99/ano) + Google Play ($25)
2. **Gerar builds de produção** (signed)
3. **Preparar screenshots** (mínimo 3 para cada loja)
4. **Escrever descrições**
5. **Criar política de privacidade** (URL pública obrigatória)
6. **Submeter para revisão**
7. **Aguardar aprovação** (1-7 dias)

---

## 🐛 Problemas Comuns

### "npx cap sync" dá erro

**Solução:**
```bash
# Limpar e reinstalar
rm -rf android ios
npx cap add android
npx cap add ios
npm run build
npx cap sync
```

### App não conecta com backend

**Verificar:**
1. URLs no `capacitor.config.ts` estão corretas?
2. Backend aceita requisições HTTPS?
3. CORS está configurado corretamente?

**Solução:**
```typescript
// capacitor.config.ts
server: {
  androidScheme: 'https',
  iosScheme: 'https',
  allowNavigation: [
    'sos-voz-feminina.vercel.app',
    'api-sos-voz-feminina.onrender.com',
    'localhost:3000'  // adicionar para testes locais
  ]
}
```

### Permissões não funcionam

**Android:**
Verificar `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
```

**iOS:**
Verificar `ios/App/App/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Precisamos da sua localização para registrar a denúncia</string>
<key>NSCameraUsageDescription</key>
<string>Precisamos acessar a câmera para tirar fotos</string>
```

---

## 💰 Custos

| Item | Custo | Quando pagar |
|------|-------|--------------|
| **Testar localmente** | R$ 0 | - |
| **Distribuir para testers** | R$ 0 | - |
| **Google Play (publicar)** | ~R$ 125 | Antes de publicar |
| **Apple App Store (publicar)** | ~R$ 495/ano | Antes de publicar |

**Total para começar a testar: R$ 0**
**Total para publicar nas duas lojas: ~R$ 620 no primeiro ano**

---

## 🆘 Precisa de Ajuda?

**Documentação:**
- Capacitor: https://capacitorjs.com/docs
- Android: https://developer.android.com/docs
- iOS: https://developer.apple.com/documentation/

**Comunidade:**
- Stack Overflow: [capacitor]
- Forum Ionic: https://forum.ionicframework.com/c/capacitor/13

---

## 🎯 Linha do Tempo Realista

- **Hoje**: Instalar Capacitor e rodar no Android ✅
- **Amanhã**: Gerar ícones, testar todas as funcionalidades
- **Semana 1**: Testes com usuários reais, coletar feedback
- **Semana 2**: Corrigir bugs, criar assets para lojas
- **Semana 3**: Criar contas nas lojas, preparar documentação
- **Semana 4**: Submeter para aprovação
- **Semana 5-6**: App disponível nas lojas! 🎉

---

**Boa sorte! 🚀**

*Qualquer dúvida, consulte o guia completo em `GUIA_PUBLICACAO_APP_STORES.md`*

