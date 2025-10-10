# 📱 **TESTE MOBILE - S.O.S Voz Feminina**

## 🎯 **OBJETIVO:**
Testar o app Android e identificar problemas específicos do mobile.

---

## 🔍 **COMO VER LOGS NO ANDROID STUDIO:**

### **Método 1: Logcat (Recomendado)**
1. **Abrir Android Studio**
2. **View → Tool Windows → Logcat**
3. **Filtrar por:**
   - `S.O.S Voz Feminina`
   - `Error`
   - `Exception`

### **Método 2: Terminal**
```bash
# Ver logs em tempo real
adb logcat | grep -i "sos\|voz\|feminina\|error"

# Ver todos os logs
adb logcat
```

---

## 📋 **CHECKLIST DE TESTE:**

### **✅ Teste 1: Campo de Data**
- [ ] Abrir app no emulador
- [ ] Ir para "Fazer Denúncia"
- [ ] Clicar no campo "Data do Ocorrido"
- [ ] Selecionar uma data
- [ ] **Verificar:** Data aparece no formato brasileiro (DD/MM/YYYY)
- [ ] **Verificar:** Mensagem "📅 Data selecionada: XX/XX/XXXX"

### **✅ Teste 2: Envio de Denúncia**
- [ ] Preencher todos os campos obrigatórios:
  - [ ] Tipo de Violência
  - [ ] Data do Ocorrido
  - [ ] Descrição da situação
- [ ] Clicar em "Enviar Denúncia Anônima"
- [ ] **Verificar:** Não há erro 500
- [ ] **Verificar:** Modal de confirmação aparece

### **✅ Teste 3: Logs do Backend**
- [ ] No terminal do backend, verificar logs:
  - [ ] `=== INÍCIO DA CRIAÇÃO DE DENÚNCIA ===`
  - [ ] `✅ Data validada com sucesso: XX/XX/XXXX`
  - [ ] `Denúncia salva com sucesso!`

---

## 🐛 **PROBLEMAS CONHECIDOS E SOLUÇÕES:**

### **❌ Problema: "Campo dataOcorrido é obrigatório"**
**Causa:** Data não está sendo enviada corretamente
**Solução:** Verificar se o campo de data está sendo preenchido

### **❌ Problema: "Formato de data inválido"**
**Causa:** Data está em formato americano (MM/DD/YYYY)
**Solução:** Converter para formato brasileiro (DD/MM/YYYY)

### **❌ Problema: "Erro interno do servidor"**
**Causa:** Erro no backend
**Solução:** Verificar logs do backend para mais detalhes

---

## 📊 **LOGS ESPERADOS:**

### **✅ Sucesso:**
```
=== INÍCIO DA CRIAÇÃO DE DENÚNCIA ===
Body recebido: { relato: '...', tipoViolencia: 'psicologica', dataOcorrido: '25/09/2025' }
✅ Data validada com sucesso: 25/09/2025
Gerando ID público...
ID público gerado: 2509251001
Criando objeto Denuncia...
Salvando denúncia no banco...
Denúncia salva com sucesso!
```

### **❌ Erro:**
```
=== INÍCIO DA CRIAÇÃO DE DENÚNCIA ===
Body recebido: { relato: '...', tipoViolencia: 'psicologica', dataOcorrido: '' }
❌ ERRO: Campo dataOcorrido está vazio
```

---

## 🚀 **PRÓXIMOS PASSOS:**

1. **Testar o app Android**
2. **Verificar logs no Logcat**
3. **Confirmar que a data está sendo enviada corretamente**
4. **Se funcionar, fazer merge para main**
5. **Se não funcionar, ajustar código**

---

## 💡 **DICAS:**

- **Sempre verificar os logs** antes de reportar problemas
- **Testar em diferentes emuladores** (Android 12+, 13+)
- **Verificar se o backend está rodando** na porta 3000
- **Usar o formato de data brasileiro** (DD/MM/YYYY)

---

**🎯 RESULTADO ESPERADO:** App Android funcionando perfeitamente com data em formato brasileiro!
