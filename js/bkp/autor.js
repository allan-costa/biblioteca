// GUARDAR LINHA SELECIONADA DO AUTOR QUANDO A OPCAO E EDITAR
let posicaoAutorGravar;

// Tabela com resultados da pesquisa
let apresentarTabela = document.getElementById("resultado-pesquisa");

//Informar mensagem resultado nao encontrado
let infoPesquisa = document.getElementById("info-pesquisa");

//Informar mensagem cadastro autor
let infoCadastroAutor = document.getElementById("info-cadastro-autor");

//Informar mensagem editar autor
let infoEditarAutor = document.getElementById("info-editar-autor");

// TODO EXCLUIR NO BANCO DE DADOS
function excluirAutor(posicaoAutor) {
    var i = posicaoAutor.parentNode.parentNode.rowIndex;
    document.getElementById("tabela-autores").deleteRow(i);
}


// LIMPAR MENSAGENS 
function limparMensagens() {
    infoCadastroAutor.innerHTML = "";
    infoEditarAutor.innerHTML = "";
    infoPesquisa.innerHTML = "";
}

function gravarAutor(tipoOperacao) {

    // BUSCAR DADOS DO MODAL DE EDITAR AUTOR
    if (tipoOperacao === "EDITAR") {

        let autor = {
            id: document.getElementById("editar-id-autor").value,
            nome: document.getElementById("editar-nome-autor").value,
            pais: document.getElementById("editar-pais-autor").value,
            email: document.getElementById("editar-email-autor").value,
            cidade: document.getElementById("editar-cidade-autor").value,
            cutter: document.getElementById("editar-cutter-autor").value,
            dtnasc: document.getElementById("editar-data-nascimento-autor").value
        }

        var linhaAutor = document.getElementById("tabela-autores").rows[posicaoAutorGravar].cells;

        //ALTERAR CAMPOS QUE SÃO APRESENTADOS NA TABELA
        linhaAutor[1].innerHTML = autor.nome;
        linhaAutor[2].innerHTML = autor.cutter;

        infoEditarAutor.innerHTML = "Alteracão realizada com sucesso!";

        //TODO IMPLEMENTAR LOGICA NO BANCO PARA SALVAR AS ALTERAÇÕES FEITAS NO EDITAR


    } else {
        // TRECHO TEMPORARIO PARA PEGAR MAIOR ID 
        var maiorID = 0;
        for (var i = 0; i < autores.length; i++) {
            if (autores[i].id > maiorID) {
                maiorID = autores[i].id;
            }
        }

        // GRAVAR NOVO AUTOR
        let autor = {
            id: maiorID + 1,
            nome: document.getElementById("nome-autor").value,
            pais: document.getElementById("pais-autor").value,
            email: document.getElementById("email-autor").value,
            cidade: document.getElementById("cidade-autor").value,
            cutter: document.getElementById("cutter-autor").value,
            dtnasc: document.getElementById("data-nascimento-autor").value

        }
        autores.push(autor);
        infoCadastroAutor.innerHTML = "Autor cadastrado com sucesso!";
    }
}


// MONTAR MODAL COM DADOS DO AUTOR PARA EDICAO
function editarAutor(posicaoAutor) {

    // LIMPAR TODAS MENSAGENS
    limparMensagens();

    // OBTEM O ID DO AUTOR NA LINHA DA TABELA SELECIONADA
    let i = posicaoAutor.parentNode.parentNode.rowIndex;
    let id = (document.getElementById("tabela-autores").rows[i].cells[0].innerHTML);
    let autor = buscarAutorId(id);

    //VARIAVEL USADA NO METODO GRAVAR(EDITAR), NECESSARIO PARA SABER QUAL POSICAO SERA EDITADA
    posicaoAutorGravar = i;

    // PREENCHER MODAL COM DADOS DO AUTOR PARA EDICAO
    document.getElementById("editar-id-autor").value = autor.id;
    document.getElementById("editar-nome-autor").value = autor.nome;
    document.getElementById("editar-pais-autor").value = autor.pais;
    document.getElementById("editar-email-autor").value = autor.email;
    document.getElementById("editar-cidade-autor").value = autor.cidade;
    document.getElementById("editar-cutter-autor").value = autor.cutter;
    document.getElementById("editar-data-nascimento-autor").value = autor.dtnasc;

}

//Pesquisar com tecla enter
function teclaEnter(event) {
    let tecla = event.key;
    if (tecla == "Enter") {
        pesquisarAutores();
    }
}


function pesquisarAutores() {

    let termosPesquisa = document.getElementById("termosPesquisa").value;
    let autores = resultadoPesquisaAutores(termosPesquisa);

    tbody.innerHTML = "";
    body = document.getElementsByTagName("body")[0];
    table = body.getElementsByTagName("table")[0];
    tbody = table.getElementsByTagName("tbody")[0];

    // MONTAR TABELA COM AUTORES QUE CORRESPONDEM A BUSCA
    if (autores.length != 0) {
        infoPesquisa.innerHTML = "";
        apresentarTabela.style.display = "block";

        for (let i = 0, autor; autor = autores[i]; i++) {
            tbody.innerHTML += `<tr><th> ${autor.id} </th> <td> ${autor.nome} </td> <td> ${autor.cutter} </td>
            <td><button onclick="editarAutor(this)" data-toggle="modal" data-target="#modal-editar-autor" class="btn btn-success"><i class="fa fa-edit"></i></button>
            <button class="btn btn-danger" onclick="excluirAutor(this)"><i class="fa fa-trash"></i></button></td> </tr>`;
        }
    } else {
        infoPesquisa.innerHTML = "Nenhum resultado encontrado!";
    }
}


// CARREGAR AUTORES QUE CORRESPODEM A PESQUISA 
function resultadoPesquisaAutores(termosPesquisa) {
    let autores = consultaAutorBD();
    let autoresCorrespondentes = [];

    if (termosPesquisa === '%%') {
        return autores;
    } else {

        for (let i = 0, autor; autor = autores[i]; i++) {
            if (autor.nome.toUpperCase().indexOf(termosPesquisa.toUpperCase()) != -1) {
                autoresCorrespondentes.push(autor);
            }
        }
        return autoresCorrespondentes;
    }
}

//BUSCAR AUTOR
function buscarAutorId(autorid) {
    let autores = consultaAutorBD();
    for (let i = 0, autor; autor = autores[i]; i++) {
        if (autor.id == autorid) {
            return autor;
        }
    }
}


//CONEXAO COM O BANCO DE DADOS
function consultaAutorBD() {
    return autores;
}




var autores = [
    { id: 1, nome: "Allan", dtnasc: "1980-01-01", telefone: "6299999999", email: "exemplo@gmail.com", cutter: "A948", pais: "Brasil", cidade: "Goiania" },
    { id: 2, nome: "Tomas", dtnasc: "1980-01-01", telefone: "6299999999", email: "exemplo@gmail.com", cutter: "N789", pais: "Brasil", cidade: "Goiania" },
    { id: 3, nome: "Tolkien", dtnasc: "1980-01-01", telefone: "6299999999", email: "exemplo@gmail.com", cutter: "B848", pais: "Brasil", cidade: "Goiania" },
    { id: 4, nome: "Maria", dtnasc: "1980-01-01", telefone: "6299999999", email: "exemplo@gmail.com", cutter: "M538", pais: "Brasil", cidade: "Goiania" },
    { id: 5, nome: "Mariana", dtnasc: "1980-01-01", telefone: "6299999999", email: "exemplo@gmail.com", cutter: "M509", pais: "Brasil", cidade: "Goiania" },
    { id: 6, nome: "Martin", dtnasc: "1980-01-01", telefone: "6299999999", email: "exemplo@gmail.com", cutter: "J874", pais: "Brasil", cidade: "Goiania" }

];