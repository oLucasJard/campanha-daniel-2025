

// Smooth Scrolling para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});



// Animação de entrada dos elementos no scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animação aos elementos
document.querySelectorAll('.service-card, .stat, .about-image').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Efeito de parallax sutil no hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImageContainer = document.querySelector('.hero-image-container');
    
    if (heroImageContainer) {
        const rate = scrolled * -0.5;
        heroImageContainer.style.transform = `translateY(${rate}px)`;
    }
});

// Contador animado para as estatísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Iniciar contadores quando as estatísticas entrarem na tela
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h3');
            const target = parseInt(statNumber.textContent);
            animateCounter(statNumber, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Efeito de hover nos cards de serviço
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Botões com efeito de ripple
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Adicionar CSS para o efeito ripple
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Lazy loading para imagens (quando adicionar imagens reais)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Inicializar lazy loading
lazyLoadImages();

// Adicionar classe 'scrolled' ao body para estilos condicionais
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});

// Funcionalidades do Formulário de Testemunhos - Integração com Google Sheets
document.addEventListener('DOMContentLoaded', function() {
    const testimonyForm = document.getElementById('testimonyForm');
    const testemunhoTextarea = document.getElementById('testemunho');
    const charCount = document.getElementById('char-count');
    const formMessage = document.getElementById('form-message');
    
    // URL do Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwlFAIqiILcRjUH3h1FSAvdohAijAnzvXS3qiD96t45g2PhE5ri7z2P2QCIR3r15rygSg/exec';
    
    if (testimonyForm && testemunhoTextarea) {
        // Contador de caracteres
        testemunhoTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            if (length > 800) {
                charCount.style.color = '#ff6b6b';
            } else if (length > 600) {
                charCount.style.color = '#ffa500';
            } else {
                charCount.style.color = 'var(--text-gray)';
            }
        });
        
        // Validação em tempo real
        const inputs = testimonyForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Envio do formulário para Google Sheets
        testimonyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitToGoogleSheets();
            }
        });
    }
});

// Função para enviar dados para o Google Sheets
function submitToGoogleSheets() {
    const form = document.getElementById('testimonyForm');
    const formMessage = document.getElementById('form-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Adiciona timestamp
    document.getElementById('timestamp').value = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
    
    // Processa o status da autorização
    const autorizacaoCheckbox = document.getElementById('autorizacao');
    const nomeField = document.getElementById('nome');
    
    // Se não autorizar publicação, limpa o nome
    if (!autorizacaoCheckbox.checked) {
        nomeField.value = '';
    }
    
    // Define o valor da autorização (Sim/Não)
    autorizacaoCheckbox.value = autorizacaoCheckbox.checked ? 'Sim' : 'Não';
    
    // Mostra mensagem de carregamento
    showFormMessage('Enviando seu testemunho, aguarde...', 'loading');
    
    // Desabilita botão e mostra loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Enviando...';
    
    // URL do Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwlFAIqiILcRjUH3h1FSAvdohAijAnzvXS3qiD96t45g2PhE5ri7z2P2QCIR3r15rygSg/exec';
    
    fetch(scriptURL, { 
        method: 'POST', 
        body: new FormData(form)
    })
    .then(response => {
        console.log('Success!', response);
        showFormMessage('Testemunho enviado com sucesso! Deus abençoe. 🙏', 'success');
        form.reset();
        document.getElementById('char-count').textContent = '0';
        
        // Limpa erros
        clearAllErrors();
    })
    .catch(error => {
        console.error('Error!', error.message);
        showFormMessage('Ocorreu um erro ao enviar seu testemunho. Tente novamente.', 'error');
    })
    .finally(() => {
        // Restaura botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    });
}

// Função para mostrar mensagens do formulário
function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Auto-hide para mensagens de sucesso
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Função para limpar todos os erros
function clearAllErrors() {
    document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
    });
    
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.style.borderColor = 'var(--border-color)';
    });
}

// Validação de campos individuais
function validateField(field) {
    const errorElement = document.getElementById(field.id + '-error');
    let isValid = true;
    let errorMessage = '';
    
    // Validação específica para cada tipo de campo
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Por favor, insira um e-mail válido.';
        }
    }
    
    if (field.type === 'text' && field.id === 'nome') {
        // Nome é opcional, mas se preenchido deve ter pelo menos 3 caracteres
        if (field.value && field.value.length < 3) {
            isValid = false;
            errorMessage = 'O nome deve ter pelo menos 3 caracteres.';
        }
    }
    
    if (field.id === 'testemunho') {
        if (field.value.length < 50) {
            isValid = false;
            errorMessage = 'O testemunho deve ter pelo menos 50 caracteres.';
        }
    }
    
    if (field.type === 'checkbox' && field.required && !field.checked) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }
    
    // Exibir ou limpar erro
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            field.style.borderColor = '#ff6b6b';
        } else {
            errorElement.textContent = '';
            field.style.borderColor = 'var(--border-color)';
        }
    }
    
    return isValid;
}

// Limpar erro de campo
function clearFieldError(field) {
    const errorElement = document.getElementById(field.id + '-error');
    if (errorElement) {
        errorElement.textContent = '';
        field.style.borderColor = 'var(--border-color)';
    }
}

// Validação completa do formulário
function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Preloader simples (opcional)
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Melhorar acessibilidade
document.addEventListener('keydown', function(e) {
    // Navegação por teclado
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Adicionar estilos para navegação por teclado
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-navigation .btn:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}
`;
document.head.appendChild(keyboardStyle);

// Função de teste para o FAQ
function testFAQ() {
    console.log('=== TESTE DO FAQ ===');
    const faqItems = document.querySelectorAll('.faq-item');
    console.log('Total de itens FAQ encontrados:', faqItems.length);
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        console.log(`Item ${index + 1}:`, {
            question: question ? '✅' : '❌',
            answer: answer ? '✅' : '❌',
            classes: item.className
        });
    });
}

// Executar teste quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada, executando teste do FAQ...');
    setTimeout(testFAQ, 1000); // Aguardar 1 segundo para garantir que tudo carregou
    

});


