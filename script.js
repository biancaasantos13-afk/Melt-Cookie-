
/* =================================
   MELT COOKIE - FUNCIONALIDADES
================================= */

let carrinho = [];

// NÚMERO DE WHATSAPP DE DEMONSTRAÇÃO
const telefone = "5511999999999";


// ADICIONAR PRODUTO
function adicionar(nome, preco) {

    const produto = carrinho.find(
        item => item.nome === nome
    );

    if (produto) {
        produto.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();

    alert(nome + " foi adicionado ao carrinho! 🍪");
}


// ATUALIZAR CARRINHO
function atualizarCarrinho() {

    const itens = document.getElementById("itens-carrinho");
    const quantidade = document.getElementById("quantidade");
    const totalElemento = document.getElementById("total");

    itens.innerHTML = "";

    let total = 0;
    let quantidadeTotal = 0;

    carrinho.forEach((produto, index) => {

        const subtotal = produto.preco * produto.quantidade;

        total += subtotal;
        quantidadeTotal += produto.quantidade;

        const item = document.createElement("div");

        item.className = "cart-item";

        const descricao = document.createElement("div");
        const nome = document.createElement("strong");
        const detalhe = document.createElement("p");

        nome.textContent = produto.nome;
        detalhe.textContent =
            `${produto.quantidade} x ${formatarMoeda(produto.preco)}`;

        descricao.append(nome, detalhe);

        const acoes = document.createElement("div");
        const preco = document.createElement("strong");
        const remover = document.createElement("button");

        preco.textContent = formatarMoeda(subtotal);
        remover.textContent = "Remover";

        remover.addEventListener("click", () => {
            removerProduto(index);
        });

        acoes.append(preco, remover);
        item.append(descricao, acoes);

        itens.appendChild(item);
    });

    quantidade.textContent = quantidadeTotal;
    totalElemento.textContent = formatarMoeda(total);
}


// FORMATAR PREÇOS
function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// REMOVER PRODUTO
function removerProduto(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();

}


// ABRIR CARRINHO
function abrirCarrinho() {

    document.getElementById("carrinho").style.display = "flex";

}


// FECHAR CARRINHO
function fecharCarrinho() {

    document.getElementById("carrinho").style.display = "none";

}


// FECHAR CARRINHO AO CLICAR FORA
document.getElementById("carrinho").addEventListener(
    "click",
    function(event) {

        if (event.target === this) {
            fecharCarrinho();
        }

    }
);


// MENU PARA CELULAR
function alternarMenu() {

    const menu = document.getElementById("navigation");

    menu.classList.toggle("active");

}


// FECHAR MENU AO CLICAR EM UM LINK
document.querySelectorAll(".navigation a").forEach(link => {

    link.addEventListener("click", () => {

        document.getElementById("navigation").classList.remove("active");

    });

});


// FINALIZAR PEDIDO
function finalizarPedido() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio! Escolha seus cookies. 🍪");

        return;

    }

    let mensagem =
        "Olá! Vim pelo site da MELT COOKIE! 🍪\n\n";

    let total = 0;

    carrinho.forEach(produto => {

        const subtotal = produto.preco * produto.quantidade;

        total += subtotal;

        mensagem +=
            `${produto.quantidade}x ${produto.nome} - ${formatarMoeda(subtotal)}\n`;

    });

    mensagem += "\nTOTAL: " + formatarMoeda(total);

    mensagem += "\n\nGostaria de confirmar meu pedido! ❤️";

    const link =
        "https://wa.me/" +
        telefone +
        "?text=" +
        encodeURIComponent(mensagem);

    window.open(link, "_blank");

}


// INICIALIZAÇÃO
atualizarCarrinho();
