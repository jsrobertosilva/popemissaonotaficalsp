// Funcionalidade da barra de progresso
document.addEventListener('DOMContentLoaded', function() {
    const progressSteps = document.querySelectorAll('.progress-step');
    const stepSections = document.querySelectorAll('.step-section');
    
    // Função para ativar um passo
    function activateStep(stepNumber) {
        // Remove classe active de todos os passos
        progressSteps.forEach(step => step.classList.remove('active'));
        
        // Adiciona classe active ao passo atual e anteriores
        for (let i = 0; i < stepNumber; i++) {
            if (progressSteps[i]) {
                progressSteps[i].classList.add('active');
            }
        }
    }
    
    // Observador de interseção para ativar passos automaticamente
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepId = entry.target.id;
                const stepNumber = parseInt(stepId.split('-')[1]);
                activateStep(stepNumber);
            }
        });
    }, observerOptions);
    
    // Observa todas as seções
    stepSections.forEach(section => {
        observer.observe(section);
    });
    
    // Click nos passos da barra de progresso
    progressSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            const targetSection = document.getElementById(`step-${index + 1}`);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Animação de entrada das seções
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    stepSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateOnScroll.observe(section);
    });
    
    // Calculadora interativa
    createCalculator();
    
    // Tooltip para elementos importantes
    addTooltips();
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Função para criar calculadora interativa
function createCalculator() {
    const calculationBox = document.querySelector('.calculation-box');
    if (!calculationBox) return;
    
    const calculatorHTML = `
        <div class="interactive-calculator" style="margin-top: 20px;">
            <h4 style="color: #2e7d32; margin-bottom: 15px;">
                <i class="fas fa-calculator"></i> Calculadora Interativa
            </h4>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #4caf50;">
                <div style="margin-bottom: 15px;">
                    <label for="serviceValue" style="display: block; margin-bottom: 5px; font-weight: 600;">
                        Valor do Serviço (R$):
                    </label>
                    <input type="number" id="serviceValue" placeholder="0,00" 
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 1.1rem;"
                           step="0.01" min="0">
                </div>
                <div id="calculationResult" style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 5px; display: none;">
                    <div style="font-weight: 600; color: #2e7d32;">Resultado do Cálculo:</div>
                    <div id="taxValue" style="font-size: 1.2rem; color: #4caf50; margin-top: 5px;"></div>
                </div>
            </div>
        </div>
    `;
    
    calculationBox.insertAdjacentHTML('beforeend', calculatorHTML);
    
    const serviceValueInput = document.getElementById('serviceValue');
    const calculationResult = document.getElementById('calculationResult');
    const taxValue = document.getElementById('taxValue');
    
    serviceValueInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (value && value > 0) {
            const tax = value * 0.1559;
            taxValue.textContent = `Valor aproximado dos tributos: R$ ${tax.toFixed(2).replace('.', ',')}`;
            calculationResult.style.display = 'block';
        } else {
            calculationResult.style.display = 'none';
        }
    });
}

// Função para adicionar tooltips
function addTooltips() {
    const tooltipElements = [
        {
            selector: '.percentage',
            text: 'Este percentual é específico para o código de serviço 4472'
        },
        {
            selector: '.external-link',
            text: 'Clique para abrir o site da Prefeitura de São Paulo'
        }
    ];
    
    tooltipElements.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach(element => {
            element.setAttribute('title', item.text);
            element.style.cursor = 'help';
        });
    });
}

// Função para destacar texto importante
function highlightImportantText() {
    const importantPhrases = [
        'CNPJ ou CPF',
        'certificado digital',
        'código 4472',
        '15,59%',
        'ISS Retido pelo Tomador'
    ];
    
    const textNodes = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const nodes = [];
    let node;
    while (node = textNodes.nextNode()) {
        nodes.push(node);
    }
    
    nodes.forEach(textNode => {
        let content = textNode.textContent;
        let modified = false;
        
        importantPhrases.forEach(phrase => {
            const regex = new RegExp(`(${phrase})`, 'gi');
            if (regex.test(content)) {
                content = content.replace(regex, '<mark style="background: #fff3cd; padding: 2px 4px; border-radius: 3px;">$1</mark>');
                modified = true;
            }
        });
        
        if (modified) {
            const wrapper = document.createElement('span');
            wrapper.innerHTML = content;
            textNode.parentNode.replaceChild(wrapper, textNode);
        }
    });
}

// Função para adicionar botão de voltar ao topo
function addBackToTopButton() {
    const backToTopHTML = `
        <button id="backToTop" style="
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #2d5a5a;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            box-shadow: 0 4px 12px rgba(45, 90, 90, 0.3);
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            z-index: 1000;
        ">
            <i class="fas fa-arrow-up"></i>
        </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', backToTopHTML);
    
    const backToTopButton = document.getElementById('backToTop');
    
    // Mostrar/esconder botão baseado no scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });
    
    // Funcionalidade do botão
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Efeito hover
    backToTopButton.addEventListener('mouseenter', () => {
        backToTopButton.style.transform = 'scale(1.1)';
        backToTopButton.style.background = '#1a3d3d';
    });
    
    backToTopButton.addEventListener('mouseleave', () => {
        backToTopButton.style.transform = 'scale(1)';
        backToTopButton.style.background = '#2d5a5a';
    });
}

// Inicializar funcionalidades adicionais
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        highlightImportantText();
        addBackToTopButton();
    }, 1000);
});

// Função para imprimir o documento
function printDocument() {
    window.print();
}

// Adicionar botão de impressão
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const printButtonHTML = `
        <button onclick="printDocument()" style="
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
           onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            <i class="fas fa-print"></i> Imprimir
        </button>
    `;
    
    header.style.position = 'relative';
    header.insertAdjacentHTML('beforeend', printButtonHTML);
});

// Media queries para responsividade adicional
function handleResponsiveFeatures() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Ajustar calculadora para mobile
        const calculator = document.querySelector('.interactive-calculator');
        if (calculator) {
            calculator.style.fontSize = '0.9rem';
        }
        
        // Ajustar tooltips para mobile
        const tooltipElements = document.querySelectorAll('[title]');
        tooltipElements.forEach(element => {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                alert(this.getAttribute('title'));
            });
        });
    }
}

window.addEventListener('resize', handleResponsiveFeatures);
document.addEventListener('DOMContentLoaded', handleResponsiveFeatures);

