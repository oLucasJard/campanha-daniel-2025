# Implementação Google Sheets - Landing Page de Jovens

## 📋 Visão Geral

Este guia explica como integrar o formulário de indicação de jovens com o Google Sheets para automatizar o processo de coleta e organização das indicações.

## 🎯 Benefícios da Integração

- **Coleta automática** de indicações em planilha organizada
- **Notificações por e-mail** para a equipe responsável
- **Organização eficiente** dos dados para acompanhamento
- **Relatórios automáticos** de conversão e status
- **Integração gratuita** usando Google Apps Script

## 🚀 Passo a Passo da Implementação

### **1. Criar Planilha no Google Sheets**

1. Acesse [sheets.google.com](https://sheets.google.com)
2. Crie uma nova planilha chamada "Indicações de Jovens - MANT Paraíso"
3. Configure as colunas conforme a estrutura abaixo:

#### **Estrutura da Planilha:**
```
A1: Timestamp
B1: Nome do Jovem
C1: Idade
D1: Telefone do Jovem
E1: Endereço
F1: Situação Atual
G1: Nome do Indicador
H1: Telefone do Indicador
I1: Relação com o Jovem
J1: Observações
```

### **2. Configurar Google Apps Script**

1. Na planilha, vá em **Extensões > Apps Script**
2. Substitua o código padrão pelo código abaixo:

```javascript
function doPost(e) {
  try {
    // Obtém os dados enviados
    const dados = JSON.parse(e.postData.contents);
    
    // Obtém a planilha ativa
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    const aba = planilha.getActiveSheet();
    
    // Prepara os dados para inserção
    const linha = [
      dados['Timestamp'] || new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}),
      dados['NomeJovem'] || '',
      dados['IdadeJovem'] || '',
      dados['TelefoneJovem'] || '',
      dados['EnderecoJovem'] || '',
      dados['SituacaoJovem'] || '',
      dados['NomeIndicador'] || '',
      dados['TelefoneIndicador'] || '',
      dados['RelacaoJovem'] || '',
      dados['Observacoes'] || ''
    ];
    
    // Insere a nova linha
    aba.appendRow(linha);
    
    // Envia e-mail de notificação
    enviarNotificacao(dados);
    
    // Retorna sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Erro:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function enviarNotificacao(dados) {
  try {
    const emailDestino = 'icparaisoto@gmail.com'; // E-mail da equipe
    const assunto = '🚨 Nova Indicação de Jovem - MANT Paraíso';
    
    const corpoEmail = `
      <h2>Nova Indicação de Jovem Recebida!</h2>
      
      <h3>📋 Dados do Jovem:</h3>
      <p><strong>Nome:</strong> ${dados['NomeJovem']}</p>
      <p><strong>Idade:</strong> ${dados['IdadeJovem']} anos</p>
      <p><strong>Telefone:</strong> ${dados['TelefoneJovem'] || 'Não informado'}</p>
      <p><strong>Endereço:</strong> ${dados['EnderecoJovem']}</p>
      <p><strong>Situação:</strong> ${dados['SituacaoJovem'] || 'Não informada'}</p>
      
      <h3>👤 Dados do Indicador:</h3>
      <p><strong>Nome:</strong> ${dados['NomeIndicador']}</p>
      <p><strong>Telefone:</strong> ${dados['TelefoneIndicador']}</p>
      <p><strong>Relação:</strong> ${dados['RelacaoJovem'] || 'Não informada'}</p>
      
      ${dados['Observacoes'] ? `<h3>📝 Observações:</h3><p>${dados['Observacoes']}</p>` : ''}
      
      <h3>📅 Próximos Passos:</h3>
      <ol>
        <li>Entrar em contato com o indicador em até 48 horas</li>
        <li>Confirmar detalhes e agendar visita</li>
        <li>Realizar visita com equipe treinada</li>
        <li>Fazer acompanhamento contínuo</li>
      </ol>
      
      <hr>
      <p><em>Indicação recebida em ${dados['Timestamp']}</em></p>
      <p><strong>MANT Paraíso - Ministério de Jovens</strong></p>
    `;
    
    // Envia o e-mail
    GmailApp.sendEmail(emailDestino, assunto, '', { htmlBody: corpoEmail });
    
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
}

// Função para teste (opcional)
function doGet(e) {
  return ContentService
    .createTextOutput('API funcionando! Use POST para enviar dados.')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### **3. Configurar Permissões e Deploy**

1. **Salve o script** (Ctrl+S)
2. **Configure as permissões**:
   - Clique em "Executar" na primeira vez
   - Autorize o Google Apps Script
   - Aceite todas as permissões solicitadas

3. **Faça o deploy**:
   - Clique em "Deploy" > "New deployment"
   - Escolha "Web app"
   - Configure:
     - **Execute as**: "Me"
     - **Who has access**: "Anyone"
   - Clique em "Deploy"

4. **Copie a URL** gerada (será algo como: `https://script.google.com/macros/s/SCRIPT_ID/exec`)

### **4. Atualizar o Código da Landing Page**

1. Abra o arquivo `google-sheets-integration.js`
2. Substitua `YOUR_SCRIPT_ID` pela URL do seu script:

```javascript
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/SEU_SCRIPT_ID_AQUI/exec';
```

3. Adicione o script à landing page:

```html
<!-- Adicione antes do </body> -->
<script src="google-sheets-integration.js"></script>
```

## 🔧 Configurações Adicionais

### **Formatação da Planilha**

1. **Cabeçalhos**: Formate em negrito com fundo colorido
2. **Colunas de Status**: Use validação de dados para criar dropdowns
3. **Datas**: Configure formato brasileiro (dd/mm/aaaa)
4. **Filtros**: Adicione filtros para facilitar a organização

### **Validação de Dados**

```javascript
// Adicione no Google Apps Script para validação adicional
function validarDados(dados) {
  const erros = [];
  
  if (!dados['NomeJovem'] || dados['NomeJovem'].trim() === '') {
    erros.push('Nome do jovem é obrigatório');
  }
  
  if (!dados['IdadeJovem'] || dados['IdadeJovem'] < 12 || dados['IdadeJovem'] > 35) {
    erros.push('Idade deve estar entre 12 e 35 anos');
  }
  
  if (!dados['EnderecoJovem'] || dados['EnderecoJovem'].trim() === '') {
    erros.push('Endereço é obrigatório');
  }
  
  return erros;
}
```

### **Notificações Personalizadas**

```javascript
// Notificação para WhatsApp (usando Twilio ou similar)
function enviarNotificacaoWhatsApp(dados) {
  // Implementar integração com WhatsApp Business API
  console.log('Notificação WhatsApp seria enviada para:', dados['Telefone do Indicador']);
}
```

## 📊 Relatórios e Dashboards

### **Relatório Semanal Automático**

```javascript
function gerarRelatorioSemanal() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const aba = planilha.getActiveSheet();
  
  // Filtra dados da semana atual
  const hoje = new Date();
  const inicioSemana = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Gera estatísticas
  const totalIndicacoes = contarIndicacoesSemana(inicioSemana, hoje);
  const visitasRealizadas = contarVisitasRealizadas(inicioSemana, hoje);
  const conversoes = contarConversoes(inicioSemana, hoje);
  
  // Envia relatório por e-mail
  const corpoRelatorio = `
    <h2>📊 Relatório Semanal - Ministério de Jovens</h2>
    <p><strong>Período:</strong> ${inicioSemana.toLocaleDateString('pt-BR')} a ${hoje.toLocaleDateString('pt-BR')}</p>
    
    <h3>📈 Estatísticas:</h3>
    <ul>
      <li>Total de Indicações: ${totalIndicacoes}</li>
      <li>Visitas Realizadas: ${visitasRealizadas}</li>
      <li>Conversões: ${conversoes}</li>
      <li>Taxa de Conversão: ${((conversoes/totalIndicacoes)*100).toFixed(1)}%</li>
    </ul>
  `;
  
  GmailApp.sendEmail('icparaisoto@gmail.com', '📊 Relatório Semanal - Ministério de Jovens', '', { htmlBody: corpoRelatorio });
}
```

## 🚨 Solução de Problemas

### **Erro de CORS**
- O Google Apps Script já está configurado para evitar problemas de CORS
- Use `mode: 'no-cors'` no fetch

### **Dados não chegando**
- Verifique se a URL do script está correta
- Confirme se as permissões estão configuradas
- Teste com a função `doGet` primeiro

### **E-mails não sendo enviados**
- Verifique se o Gmail está habilitado no Apps Script
- Confirme se o e-mail de destino está correto
- Teste com um e-mail simples primeiro

## 📱 Próximos Passos

### **1. Automações Avançadas**
- Integração com WhatsApp Business
- Lembretes automáticos para equipe
- Dashboard em tempo real

### **2. Analytics e Métricas**
- Google Analytics para conversões
- Heatmaps para otimização
- A/B testing de formulários

### **3. Integração com CRM**
- HubSpot, Salesforce ou similar
- Workflow automatizado de acompanhamento
- Relatórios avançados

## 📞 Suporte

Para dúvidas sobre a implementação:
- **E-mail**: icparaisoto@gmail.com
- **Documentação**: [Google Apps Script](https://developers.google.com/apps-script)
- **Comunidade**: [Stack Overflow](https://stackoverflow.com/questions/tagged/google-apps-script)

---

**✅ Implementação completa = Formulário funcionando + Dados organizados + Notificações automáticas!**
