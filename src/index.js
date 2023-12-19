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

const personagenEl = document.getElementById("personagen")
const localizacaoEl = document.getElementById("localizacao")
const episodioEl = document.getElementById("episodio")
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

function paginacao(novaPagina) {
    pagina = novaPagina
    console.log(pagina);

    //faz a paginação dos botões, para ficar mostrando a pagina anterior e posterior à página que esta selecionada
    if (pagina === quantidadeDePaginas - 1) {
        result = [1, quantidadeDePaginas - 3, quantidadeDePaginas - 2, pagina, quantidadeDePaginas]
    }
    else if (pagina > 2 && pagina < quantidadeDePaginas) {
        result = [1, pagina - 1, pagina, pagina + 1, quantidadeDePaginas]
    }
    else if (pagina === quantidadeDePaginas) {
        result = [1, pagina - 3, pagina - 2, pagina - 1, quantidadeDePaginas]
    }
    else {
        result = [1, 2, 3, 4, quantidadeDePaginas]
    }

    containerbotoes.innerHTML = ''

    // percore o array result e cria os novos botões usando os valores que estão setados dentro do array result
    for (let i = 0; i < result.length; i++) {

        botaoPagina = document.createElement('button')
        botaoPagina.setAttribute('style', 'background-color: #62EC52; border:1px solid #62EC52; margin-right: 5px; width: 35px; height: 30px; border-radius: 5px; font-size:20px; margin-top: 40px;')
        botaoPagina.innerHTML = result[i]
        botaoPagina.addEventListener('click', () => { paginacao(result[i]) })
        containerbotoes.appendChild(botaoPagina)

        //colocar cor no botão que esta selecionado
        if (result[i] === pagina) {
            botaoPagina.setAttribute('style', 'background-color: green; border:1px solid green; margin-right: 5px; width: 35px; height: 30px; border-radius: 5px; font-size:20px; margin-top: 40px;')
        }
    }
    carregarPersonagens()
}

async function carregamentoInicialPersonagens() {
    await carregarPersonagens()
    containerbotoes.innerHTML = ''

    for (let i = 0; i < quantidadeDePaginas; i++) {
        //cria os botoes do 1 ao 4
        if (i < 4) {
            botaoPagina = document.createElement('button')
            botaoPagina.setAttribute('style', 'background-color: #62EC52; border:1px solid #62EC52; margin-right: 5px; width: 35px; height: 30px; border-radius: 5px; font-size:20px; margin-top: 25px;')
            botaoPagina.innerHTML = i + 1
            botaoPagina.addEventListener('click', () => { paginacao(i + 1) })
            containerbotoes.appendChild(botaoPagina)
        }

        //seta a ultima posição do array result com a ultima pagina da api
        if (i === 5) {
            botaoPagina = document.createElement('button')
            botaoPagina.setAttribute('style', 'background-color: #62EC52; border:1px solid #62EC52; margin-right: 5px; width: 35px; height: 30px; border-radius: 5px; font-size:20px; margin-top: 40px;')
            botaoPagina.innerHTML = quantidadeDePaginas
            botaoPagina.addEventListener('click', () => { paginacao(quantidadeDePaginas) })
            containerbotoes.appendChild(botaoPagina)
        }
    }
}

async function carregarPersonagens() {
    carregarLocalizações()
    carregarEpisodios()
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

        personagenEl.innerHTML = `PERSONAGENS: ${count}`

    } catch (error) {
        console.log(error);
    }
}

async function carregarEpisodios() {
    try {
        const resposta = await instance.get(`/episode`)
        episodioEl.innerHTML = `EPISÓDIOS: ${resposta.data.info.count}`
    } catch (error) {
        console.log(error);
    }
}

async function carregarLocalizações() {
    try {
        const resposta = await instance.get(`/location`)
        localizacaoEl.innerHTML = `LOCALIZAÇÕES: ${resposta.data.info.count}`
    } catch (error) {
        console.log(error);
    }
}

carregamentoInicialPersonagens()