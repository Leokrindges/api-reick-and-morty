let pagina = 1
let quantidadeDePaginas
let contaQuantidadeDePaginas
let count
let contaPersonagens = 0
let statusPersonagen = ''
let morto
let desconhecido
let botaoPagina;
let result = []

const cartoesPersonagensEL = document.getElementById("cartoes_personagens")
const containerPersonagens = document.getElementById("personagens")
const containerbotoes = document.getElementById("botoes")

const instance = axios.create({
    baseURL: "https://rickandmortyapi.com/api",
})

function aumentarPagina() {
    if (pagina !== quantidadeDePaginas) {
        pagina++

        containerbotoes.innerHTML = ''
        paginacao(pagina)

        carregarPersonagens()
    }
}

function diminuirPagina() {
    if (pagina > 1) {
        pagina--
        containerbotoes.innerHTML = ''

        paginacao(pagina)

        carregarPersonagens()
    }
}

function selecionarPagina(novaPagina) {
    pagina = novaPagina
    paginacao(pagina)
}

function paginacao(novaPagina) {
    pagina = novaPagina

    if (pagina === quantidadeDePaginas - 1) {
        result = [1, quantidadeDePaginas - 3, quantidadeDePaginas - 2, pagina, quantidadeDePaginas]
    } else if (pagina > 2 && pagina < quantidadeDePaginas) {
        result = [1, pagina - 1, pagina, pagina + 1, quantidadeDePaginas]
    }
    else if (pagina === quantidadeDePaginas) {
        result = [1, pagina - 3, pagina - 2, pagina - 1, quantidadeDePaginas]
    } else {
        result = [1, 2, 3, 4, quantidadeDePaginas]
    }

    containerbotoes.innerHTML = ''

    for (let i = 0; i < result.length; i++) {
        botaoPagina = document.createElement('button')
        botaoPagina.innerHTML = result[i]
        botaoPagina.addEventListener('click', () => { paginacao(result[i]) })
        containerbotoes.appendChild(botaoPagina)
    }

    carregarPersonagens()
}


async function carregamentoInicialPersonagens() {
    await carregarPersonagens()
    containerbotoes.innerHTML = ''

    for (let i = 0; i < quantidadeDePaginas; i++) {
        if (i < 4) {
            botaoPagina = document.createElement('button')
            botaoPagina.innerHTML = i + 1
            botaoPagina.addEventListener('click', () => { paginacao(i + 1) })
            containerbotoes.appendChild(botaoPagina)
        }

        if (i === 4) {
            botaoPagina = document.createElement('button')
            botaoPagina.innerHTML = quantidadeDePaginas
            botaoPagina.addEventListener('click', () => { paginacao(quantidadeDePaginas) })
            containerbotoes.appendChild(botaoPagina)
        }
    }
}

async function carregarPersonagens() {
    try {
        const resposta = await instance.get(`/character?page=${pagina}`)
        const personagens = resposta.data.results
        quantidadeDePaginas = resposta.data.info.pages
        count = resposta.data.info.count
        cartoesPersonagensEL.innerHTML = ''

        const hr = '<hr class="hr">'

        personagens.forEach((personagen) => {
            //separa os personagens de dois em dois
            if (contaPersonagens == 2) {
                cartoesPersonagensEL.innerHTML += hr
                contaPersonagens = 0
            }

            //verifica se o personagem está vivo, morto ou desconhecido
            if (personagen.status === 'Alive') {
                statusPersonagen = '<span class="color_status_vivo"></span>'
            }

            if (personagen.status === "unknown") {
                statusPersonagen = '<span class="color_status_desconhecido"></span>'
            }

            if (personagen.status === "Dead") {
                statusPersonagen = '<span class="color_status_morto"></span>'
            }

            const cartao = `
                <div class="card_personagem">
                     <h2 class="titulo_card">${personagen.name}</h2>
                    <img class="imagem_personagem" src="${personagen.image}" alt="imagen_personagem" srcset="">
                     <p class="status_persongem">${statusPersonagen}${personagen.status} - ${personagen.species}</p>
                 </div>
             `
            contaPersonagens++
            cartoesPersonagensEL.innerHTML += cartao
        });

    } catch (error) {
        console.log(error);
    }
}

carregamentoInicialPersonagens()