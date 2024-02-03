let pagina = 1;
let quantidadeDePaginas;
const cartoesPersonagensEL = document.getElementById("cartoes_personagens");
const containerbotoes = document.getElementById("botoes_paginacao");

//axios para fazer a integração do back-end com o front-end
const instance = axios.create({
    baseURL: "https://rickandmortyapi.com/api",
});

//rota onde são carregadas as informações dos personagens
async function carregarPersonagens() {
    try {
        carregarLocalizacoes();
        carregarEpisodios();

        const resposta = await instance.get(`/character?page=${pagina}`);
        const personagens = resposta.data.results;

        quantidadeDePaginas = resposta.data.info.pages;

        limparElemento(cartoesPersonagensEL);
        criaElementosPaginacao(quantidadeDePaginas);

        personagens.forEach((personagem) => {
            const cardElemento = criarElementoCartao(personagem);
            cartoesPersonagensEL.appendChild(cardElemento);
        });

        mostraTotalPersonagens(resposta.data.info.count);

    } catch (error) {
        console.log(error);
    }
}

async function carregamentoInicialPersonagens() {
    await carregarPersonagens();
}

// paginação
function incrementarPagina() {
    if (pagina !== quantidadeDePaginas) {
        pagina++;
        containerbotoes.innerHTML = '';
        carregarPersonagens();
        rolarTelaTopo();
    }
}

// paginação
function carregarPaginaAnterior(quantidadeDePaginas) {
    pagina = pagina - 2;
    criaElementosPaginacao(quantidadeDePaginas);
    carregarPersonagens();
}

// paginação
function decrementarPagina(quantidadeDePaginas) {
    if (pagina > 1) {
        pagina--;
        containerbotoes.innerHTML = '';
        criaElementosPaginacao(quantidadeDePaginas);
        carregarPersonagens();
        rolarTelaTopo();
    }
}

// paginação
function botaoPosterior() {
    if (pagina === 1) {
        pagina = 3;
    } else if (pagina >= 3) {
        pagina++;
    } else {
        pagina = 3;
    }
    carregarPersonagens();
    rolarTelaTopo();
}

// Rola tela para o topo
function rolarTelaTopo() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

// cria os botoes da paginação
function criaElementosPaginacao(quantidadeDePaginas) {
    containerbotoes.innerHTML = '';

    const navElemento = document.createElement("nav");
    navElemento.setAttribute("aria-label", "Page navigation example");

    const ulElemento = document.createElement("ul");
    ulElemento.className = "botao_paginacao";

    const liElementoAnterior = document.createElement("li");
    liElementoAnterior.className = "page-item";
    const aElementoAnterior = document.createElement("button");
    aElementoAnterior.addEventListener('click', () => {
        decrementarPagina(quantidadeDePaginas);
    });
    aElementoAnterior.className = "page-link";
    aElementoAnterior.innerHTML = "Anterior";
    liElementoAnterior.appendChild(aElementoAnterior);
    ulElemento.appendChild(liElementoAnterior);

    const liElemento1 = document.createElement("li");
    liElemento1.className = "page-item active";
    const aElemento1 = document.createElement("button");
    aElemento1.addEventListener('click', () => {
        if (pagina === quantidadeDePaginas) {
            carregarPaginaAnterior(quantidadeDePaginas);
            return;
        }
        decrementarPagina(quantidadeDePaginas);
    });
    aElemento1.className = "page-link";
    aElemento1.innerHTML = (pagina > 1) ? pagina - 1 : 1;
    liElemento1.appendChild(aElemento1);
    ulElemento.appendChild(liElemento1);

    const liElemento2 = document.createElement("li");
    liElemento2.className = "page-item";
    const aElemento2 = document.createElement("button");
    aElemento2.addEventListener('click', () => {
        if (pagina === 1) {
            incrementarPagina();
        }
        if (pagina === quantidadeDePaginas) {
            decrementarPagina();
        }
    });
    aElemento2.className = "page-link";
    aElemento2.innerHTML = (pagina > 1) ? pagina : 2;
    liElemento2.appendChild(aElemento2);
    ulElemento.appendChild(liElemento2);

    const liElemento3 = document.createElement("li");
    liElemento3.className = "page-item";
    const aElemento3 = document.createElement("button");
    aElemento3.addEventListener('click', () => {
        botaoPosterior();
    });
    aElemento3.className = "page-link";
    aElemento3.innerHTML = (pagina > 1) ? pagina + 1 : 3;
    if (pagina === quantidadeDePaginas) {
        aElemento3.innerHTML = quantidadeDePaginas;
        aElemento2.innerHTML = quantidadeDePaginas - 1;
        aElemento1.innerHTML = quantidadeDePaginas - 2;
        liElemento3.className = 'active';
        liElemento2.classList.remove('active');
    }
    liElemento3.appendChild(aElemento3);
    ulElemento.appendChild(liElemento3);

    const liProximoElemento = document.createElement("li");
    liProximoElemento.className = "page-item";
    const aProximoElemento = document.createElement("button");
    aProximoElemento.addEventListener('click', () => {
        incrementarPagina();
    });
    if (pagina === quantidadeDePaginas) {
        liProximoElemento.className = "disabled";
    }
    aProximoElemento.className = "page-link";
    aProximoElemento.innerHTML = "Próxima";
    liProximoElemento.appendChild(aProximoElemento);
    ulElemento.appendChild(liProximoElemento);

    navElemento.appendChild(ulElemento);
    containerbotoes.appendChild(navElemento);
}

//cria os cards dos personagens
function criarElementoCartao(personagem) {
    const colElemento = document.createElement('div');
    colElemento.className = 'col-12 col-md-6 col-lg-4 my-3 d-flex justify-content-center';

    const cardElemento = document.createElement('div');
    cardElemento.className = `tamanho_card puff-in-center bg-secondary text-white card my-2 mx-2 ${obterSombraStatusCard(personagem.status)}`;
    const imagemElemento = document.createElement('img');
    imagemElemento.src = personagem.image;
    imagemElemento.className = 'card-img-top imagem_personagem';
    imagemElemento.alt = 'Imagem do personagem';

    const cardBodyElemento = document.createElement('div');
    cardBodyElemento.className = 'card-body background border border-top-0 border-success rounded-bottom';

    const tituloElemento = document.createElement('h6');
    tituloElemento.className = 'card-title fs-5';
    tituloElemento.textContent = personagem.name;

    const statusElemento = document.createElement('p');
    statusElemento.className = 'card-text fs-6';
    statusElemento.innerHTML = obterIconeStatus(personagem.status);

    const statusPersonagemElemento = document.createElement('span');
    statusPersonagemElemento.className = 'fs-6 ms-3';
    statusPersonagemElemento.innerHTML = `${personagem.status} - ${personagem.species}`;

    const botaoElemento = document.createElement('button');
    botaoElemento.type = 'button';
    botaoElemento.addEventListener('click', () => { modalPersonagem(personagem) });
    botaoElemento.id = 'botao-detalhes';
    botaoElemento.className = 'btn btn-padrao pulsate-fwd';
    botaoElemento.setAttribute('data-bs-toggle', 'modal');
    botaoElemento.setAttribute('data-bs-target', '#modal_detalhes');
    botaoElemento.style = '--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;';
    botaoElemento.textContent = 'Mais detalhes';

    cardBodyElemento.appendChild(tituloElemento);
    statusElemento.appendChild(statusPersonagemElemento);
    cardBodyElemento.appendChild(statusElemento);
    cardBodyElemento.appendChild(botaoElemento);

    cardElemento.appendChild(imagemElemento);
    cardElemento.appendChild(cardBodyElemento);

    colElemento.appendChild(cardElemento);
    return colElemento;
}

//limpa os cards
function limparElemento(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

//cria a modal com mais informações dos personagens
function modalPersonagem(personagem) {
    const mostraModalDetalhes = document.getElementById('detalhes');
    const statusPersonagen = obterIconeStatus(personagem.status);

    const modalContent = `
        <div class="row">
            <div class="col-6 col-md-5">
                <img src="${personagem.image}" class="img-fluid rounded-start" alt="Imagem do personagem">
            </div>
            <div class="col-6 col-md-7 bg-dark-subtle">
                <div class="card-body">
                    <h4 class="card-title ">${personagem.name}</h4>
                    <p class="card-text">${statusPersonagen}<span class="ms-3">${personagem.status}</span> - ${personagem.species}</p>
                    <h6 class="card-title mb-0 ms-3">Localização:</h6>
                    <p class="card-text ms-3">${personagem.location.name}</p>
                </div>
            </div>
        </div>
    `;
    mostraModalDetalhes.innerHTML = modalContent;
}

//mostra o total de pesonagens utilizado no footer
function mostraTotalPersonagens(quantidade) {
    const totalPersonagens = document.getElementById("personagen");
    totalPersonagens.className = 'text-light';
    totalPersonagens.innerHTML = ` ${quantidade} `;
}

//verifica o status do personagem e cria o circulo redondo com a cor do status(vivo, morto, desconhecido)
function obterIconeStatus(status) {
    switch (status) {
        case 'Alive':
            return '<span class="color_status_vivo"></span>';
        case 'unknown':
            return '<span class="color_status_desconhecido"></span>';
        case 'Dead':
            return '<span class="color_status_morto"></span>';
        default:
            return '';
    }
}

//coloca a sombra atrás dos cards conforme o status do pesonagem (vivo, morto, desconhecido)
function obterSombraStatusCard(status) {
    switch (status) {
        case 'Alive':
            return 'sombra_card_status_vivo';
        case 'unknown':
            return 'sombra_card_status_desconhecido';
        case 'Dead':
            return 'sombra_card_status_morto';
        default:
            return '';
    }
}

//rota para carregar informações sobre os episódios dos funcionários
async function carregarEpisodios() {
    const episodioEl = document.getElementById("episodio");
    episodioEl.classList = 'text-light';

    try {
        const resposta = await instance.get(`/episode`);
        episodioEl.innerHTML = ` ${resposta.data.info.count} `;
    } catch (error) {
        console.log(error);
    }
}

//rota para carregar a localização dos personagens
async function carregarLocalizacoes() {
    const localizacaoEl = document.getElementById("localizacao");
    localizacaoEl.classList = 'text-light';

    try {
        const resposta = await instance.get(`/location`);
        localizacaoEl.innerHTML = ` ${resposta.data.info.count} `;
    } catch (error) {
        console.log(error);
    }
}

carregamentoInicialPersonagens();
