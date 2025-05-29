// Variáveis globais para controle da calculadora
let numeroAtual = '0';
let numeroAnterior = '';
let operadorAtual = '';
let aguardandoOperando = false;
let historico = [];

// Elementos do DOM
const display = document.getElementById('display');
const historicoDisplay = document.getElementById('historico-display');
const listaHistorico = document.getElementById('lista-historico');

/**
 * Atualiza o display principal e o histórico
 */
function atualizarDisplay() {
    display.textContent = numeroAtual;
    
    if (operadorAtual && numeroAnterior) {
        historicoDisplay.textContent = `${numeroAnterior} ${operadorAtual}`;
    } else {
        historicoDisplay.textContent = '';
    }
}

/**
 * Adiciona um número ao display
 * @param {string} numero - Número a ser adicionado
 */
function adicionarNumero(numero) {
    if (aguardandoOperando) {
        numeroAtual = numero;
        aguardandoOperando = false;
    } else {
        numeroAtual = numeroAtual === '0' ? numero : numeroAtual + numero;
    }
    atualizarDisplay();
}

/**
 * Adiciona vírgula decimal ao número atual
 */
function adicionarVirgula() {
    if (aguardandoOperando) {
        numeroAtual = '0,';
        aguardandoOperando = false;
    } else if (numeroAtual.indexOf(',') === -1) {
        numeroAtual += ',';
    }
    atualizarDisplay();
}

/**
 * Executa operações matemáticas
 * @param {string} novoOperador - Operador a ser executado
 */
function operacao(novoOperador) {
    const numero = parseFloat(numeroAtual.replace(',', '.'));

    // Operações especiais que não precisam de dois operandos
    switch (novoOperador) {
        case '±':
            numeroAtual = String(-numero).replace('.', ',');
            atualizarDisplay();
            return;
        
        case '√':
            if (numero < 0) {
                mostrarErro('Erro: Raiz de número negativo');
                return;
            }
            const raiz = Math.sqrt(numero);
            numeroAtual = formatarNumero(raiz);
            adicionarAoHistorico(`√${numero} = ${numeroAtual}`);
            atualizarDisplay();
            return;
        
        case 'x²':
            const quadrado = Math.pow(numero, 2);
            numeroAtual = formatarNumero(quadrado);
            adicionarAoHistorico(`${numero}² = ${numeroAtual}`);
            atualizarDisplay();
            return;
        
        case '%':
            const porcentagem = numero / 100;
            numeroAtual = formatarNumero(porcentagem);
            adicionarAoHistorico(`${numero}% = ${numeroAtual}`);
            atualizarDisplay();
            return;
        
        case '1/x':
            if (numero === 0) {
                mostrarErro('Erro: Divisão por zero');
                return;
            }
            const inverso = 1 / numero;
            numeroAtual = formatarNumero(inverso);
            adicionarAoHistorico(`1/${numero} = ${numeroAtual}`);
            atualizarDisplay();
            return;
    }

    // Operações básicas que precisam de dois operandos
    if (numeroAnterior !== '' && !aguardandoOperando) {
        calcular();
    }

    operadorAtual = novoOperador;
    numeroAnterior = numeroAtual;
    aguardandoOperando = true;
    atualizarDisplay();
}

/**
 * Calcula o resultado da operação atual
 */
function calcular() {
    if (numeroAnterior === '' || operadorAtual === '') return;

    const anterior = parseFloat(numeroAnterior.replace(',', '.'));
    const atual = parseFloat(numeroAtual.replace(',', '.'));
    let resultado;

    switch (operadorAtual) {
        case '+':
            resultado = anterior + atual;
            break;
        case '-':
            resultado = anterior - atual;
            break;
        case '×':
            resultado = anterior * atual;
            break;
        case '÷':
            if (atual === 0) {
                mostrarErro('Erro: Divisão por zero');
                return;
            }
            resultado = anterior / atual;
            break;
        default:
            return;
    }

    // Adicionar ao histórico
    const resultadoFormatado = formatarNumero(resultado);
    const expressao = `${numeroAnterior} ${operadorAtual} ${numeroAtual} = ${resultadoFormatado}`;
    adicionarAoHistorico(expressao);

    numeroAtual = resultadoFormatado;
    numeroAnterior = '';
    operadorAtual = '';
    aguardandoOperando = true;
    atualizarDisplay();
}

/**
 * Formata um número para exibição (substitui ponto por vírgula)
 * @param {number} numero - Número a ser formatado
 * @returns {string} - Número formatado
 */
function formatarNumero(numero) {
    // Limita a 10 casas decimais para evitar números muito longos
    let numeroFormatado = Number(numero.toPrecision(12));
    return String(numeroFormatado).replace('.', ',');
}

/**
 * Limpa apenas a entrada atual
 */
function limparEntrada() {
    numeroAtual = '0';
    atualizarDisplay();
}

/**
 * Limpa todos os dados da calculadora
 */
function limparTudo() {
    numeroAtual = '0';
    numeroAnterior = '';
    operadorAtual = '';
    aguardandoOperando = false;
    atualizarDisplay();
}

/**
 * Exibe uma mensagem de erro temporariamente
 * @param {string} mensagem - Mensagem de erro a ser exibida
 */
function mostrarErro(mensagem) {
    display.innerHTML = `<span class="erro">${mensagem}</span>`;
    setTimeout(() => {
        limparTudo();
    }, 2000);
}

/**
 * Adiciona uma expressão ao histórico
 * @param {string} expressao - Expressão a ser adicionada
 */
function adicionarAoHistorico(expressao) {
    historico.unshift(expressao);
    // Mantém apenas os últimos 10 cálculos
    if (historico.length > 10) {
        historico.pop();
    }
    atualizarHistorico();
}

/**
 * Atualiza a exibição do histórico
 */
function atualizarHistorico() {
    listaHistorico.innerHTML = '';
    historico.forEach(item => {
        const div = document.createElement('div');
        div.className = 'historico-item';
        div.textContent = item;
        listaHistorico.appendChild(div);
    });
}

/**
 * Manipula eventos do teclado
 */
function configurarEventosTeclado() {
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        // Números de 0 a 9
        if (key >= '0' && key <= '9') {
            adicionarNumero(key);
        } 
        // Vírgula decimal
        else if (key === '.' || key === ',') {
            adicionarVirgula();
        } 
        // Operadores
        else if (key === '+') {
            operacao('+');
        } 
        else if (key === '-') {
            operacao('-');
        } 
        else if (key === '*') {
            operacao('×');
        } 
        else if (key === '/') {
            event.preventDefault(); // Previne a busca rápida do navegador
            operacao('÷');
        } 
        // Calcular resultado
        else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calcular();
        } 
        // Limpar tudo
        else if (key === 'Escape') {
            limparTudo();
        } 
        // Limpar entrada atual
        else if (key === 'Backspace') {
            limparEntrada();
        }
    });
}

/**
 * Inicializa a calculadora
 */
function inicializar() {
    atualizarDisplay();
    configurarEventosTeclado();
}

// Executa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializar);
