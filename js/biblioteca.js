// Salvar linha selecionada da tabela biblioteca quando a opção for editar 
let posicaoBibliotecaGravar;

// Tabela com resultados da pesquisa
let apresentarTabela = document.getElementById("resultado-pesquisa");

//Informar mensagem resultado nao encontrado
let infoPesquisa = document.getElementById("info-pesquisa");

//Informar mensagem cadastro biblioteca
let infoCadastroBiblioteca = document.getElementById("info-cadastro-biblioteca");

//Informar mensagem exclusao biblioteca
let infoExclusaoBiblioteca = document.getElementById("info-exclusao-biblioteca");

//Informar mensagem editar biblioteca
let infoEditarBiblioteca = document.getElementById("info-editar-biblioteca");

// Conexao com autores
let bibliotecaRef = firebase.database().ref('bibliotecas/');

function excluirBiblioteca(posicaoBiblioteca) {

    let i = posicaoBiblioteca.parentNode.parentNode.rowIndex;
    let key = (document.getElementById("tabela-bibliotecas").rows[i].cells[0].innerHTML);
    document.getElementById("tabela-bibliotecas").deleteRow(i);

    let path = `bibliotecas/${key}`;
    path = path.replace(/\s/g, '');

    app_firebase.dataBaseApi.delete(path, messageHandlerDelete);
}

function limparMensagens() {
    infoCadastroBiblioteca.innerHTML = "";
    infoEditarBiblioteca.innerHTML = "";
    infoPesquisa.innerHTML = "";
}


function messageHandlerUpdate(err) {
    if (!!err) {
        infoEditarBiblioteca.innerHTML = "Alteracão não realizada!";
    } else {
        infoEditarBiblioteca.innerHTML = "Alteracão realizada com sucesso!";
    }
}

function messageHandlerCreate(err) {
    if (!!err) {
        infoCadastroBiblioteca.innerHTML = "Não foi possivel realizar o cadastro!";
    } else {
        infoCadastroBiblioteca.innerHTML = "Cadastrado realizado!";
    }
}

function messageHandlerDelete(err) {
    if (!!err) {
        infoExclusaoBiblioteca.innerHTML = "Não foi possivel excluir!";
    } else {
        infoExclusaoBiblioteca.innerHTML = "Registro foi removido!";
    }
}


function gravarBiblioteca() {

    let newID = firebase.database().ref().child('bibliotecas').push().key;

    let biblioteca = {
        id: newID,
        nome: document.getElementById("nome-biblioteca").value,
        turno: document.getElementById("turno-biblioteca").value,
        endereco: document.getElementById("endereco-biblioteca").value,
        instituicao: document.getElementById("instituicao-biblioteca").value,
        telefone: document.getElementById("telefone-biblioteca").value,
        email: document.getElementById("email-biblioteca").value,
        responsavel: document.getElementById("responsavel-biblioteca").value
    }

    let path = 'bibliotecas/' + newID;
    app_firebase.dataBaseApi.create(path, biblioteca, messageHandlerCreate);

    pesquisarBibliotecas();
}



// RETORNA TODOS Bibliotecas CADASTRADAS
function montarTabelaCompleta() {
    bibliotecaRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            let biblioteca = {
                id: childKey,
                nome: childData.nome,
                turno: childData.turno,
                endereco: childData.endereco,
                instituicao: childData.instituicao,
                telefone: childData.telefone,
                email: childData.email,
                responsavel: childData.responsavel
            }

            infoPesquisa.innerHTML = "";
            apresentarTabela.style.display = "block";

            tbody.innerHTML += `<tr><th> ${biblioteca.id} </th> <td> ${biblioteca.nome} </td> <td> ${biblioteca.instituicao} </td>
                <td><button onclick="montarModalEdicao(this)" data-toggle="modal" data-target="#modal-editar-biblioteca" class="btn btn-success"><i class="fa fa-edit"></i></button>
                <button class="btn btn-danger" onclick="excluirBiblioteca(this)"><i class="fa fa-trash"></i></button></td> </tr>`;

        });
    });
}


function pesquisarBibliotecas() {

    tbody.innerHTML = "";
    body = document.getElementsByTagName("body")[0];
    table = body.getElementsByTagName("table")[0];
    tbody = table.getElementsByTagName("tbody")[0];
    montarTabelaCompleta();

}


function gravarAlteracao() {

    let bibliotecaModificada = {
        id: document.getElementById("editar-id-biblioteca").value,
        nome: document.getElementById("editar-nome-biblioteca").value,
        turno: document.getElementById("editar-turno-biblioteca").value,
        endereco: document.getElementById("editar-endereco-biblioteca").value,
        instituicao: document.getElementById("editar-instituicao-biblioteca").value,
        telefone: document.getElementById("editar-telefone-biblioteca").value,
        email: document.getElementById("editar-email-biblioteca").value,
        responsavel: document.getElementById("editar-responsavel-biblioteca").value
    }

    //ALTERAR CAMPOS QUE SÃO APRESENTADOS NA TABELA
    let linhaBiblioteca = document.getElementById("tabela-bibliotecas").rows[posicaoBibliotecaGravar].cells;
    linhaBiblioteca[1].innerHTML = bibliotecaModificada.nome;
    linhaBiblioteca[2].innerHTML = bibliotecaModificada.instituicao;

    let path = 'bibliotecas/' + bibliotecaModificada.id;

    app_firebase.dataBaseApi.update(path, bibliotecaModificada, messageHandlerUpdate);

}

// MONTAR MODAL COM DADOS DO AUTOR PARA EDICAO
function montarModalEdicao(posicaoBiblioteca) {

    // LIMPAR TODAS MENSAGENS
    limparMensagens();

    // OBTEM O ID DA EDITORA NA LINHA DA TABELA SELECIONADA
    let i = posicaoBiblioteca.parentNode.parentNode.rowIndex;
    let id = (document.getElementById("tabela-bibliotecas").rows[i].cells[0].innerHTML);

    // replace para remover espaco vazio antes do id
    let bibliotecaTempRef = firebase.database().ref(`bibliotecas/ ${id}`.replace(/\s/g, ''));

    let biblioteca = [];
    bibliotecaTempRef.on('value', function(snapshot) {

        if (!!snapshot) {
            biblioteca = {
                id: snapshot.val().id,
                nome: snapshot.val().nome,
                turno: snapshot.val().turno,
                endereco: snapshot.val().endereco,
                instituicao: snapshot.val().instituicao,
                telefone: snapshot.val().telefone,
                email: snapshot.val().email,
                responsavel: snapshot.val().responsavel,
            }

            //VARIAVEL USADA NO METODO gravarAlteracaoAutor, NECESSARIO PARA SABER QUAL POSICAO SERA EDITADA
            posicaoBibliotecaGravar = i;
            // PREENCHER MODAL COM DADOS DO AUTOR PARA EDICAO
            document.getElementById("editar-id-biblioteca").value = biblioteca.id;
            document.getElementById("editar-nome-biblioteca").value = biblioteca.nome;
            document.getElementById("editar-turno-biblioteca").value = biblioteca.turno;
            document.getElementById("editar-endereco-biblioteca").value = biblioteca.endereco;
            document.getElementById("editar-instituicao-biblioteca").value = biblioteca.instituicao;
            document.getElementById("editar-telefone-biblioteca").value = biblioteca.telefone;
            document.getElementById("editar-email-biblioteca").value = biblioteca.email;
            document.getElementById("editar-responsavel-biblioteca").value = biblioteca.responsavel;
        }
    });
}

function errorFunction(snapshot) {
    return 'ERRO';
}

//Pesquisar com tecla enter
function teclaEnter(event) {
    let tecla = event.key;
    if (tecla == "Enter") {
        pesquisarBiblioteca();
    }
}