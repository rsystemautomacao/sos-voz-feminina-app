# ✅ Checklist de Publicação - S.O.S Voz Feminina

Use este checklist para acompanhar seu progresso na publicação do app nas lojas.

---

## 🎯 FASE 1: PREPARAÇÃO DO PROJETO

### Instalação e Configuração
- [ ] Capacitor instalado (`npm install @capacitor/core @capacitor/cli`)
- [ ] Capacitor inicializado (`npx cap init`)
- [ ] Plataforma Android adicionada (`npx cap add android`)
- [ ] Plataforma iOS adicionada (`npx cap add ios`)
- [ ] Plugins essenciais instalados (geolocation, camera, etc.)
- [ ] Arquivo `capacitor.config.ts` criado e configurado
- [ ] Scripts no `package.json` adicionados

### Testes Iniciais
- [ ] Build de produção funciona (`npm run build`)
- [ ] Sync com Capacitor funciona (`npx cap sync`)
- [ ] App abre no Android Studio
- [ ] App abre no Xcode (se tiver Mac)
- [ ] App roda no emulador Android
- [ ] App roda no dispositivo Android físico
- [ ] App roda no simulador iOS (se tiver Mac)
- [ ] App roda no dispositivo iOS físico (se tiver Mac)

---

## 🎨 FASE 2: ASSETS E DESIGN

### Ícones
- [ ] Ícone principal criado (1024x1024px, PNG)
- [ ] Splash screen criado (2732x2732px, PNG)
- [ ] Capacitor Assets instalado (`npm install @capacitor/assets --save-dev`)
- [ ] Pasta `resources/` criada
- [ ] Arquivos base colocados em `resources/`
- [ ] Ícones gerados (`npx capacitor-assets generate`)
- [ ] Ícones validados em dispositivos reais

### Screenshots

#### Android
- [ ] Screenshot 1 (telefone, 1080x1920 ou similar)
- [ ] Screenshot 2 (telefone, 1080x1920 ou similar)
- [ ] Screenshot 3 (telefone, 1080x1920 ou similar) - opcional mas recomendado
- [ ] Screenshot 4 (telefone, 1080x1920 ou similar) - opcional
- [ ] Feature Graphic (1024x500px) - Android only

#### iOS
- [ ] Screenshot 1 iPhone 6.7" (1290x2796px)
- [ ] Screenshot 2 iPhone 6.7" (1290x2796px)
- [ ] Screenshot 3 iPhone 6.7" (1290x2796px)
- [ ] Screenshot 4 iPhone 6.7" (1290x2796px) - opcional
- [ ] Screenshot 5 iPhone 6.7" (1290x2796px) - opcional
- [ ] Screenshot 1 iPad 12.9" (2048x2732px)
- [ ] Screenshot 2 iPad 12.9" (2048x2732px)
- [ ] Screenshot 3 iPad 12.9" (2048x2732px)

**Sugestões de screenshots:**
1. Tela inicial com botões de ação
2. Formulário de denúncia
3. Tela de consulta de status
4. Tela de contatos de emergência
5. Modal LGPD ou tela educativa

---

## 📄 FASE 3: DOCUMENTAÇÃO LEGAL

### Política de Privacidade
- [ ] Política de privacidade escrita
- [ ] Política publicada em URL pública
- [ ] URL testada e acessível
- [ ] Conformidade com LGPD verificada
- [ ] Seção sobre dados coletados incluída
- [ ] Seção sobre uso dos dados incluída
- [ ] Seção sobre compartilhamento incluída
- [ ] Informações de contato incluídas

### Termos de Uso
- [ ] Termos de uso escritos
- [ ] Termos publicados em URL pública
- [ ] Responsabilidades do usuário definidas
- [ ] Limitações de responsabilidade incluídas
- [ ] Legislação aplicável especificada

### Outros Documentos
- [ ] Descrição curta escrita (80 caracteres)
- [ ] Descrição completa escrita (até 4000 caracteres)
- [ ] Palavras-chave definidas
- [ ] Notas da versão escritas
- [ ] Informações de contato de suporte definidas

---

## 🍎 FASE 4: APPLE APP STORE

### Conta e Configuração
- [ ] Apple Developer Account criada ($99/ano)
- [ ] Conta verificada e ativa
- [ ] App Store Connect acessível
- [ ] Mac disponível (ou serviço de build na nuvem)
- [ ] Xcode instalado e atualizado
- [ ] Certificados de desenvolvimento configurados
- [ ] Certificados de distribuição configurados

### Configuração no Xcode
- [ ] Projeto aberto no Xcode (`npx cap open ios`)
- [ ] Team selecionado
- [ ] Bundle Identifier configurado (`com.sosvozfeminina.app`)
- [ ] Versão definida (1.0.0)
- [ ] Build number definido (1)
- [ ] Signing configurado (Automatic ou Manual)
- [ ] Capabilities adicionadas (Location, Camera, etc.)
- [ ] Info.plist com descrições de permissões

### App Store Connect
- [ ] App criado no App Store Connect
- [ ] Informações básicas preenchidas
- [ ] Ícone 1024x1024 enviado
- [ ] Screenshots enviados (iPhone + iPad)
- [ ] Descrição preenchida
- [ ] Palavras-chave adicionadas
- [ ] Categoria selecionada
- [ ] Classificação etária definida
- [ ] URL de política de privacidade adicionada
- [ ] Informações de contato preenchidas

### Build e Submissão
- [ ] Archive criado (Product → Archive)
- [ ] Build validado
- [ ] Build enviado para App Store Connect
- [ ] Build processado (aguardar email)
- [ ] Build selecionado na versão do app
- [ ] Compliance de exportação respondido
- [ ] Advertising Identifier respondido
- [ ] App submetido para revisão
- [ ] Status: "Waiting for Review" ✅

---

## 🤖 FASE 5: GOOGLE PLAY STORE

### Conta e Configuração
- [ ] Google Play Console Account criada ($25 taxa única)
- [ ] Conta verificada e ativa
- [ ] Android Studio instalado
- [ ] JDK instalado
- [ ] Gradle funcionando

### Configuração Android
- [ ] Projeto aberto no Android Studio (`npx cap open android`)
- [ ] `build.gradle` configurado (applicationId, versions)
- [ ] Permissões no `AndroidManifest.xml` adicionadas
- [ ] Build de release configurado
- [ ] ProGuard configurado (opcional mas recomendado)

### Keystore (Chave de Assinatura)
- [ ] Keystore gerado (`keytool -genkey`)
- [ ] Keystore GUARDADO em local seguro (3+ backups)
- [ ] Senha anotada em gerenciador de senhas
- [ ] `keystore.properties` criado
- [ ] Signing configurado no `build.gradle`
- [ ] Keystore testado com build de release

### Google Play Console
- [ ] App criado no Play Console
- [ ] Nome do app definido
- [ ] Idioma padrão selecionado (Português Brasil)
- [ ] Tipo definido (App, não Jogo)
- [ ] Gratuito/Pago selecionado (Gratuito)

### Informações Obrigatórias
- [ ] Ícone 512x512 enviado
- [ ] Feature Graphic 1024x500 enviado
- [ ] Screenshots enviados (mínimo 2)
- [ ] Descrição curta preenchida
- [ ] Descrição completa preenchida
- [ ] Categoria selecionada
- [ ] Tags adicionadas

### Políticas e Compliance
- [ ] Política de privacidade (URL) adicionada
- [ ] Formulário de segurança de dados preenchido
- [ ] Classificação de conteúdo completada
- [ ] Público-alvo definido
- [ ] Países/regiões selecionados
- [ ] Questionário de anúncios respondido

### Build e Submissão
- [ ] AAB gerado (`./gradlew bundleRelease`)
- [ ] AAB assinado com keystore
- [ ] Versão de produção criada
- [ ] AAB enviado para Play Console
- [ ] Notas da versão adicionadas
- [ ] Todas as seções com ✅ verde
- [ ] App enviado para revisão
- [ ] Status: "In Review" ✅

---

## 🧪 FASE 6: TESTES PRÉ-PUBLICAÇÃO

### Testes Funcionais
- [ ] Criar denúncia com localização
- [ ] Criar denúncia sem localização
- [ ] Upload de foto funciona
- [ ] Upload de múltiplas fotos funciona
- [ ] Upload de áudio funciona
- [ ] Consultar status de denúncia
- [ ] Visualizar denúncia existente
- [ ] Login de admin funciona
- [ ] Dashboard admin carrega
- [ ] Estatísticas aparecem corretamente
- [ ] Logs de auditoria funcionam
- [ ] Logout funciona

### Testes de Permissões
- [ ] Solicitar localização funciona
- [ ] Negar localização funciona (app continua)
- [ ] Solicitar câmera funciona
- [ ] Negar câmera funciona (mostra mensagem apropriada)
- [ ] Solicitar galeria funciona
- [ ] Negar galeria funciona (mostra mensagem apropriada)

### Testes de Conectividade
- [ ] App funciona com WiFi
- [ ] App funciona com dados móveis
- [ ] App mostra mensagem sem internet
- [ ] App reconecta automaticamente
- [ ] Requisições para backend funcionam

### Testes de UI/UX
- [ ] Todas as telas aparecem corretamente
- [ ] Navegação entre telas funciona
- [ ] Botão voltar funciona
- [ ] Drawer/menu funciona
- [ ] Modais abrem e fecham
- [ ] Formulários validam corretamente
- [ ] Mensagens de erro aparecem
- [ ] Toasts/notificações funcionam
- [ ] Cores estão corretas
- [ ] Ícones aparecem
- [ ] Textos estão legíveis
- [ ] Acessibilidade básica OK

### Testes de Performance
- [ ] App abre em menos de 3 segundos
- [ ] Splash screen aparece
- [ ] Transições são suaves
- [ ] Sem lags ou travamentos
- [ ] Uso de memória razoável
- [ ] Bateria não drena excessivamente
- [ ] Sem crashes

### Testes de Segurança
- [ ] HTTPS está funcionando
- [ ] Tokens JWT salvos corretamente
- [ ] Tokens expiram apropriadamente
- [ ] Logout limpa dados sensíveis
- [ ] URLs da API estão corretas (produção)
- [ ] Dados sensíveis não aparecem em logs
- [ ] Certificados SSL válidos

### Testes em Dispositivos
- [ ] Testado em Android 9 ou superior
- [ ] Testado em iOS 13 ou superior
- [ ] Testado em tela pequena (5")
- [ ] Testado em tela média (6")
- [ ] Testado em tela grande (6.5"+)
- [ ] Testado em tablet
- [ ] Testado em modo retrato
- [ ] Testado em modo paisagem
- [ ] Testado com diferentes densidades de tela

### Testes Beta
- [ ] TestFlight configurado (iOS)
- [ ] Internal Testing configurado (Android)
- [ ] 5+ beta testers convidados
- [ ] Feedback coletado
- [ ] Bugs reportados corrigidos
- [ ] Segunda rodada de testes realizada

---

## 📊 FASE 7: PÓS-PUBLICAÇÃO

### Monitoramento
- [ ] Google Analytics configurado (opcional)
- [ ] Firebase Crashlytics configurado (opcional)
- [ ] App Store Analytics verificado
- [ ] Google Play Analytics verificado
- [ ] Alertas de crashes configurados

### Métricas Acompanhadas
- [ ] Número de downloads
- [ ] Avaliações e reviews
- [ ] Taxa de crashes
- [ ] Tempo médio de uso
- [ ] Retenção de usuários (D1, D7, D30)
- [ ] Funil de conversão

### Suporte
- [ ] Email de suporte monitorado
- [ ] Reviews respondidos (positivos e negativos)
- [ ] FAQs criados baseado em perguntas comuns
- [ ] Canal de comunicação com usuários ativo

### Marketing
- [ ] Post em redes sociais sobre lançamento
- [ ] Comunicado em grupos/comunidades relevantes
- [ ] Imprensa/blogs notificados (se aplicável)
- [ ] QR code para download criado
- [ ] Banner de "Disponível na App Store/Play Store" no site

---

## 🚀 ROADMAP DE ATUALIZAÇÕES

### Versão 1.1 (planejada)
- [ ] Feature X
- [ ] Feature Y
- [ ] Bug fix Z
- [ ] Melhorias de performance

### Versão 1.2 (futura)
- [ ] Feature A
- [ ] Feature B
- [ ] Redesign de tela C

---

## 📝 NOTAS E OBSERVAÇÕES

### Datas Importantes
- Data de início do desenvolvimento: __________
- Data de submissão iOS: __________
- Data de aprovação iOS: __________
- Data de submissão Android: __________
- Data de aprovação Android: __________
- Data de lançamento público: __________

### Informações Importantes
- **Bundle ID/Package Name**: com.sosvozfeminina.app
- **Versão atual**: 1.0.0
- **Build number**: 1
- **URL do backend**: https://api-sos-voz-feminina.onrender.com
- **URL do frontend**: https://sos-voz-feminina.vercel.app

### Contatos
- **Apple Developer**: [email]
- **Google Play**: [email]
- **Email de suporte**: [email]
- **Website**: [url]

### Senhas e Acessos (NÃO COMITAR ESTE ARQUIVO COM SENHAS)
- Apple Developer Account: [usar gerenciador de senhas]
- Google Play Account: [usar gerenciador de senhas]
- Keystore Android: [usar gerenciador de senhas]

---

**Última atualização**: [data]

**Status geral**: 
- [ ] Não iniciado
- [ ] Em desenvolvimento
- [ ] Em testes
- [ ] Submetido para revisão
- [ ] Publicado ✅

---

**Dica**: Marque este arquivo como privado no Git se for adicionar informações sensíveis!

Adicione ao `.gitignore`:
```
CHECKLIST_PUBLICACAO.md
```

