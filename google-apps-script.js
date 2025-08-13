// GOOGLE APPS SCRIPT - Código para implementar no Google Apps Script
// Acesse: https://script.google.com/
// Crie um novo projeto e cole este código

function doPost(e) {
  try {
    // Obter os dados do formulário
    const formData = e.parameter;
    
    // Obter a planilha ativa (substitua pelo ID da sua planilha)
    const spreadsheet = SpreadsheetApp.openById('SUA_PLANILHA_ID_AQUI');
    const sheet = spreadsheet.getSheetByName('Testemunhos');
    
    // Se a planilha não existir, criar
    if (!sheet) {
      const newSheet = spreadsheet.insertSheet('Testemunhos');
      // Criar cabeçalhos
      newSheet.getRange(1, 1, 1, 6).setValues([['Timestamp', 'Nome', 'Email', 'Categoria', 'Testemunho', 'Autorizacao']]);
    }
    
    // Processar o nome baseado na autorização
    let nomeExibicao = '';
    if (formData.Autorizacao === 'Sim' && formData.Nome && formData.Nome.trim() !== '') {
      nomeExibicao = formData.Nome.trim();
    } else {
      nomeExibicao = 'Anônimo';
    }
    
    // Preparar dados para inserção
    const rowData = [
      formData.Timestamp || new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}),
      nomeExibicao,
      formData.Email || '',
      formData.Categoria || '',
      formData.Testemunho || '',
      formData.Autorizacao || 'Não'
    ];
    
    // Inserir dados na próxima linha disponível
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, 1, rowData.length).setValues([rowData]);
    
    // Retornar resposta de sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': lastRow + 1 }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retornar erro
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Formulário de Testemunhos - Campanha de Daniel')
    .setMimeType(ContentService.MimeType.TEXT);
}

// INSTRUÇÕES DE IMPLEMENTAÇÃO:
// 1. Acesse https://script.google.com/
// 2. Clique em "Novo projeto"
// 3. Cole este código
// 4. Salve o projeto (Ctrl+S)
// 5. Clique em "Deploy" > "New deployment"
// 6. Escolha "Web app"
// 7. Configure:
//    - Execute as: "Me"
//    - Who has access: "Anyone"
// 8. Clique em "Deploy"
// 9. Copie a URL gerada
// 10. Substitua 'SUA_PLANILHA_ID_AQUI' pelo ID da sua planilha do Google Sheets
// 11. Atualize a URL no arquivo script.js do site
