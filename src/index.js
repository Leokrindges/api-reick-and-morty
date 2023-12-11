let pagina = 1
let quantidadeDePaginas
let contaPersonagens = 0
let statusPersonagen = ''
let morto
let desconhecido

const cartoesPersonagensEL = document.getElementById("cartoes_personagens")
const containerPersonagens = document.getElementById("personagens")
const containerbotoes = document.getElementById("botoes")

const instance = axios.create({
    baseURL: "https://rickandmortyapi.com/api",
})

carregarPersonagens()

function aumentarPagina() {
    if (pagina !== quantidadeDePaginas) {
        pagina++
        carregarPersonagens()
    }
}

function diminuirPagina() {
    if (pagina > 1) {
        pagina--
        carregarPersonagens()
    }
}

carregarPersonagens()
async function carregarPersonagens() {

    try {
        const resposta = await instance.get(`/character`)
        console.log(resposta);
        const personagens = resposta.data.results

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