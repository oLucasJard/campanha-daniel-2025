/**
 * Google Sheets Integration para Landing Page de Jovens
 * MANT Paraíso - Ministério de Jovens
 * 
 * Este arquivo contém as funções necessárias para integrar o formulário
 * de indicação de jovens com o Google Sheets através do Google Apps Script.
 */

// Configurações da integração
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Função principal para enviar dados do formulário
async function enviarIndicacao(formData) {
    try {
        // Mostra loading
        mostrarLoading();
        
        // Prepara os dados para envio
        const dadosParaEnviar = {
            'Nome do Jovem': formData.get('NomeJovem'),
            'Idade': formData.get('IdadeJovem'),
            'Telefone do Jovem': formData.get('TelefoneJovem'),
            'Endereço': formData.get('EnderecoJovem'),
            'Bairro': formData.get('BairroJovem'),
            'Situação Atual': formData.get('SituacaoJovem'),
            'Motivo da Indicação': formData.get('MotivoIndicacao'),
            'Nome do Indicador': formData.get('NomeIndicador'),
            'Telefone do Indicador': formData.get('TelefoneIndicador'),
            'Relação com o Jovem': formData.get('RelacaoJovem'),
            'Observações': formData.get('Observacoes'),
            'Data da Indicação': new Date().toLocaleDateString('pt-BR'),
            'Hora da Indicação': new Date().toLocaleTimeString('pt-BR'),
            'Status': 'Nova Indicação'
        };

        // Envia para o Google Apps Script
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Necessário para Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosParaEnviar)
        });

        // Simula resposta (devido ao no-cors)
        if (response.status === 0 || response.ok) {
            mostrarSucesso();
            limparFormulario();
            enviarEmailConfirmacao(dadosParaEnviar);
        } else {
            throw new Error('Erro no envio');
        }

    } catch (error) {
        console.error('Erro ao enviar indicação:', error);
        mostrarErro();
    } finally {
        esconderLoading();
    }
}

// Função para mostrar loading
function mostrarLoading() {
    const btnEnviar = document.querySelector('.btn-indicacao');
    if (btnEnviar) {
        btnEnviar.innerHTML = '⏳ Enviando...';
        btnEnviar.disabled = true;
    }
}

// Função para esconder loading
function esconderLoading() {
    const btnEnviar = document.querySelector('.btn-indicacao');
    if (btnEnviar) {
        btnEnviar.innerHTML = '📤 Enviar Indicação';
        btnEnviar.disabled = false;
    }
}

// Função para mostrar mensagem de sucesso
function mostrarSucesso() {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.innerHTML = `
            <div class="alert alert-success">
                <h4>✅ Indicação Enviada com Sucesso!</h4>
                <p>Obrigado por nos ajudar a alcançar mais jovens! Nossa equipe entrará em contato em até 48 horas para confirmar os detalhes e agendar uma visita.</p>
                <div class="alert-details">
                    <p><strong>Próximos passos:</strong></p>
                    <ul>
                        <li>📞 Entraremos em contato em até 48 horas</li>
                        <li>📅 Confirmaremos os detalhes da visita</li>
                        <li>👥 Nossa equipe treinada fará a visita</li>
                        <li>💝 Acompanhamento contínuo após a visita</li>
                    </ul>
                </div>
            </div>
        `;
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth' });
    }
}

// Função para mostrar mensagem de erro
function mostrarErro() {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.innerHTML = `
            <div class="alert alert-error">
                <h4>❌ Erro ao Enviar Indicação</h4>
                <p>Desculpe, ocorreu um erro ao enviar sua indicação. Por favor, tente novamente ou entre em contato conosco diretamente.</p>
                <div class="alert-actions">
                    <button onclick="tentarNovamente()" class="btn btn-secondary">🔄 Tentar Novamente</button>
                    <a href="mailto:icparaisoto@gmail.com" class="btn btn-primary">📧 Contatar Diretamente</a>
                </div>
            </div>
        `;
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth' });
    }
}

// Função para limpar formulário
function limparFormulario() {
    const form = document.getElementById('formularioIndicacao');
    if (form) {
        form.reset();
    }
}

// Função para tentar novamente
function tentarNovamente() {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.style.display = 'none';
    }
}

// Função para enviar e-mail de confirmação (simulação)
function enviarEmailConfirmacao(dados) {
    // Aqui você pode integrar com serviços como:
    // - EmailJS
    // - SendGrid
    // - Google Apps Script (e-mail automático)
    
    console.log('E-mail de confirmação seria enviado para:', dados['Nome do Indicador']);
}

// Função para validar formulário
function validarFormulario() {
    const camposObrigatorios = [
        'NomeJovem',
        'IdadeJovem', 
        'EnderecoJovem',
        'BairroJovem',
        'MotivoIndicacao',
        'NomeIndicador',
        'TelefoneIndicador'
    ];

    let valido = true;
    const erros = [];

    camposObrigatorios.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento && !elemento.value.trim()) {
            valido = false;
            erros.push(`Campo "${elemento.previousElementSibling.textContent.replace(' *', '')}" é obrigatório`);
            elemento.classList.add('error');
        } else if (elemento) {
            elemento.classList.remove('error');
        }
    });

    // Validação específica para idade
    const idade = document.getElementById('IdadeJovem');
    if (idade && (idade.value < 12 || idade.value > 35)) {
        valido = false;
        erros.push('A idade deve estar entre 12 e 35 anos');
        idade.classList.add('error');
    }

    // Validação de telefone (formato básico)
    const telefone = document.getElementById('TelefoneIndicador');
    if (telefone && telefone.value) {
        const telefoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
        if (!telefoneRegex.test(telefone.value.replace(/\D/g, ''))) {
            valido = false;
            erros.push('Formato de telefone inválido');
            telefone.classList.add('error');
        }
    }

    if (!valido) {
        mostrarErrosValidacao(erros);
    }

    return valido;
}

// Função para mostrar erros de validação
function mostrarErrosValidacao(erros) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.innerHTML = `
            <div class="alert alert-warning">
                <h4>⚠️ Corrija os Erros Abaixo</h4>
                <ul>
                    ${erros.map(erro => `<li>${erro}</li>`).join('')}
                </ul>
            </div>
        `;
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth' });
    }
}

// Função para formatar telefone automaticamente
function formatarTelefone(input) {
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length <= 11) {
        valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
        valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    
    input.value = valor;
}

// Função para inicializar validações
function inicializarValidacoes() {
    // Adiciona formatação automática para telefones
    const telefones = document.querySelectorAll('input[type="tel"]');
    telefones.forEach(telefone => {
        telefone.addEventListener('input', () => formatarTelefone(telefone));
    });

    // Adiciona validação em tempo real
    const camposObrigatorios = document.querySelectorAll('input[required], textarea[required], select[required]');
    camposObrigatorios.forEach(campo => {
        campo.addEventListener('blur', () => {
            if (!campo.value.trim()) {
                campo.classList.add('error');
            } else {
                campo.classList.remove('error');
            }
        });
    });
}

// Função para capturar dados do formulário
function capturarDadosFormulario() {
    const form = document.getElementById('formularioIndicacao');
    if (!form) return null;

    const formData = new FormData(form);
    
    // Adiciona dados extras
    formData.append('Timestamp', new Date().toISOString());
    formData.append('UserAgent', navigator.userAgent);
    formData.append('URL', window.location.href);
    
    return formData;
}

// Event listener para envio do formulário
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formularioIndicacao');
    
    if (form) {
        // Inicializa validações
        inicializarValidacoes();
        
        // Adiciona listener para envio
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Valida formulário
            if (!validarFormulario()) {
                return;
            }
            
            // Captura dados
            const formData = capturarDadosFormulario();
            if (!formData) {
                mostrarErro();
                return;
            }
            
            // Envia dados
            await enviarIndicacao(formData);
        });
    }
});

// Função para exportar dados (para administradores)
function exportarDados() {
    // Esta função pode ser usada para exportar dados para CSV/Excel
    // Apenas para administradores da igreja
    console.log('Função de exportação - apenas para administradores');
}

// Função para estatísticas (para administradores)
function obterEstatisticas() {
    // Esta função pode ser usada para mostrar estatísticas
    // Apenas para administradores da igreja
    console.log('Função de estatísticas - apenas para administradores');
}

// Exporta funções para uso global
window.jovensForm = {
    enviarIndicacao,
    validarFormulario,
    limparFormulario,
    exportarDados,
    obterEstatisticas
};

console.log('✅ Integração Google Sheets carregada com sucesso!');
console.log('📝 Configure GOOGLE_APPS_SCRIPT_URL com seu ID do Google Apps Script');
