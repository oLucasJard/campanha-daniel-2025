# 📊 Integração com Google Sheets - Campanha de Daniel

## 🎯 **Objetivo**
Integrar o formulário de testemunhos do site com o Google Sheets para armazenar e gerenciar os dados automaticamente.

## 🚀 **Implementação**

### **Passo 1: Criar Planilha no Google Sheets**
1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Copie o ID da planilha da URL (ex: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`)
4. Renomeie a primeira aba para "Testemunhos"

### **Passo 2: Criar Google Apps Script**
1. Acesse [Google Apps Script](https://script.google.com)
2. Clique em "Novo projeto"
3. Cole o código do arquivo `google-apps-script.js`
4. **IMPORTANTE**: Substitua `'SUA_PLANILHA_ID_AQUI'` pelo ID da sua planilha
5. Salve o projeto (Ctrl+S)
6. Dê um nome ao projeto (ex: "Campanha Daniel - Testemunhos")

### **Passo 3: Configurar Deploy**
1. Clique em "Deploy" > "New deployment"
2. Escolha "Web app"
3. Configure:
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Clique em "Deploy"
5. Autorize o script quando solicitado
6. Copie a URL gerada

### **Passo 4: Atualizar Site**
1. Abra o arquivo `script.js`
2. Localize a linha com `scriptURL`
3. Substitua pela URL do seu Google Apps Script

## 📋 **Estrutura da Planilha**

A planilha será criada automaticamente com as seguintes colunas:

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| Timestamp | Data e hora do envio | 15/01/2024 14:30:25 |
| Nome | Nome completo ou "Anônimo" | João Silva / Anônimo |
| Email | E-mail do participante | joao@email.com |
| Categoria | Categoria do testemunho | Cura e Saúde |
| Testemunho | Texto do testemunho | Durante a campanha... |
| Autorizacao | Se autoriza publicação | Sim/Não |

### **📝 Comportamento do Campo Nome**
- **✅ Com autorização**: Nome é exibido normalmente
- **❌ Sem autorização**: Nome é substituído por "Anônimo"
- **🔄 Flexibilidade**: Usuário pode enviar testemunho sem nome
- **🔒 Privacidade**: Respeita a escolha do usuário

## 🔧 **Configurações Importantes**

### **Permissões do Google Apps Script**
- **Execute as**: Deve ser "Me" para acessar suas planilhas
- **Who has access**: "Anyone" para permitir envios do site

### **Segurança**
- O script só pode acessar planilhas que você compartilhou
- Dados são enviados via HTTPS
- E-mails não são expostos publicamente

## 🧪 **Testando a Integração**

1. Preencha o formulário no site
2. Clique em "ENVIAR MEU TESTEMUNHO"
3. Verifique se aparece a mensagem de sucesso
4. Abra a planilha e confirme se os dados foram inseridos

## ❌ **Solução de Problemas**

### **Erro: "Script function not found: doPost"**
- Verifique se o código foi salvo corretamente
- Confirme se o deploy foi feito como "Web app"

### **Erro: "Cannot find spreadsheet"**
- Verifique se o ID da planilha está correto
- Confirme se a planilha está compartilhada com sua conta

### **Formulário não envia**
- Verifique o console do navegador (F12)
- Confirme se a URL do script está correta
- Teste se o Google Apps Script está funcionando

## 📱 **Monitoramento**

### **Verificar Logs**
1. No Google Apps Script, clique em "Executions"
2. Veja os logs de execução
3. Identifique possíveis erros

### **Backup dos Dados**
- Os dados ficam salvos na sua conta Google
- Você pode exportar a planilha quando quiser
- Considere fazer backups regulares

## 🎉 **Benefícios da Integração**

✅ **Automatização**: Dados inseridos automaticamente  
✅ **Organização**: Estrutura clara e organizada  
✅ **Acesso**: Visualize testemunhos de qualquer lugar  
✅ **Backup**: Dados seguros na nuvem  
✅ **Análise**: Possibilidade de criar relatórios  
✅ **Colaboração**: Compartilhe com equipe da igreja  

## 📞 **Suporte**

Se encontrar problemas:
1. Verifique os logs do Google Apps Script
2. Confirme as configurações de permissão
3. Teste com dados simples primeiro
4. Consulte a documentação oficial do Google Apps Script

---

**🎯 Resultado Final**: Formulário funcionando perfeitamente com armazenamento automático no Google Sheets!
