
/* ==========================================
   MELT COOKIE - MELT.CHATBOT
   Assistente virtual da empresa
   Modelo: gpt-4o-mini
========================================== */


// CAPTURAR ELEMENTOS HTML

const apiKey = document.getElementById("apiKey");

const mensagem = document.getElementById("mensagem");

const btnEnviar = document.getElementById("btnEnviar");

const resposta = document.getElementById("resposta");

const carregamento = document.getElementById("carregamento");


// CONFIGURAÇÕES DA API

const API_URL = "https://api.openai.com/v1/responses";

const MODELO = "gpt-4o-mini";

const TEMPERATURA = 0.3;

const MAX_TOKENS = 30;


// INSTRUÇÕES PERSONALIZADAS DO CHATBOT

const INSTRUCOES = `

Você é o chatbot da empresa MELT COOKIE.
Seu nome é melt.chatbot.

Sua função é auxiliar clientes com dúvidas
referentes a pedidos de cookies e sugestões de sabores.

INFORMAÇÕES IMPORTANTES DA EMPRESA:

1. A MELT COOKIE realiza entregas somente em
Jundiaí - SP.

2. Não realizamos entregas em outras cidades.

3. Quando perguntarem sobre contato, telefone
ou número da empresa, informe:

"Entre em contato pelo telefone da MELT COOKIE:
(11) 99999-9999".

4. Não invente outras formas de contato.

REGRAS DE ATENDIMENTO:

1. Responda sempre em português brasileiro.

2. Seja educado, simpático e atencioso.

3. Responda sempre em no máximo 20 tokens.

4. Se a resposta precisar ser maior,
faça um resumo objetivo.

5. Aceite cumprimentos e responda cordialmente.

6. Ajude com pedidos de cookies e sugestões de sabores.

7. Não invente preços, ingredientes ou disponibilidade.

8. Não confirme pedidos sem acesso ao sistema da loja.

9. Quando perguntarem sobre entregas,
informe que atendemos somente Jundiaí - SP.

10. Quando perguntarem se entregamos em outra cidade,
explique educadamente que não realizamos entregas fora
de Jundiaí - SP.

RESTRIÇÃO DE ASSUNTO:

Para perguntas que não sejam de contexto de saudação,
pedidos de cookies ou sugestões de sabores, responda:

"Estou configurado com a função de auxiliar no pedidos
de cookies, esta pergunta foge do meu contexto."

`;


// FUNÇÃO PARA ENVIAR MENSAGEM

async function enviarMensagem() {

    // CAPTURAR VALORES DOS CAMPOS

    const chave = apiKey.value.trim();

    const texto = mensagem.value.trim();


    // VALIDAR CHAVE DA API

    if (!chave) {

        resposta.textContent =
            "Por favor, informe sua chave da API OpenAI.";

        apiKey.focus();

        return;

    }


    // VALIDAR MENSAGEM

    if (!texto) {

        resposta.textContent =
            "Digite uma mensagem antes de enviar.";

        mensagem.focus();

        return;

    }


    // INICIAR CARREGAMENTO

    btnEnviar.disabled = true;

    btnEnviar.innerHTML =
        "<span>ENVIANDO...</span>";

    carregamento.hidden = false;

    resposta.textContent =
        "Aguarde! Estou preparando sua resposta... 🍪";


    try {

        // CONECTAR COM A API OPENAI

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": `Bearer ${chave}`

            },

            body: JSON.stringify({

                model: MODELO,

                instructions: INSTRUCOES,

                input: texto,

                temperature: TEMPERATURA,

                max_output_tokens: MAX_TOKENS,

                store: false

            })

        });


        // CONVERTER RESPOSTA PARA JSON

        const data = await response.json();


        // VERIFICAR ERROS DA API

        if (!response.ok) {

            throw new Error(
                data.error?.message ||
                "Erro ao acessar a API da OpenAI."
            );

        }


        // EXTRAIR RESPOSTA DO CHATGPT

        let textoResposta = "";


        if (typeof data.output_text === "string") {

            textoResposta = data.output_text;

        } else if (Array.isArray(data.output)) {

            data.output.forEach(item => {

                if (
                    item.type === "message" &&
                    Array.isArray(item.content)
                ) {

                    item.content.forEach(conteudo => {

                        if (
                            conteudo.type === "output_text"
                        ) {

                            textoResposta += conteudo.text;

                        }

                    });

                }

            });

        }


        // MOSTRAR RESPOSTA NA TELA

        resposta.textContent = textoResposta ||
            "Não foi possível obter uma resposta.";


        // LIMPAR CAMPO DE MENSAGEM

        mensagem.value = "";


    } catch (erro) {

        // TRATAMENTO DE ERROS

        console.error("Erro no melt.chatbot:", erro);

        resposta.textContent =
            "Desculpe! Ocorreu um erro na conexão.\n\n" +
            erro.message;


    } finally {

        // FINALIZAR CARREGAMENTO

        carregamento.hidden = true;

        btnEnviar.disabled = false;

        btnEnviar.innerHTML =
            "<span>ENVIAR MENSAGEM</span>" +
            '<span class="seta">➜</span>';

    }

}


// EVENTO DO BOTÃO ENVIAR

btnEnviar.addEventListener("click", enviarMensagem);


// ENVIAR MENSAGEM COM ENTER

mensagem.addEventListener("keydown", function(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        enviarMensagem();

    }

});

