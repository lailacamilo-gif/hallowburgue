const precos = { abobora: 15.0, carang: 20.0, monster: 25.0, coca: 5.0 };
const nomes = { abobora: "Abóbora Burguer", carang: "Carang Burguer", monster: "Monster Burguer", coca: "Coca Cola" };
let carrinho = { abobora: 0, carang: 0, monster: 0, coca: 0 };
let desconto = 0;
let cupomNome = "";

const WHATSAPP_LOJA = "5584999123456"; 

function goToMenu() {
    document.getElementById('screen-home').style.display = 'none';
    document.getElementById('screen-menu').style.display = 'block';
}

function adicionar(item) {
    carrinho[item]++;
    atualizarInterface();
}

function remover(item) {
    if (carrinho[item] > 0) {
        carrinho[item]--;
        atualizarInterface();
    }
}

// Função de cupom aprimorada
function aplicarCupom() {
    const campo = document.getElementById('coupon-input');
    const valorDigitado = campo.value.toUpperCase().trim();

    if (valorDigitado === "HALLOW10") {
        desconto = 0.10; // 10%
        cupomNome = "HALLOW10";
        campo.style.backgroundColor = "#2ecc71"; // Verde se funcionar
    } else {
        desconto = 0;
        cupomNome = "";
        campo.style.backgroundColor = "#ff8c00"; // Volta ao laranja original
    }
    atualizarInterface();
}

function atualizarInterface() {
    // Atualiza números individuais
    for (let id in carrinho) {
        document.getElementById(`qty-${id}`).innerText = carrinho[id];
    }

    let subtotal = 0;
    const lista = document.getElementById('order-items-list');
    lista.innerHTML = "";
    
    // Calcula subtotal e gera lista visual
    for (let id in carrinho) {
        if (carrinho[id] > 0) {
            let totalItem = carrinho[id] * precos[id];
            subtotal += totalItem;
            lista.innerHTML += `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span>${carrinho[id]}x ${nomes[id]}</span>
                    <span>R$ ${totalItem.toFixed(2).replace('.', ',')}</span>
                </div>`;
        }
    }
    
    if (subtotal === 0) {
        lista.innerHTML = "Nenhum item selecionado";
    }

    // Aplica desconto no total
    let valorComDesconto = subtotal * (1 - desconto);
    document.getElementById('valor-total').innerText = valorComDesconto.toFixed(2).replace('.', ',');
}

function finishOrder() {
    // Garantir que o cupom seja validado uma última vez antes de enviar
    aplicarCupom();

    const total = document.getElementById('valor-total').innerText;
    const end = document.getElementById('endereco').value;
    const pag = document.getElementById('pagamento').value;
    const obs = document.getElementById('observacao').value;

    if (total === "0,00" || !end || !pag) {
        return alert("⚠️ Ops! Verifique se escolheu os itens, o endereço e a forma de pagamento.");
    }

    // Montar Mensagem do WhatsApp
    let texto = `🎃 *PEDIDO HALLOW BURGUER* 🎃\n\n`;
    
    for (let id in carrinho) {
        if (carrinho[id] > 0) {
            texto += `• ${carrinho[id]}x ${nomes[id]}\n`;
        }
    }

    if (cupomNome) {
        texto += `\n🎫 *Cupom Aplicado:* ${cupomNome} (10% OFF)`;
    }

    texto += `\n\n💰 *Total:* R$ ${total}`;
    texto += `\n💳 *Pagamento:* ${pag}`;
    texto += `\n📍 *Endereço:* ${end}`;
    
    if (obs) {
        texto += `\n📝 *Observação:* ${obs}`;
    }

    // Transição de telas
    document.getElementById('screen-menu').style.display = 'none';
    document.getElementById('screen-thanks').style.display = 'flex';

    // Disparar WhatsApp na mesma aba
    setTimeout(() => {
        window.location.href = `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(texto)}`;
    }, 800);

    // Timer para resetar o site
    let timer = 5;
    const display = document.getElementById('timer');
    const contagem = setInterval(() => {
        timer--;
        display.innerText = timer;
        if (timer <= 0) {
            clearInterval(contagem);
            location.reload(); 
        }
    }, 1000);
}