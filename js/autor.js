// Guardar linha do autor que vai ser editado 
let posicaoAutorGravar;

// Tabela com resultados da pesquisa
let apresentarTabela = document.getElementById("resultado-pesquisa");

//Informar mensagem resultado nao encontrado
let infoPesquisa = document.getElementById("info-pesquisa");

//Informar mensagem cadastro autor
let infoCadastroAutor = document.getElementById("info-cadastro-autor");

//Informar mensagem cadastro autor
let infoExclusaoAutor = document.getElementById("info-exclusao-autor");

//Informar mensagem editar autor
let infoEditarAutor = document.getElementById("info-editar-autor");

// Conexao com autores
const autoresRef = firebase.database().ref('autores/');

let rowIndex = 1;



function excluirAutor(posicaoAutor) {

    var i = posicaoAutor.parentNode.parentNode.rowIndex;

    let key = (document.getElementById("tabela-autores").rows[i].cells[0].innerHTML);
    document.getElementById("tabela-autores").deleteRow(i);

    let path = `autores/${key}`;
    path = path.replace(/\s/g, '');
    console.log(path.replace(/\s/g, ''));

    app_firebase.dataBaseApi.delete(path, messageHandlerDelete);
}

// LIMPAR MENSAGENS 
function limparMensagens() {
    infoCadastroAutor.innerHTML = "";
    infoEditarAutor.innerHTML = "";
    infoPesquisa.innerHTML = "";
}

function messageHandlerUpdate(err) {
    if (!!err) {
        infoEditarAutor.innerHTML = "Alteracão não realizada!";
    } else {
        infoEditarAutor.innerHTML = "Alteracão realizada com sucesso!";
    }
}

function messageHandlerCreate(err) {
    if (!!err) {
        infoCadastroAutor.innerHTML = "Não foi possivel realizar o cadastro!";
    } else {
        infoCadastroAutor.innerHTML = "Autor cadastrado com sucesso!";
    }
}

function messageHandlerDelete(err) {
    if (!!err) {
        infoExclusaoAutor.innerHTML = "Não foi possivel excluir o autor!";
    } else {
        infoExclusaoAutor.innerHTML = "Autor foi removido!";
    }
}

// MONTAR MODAL COM DADOS DO AUTOR PARA EDICAO
function montarModalEdicao(posicaoAutor) {

    // LIMPAR TODAS MENSAGENS
    limparMensagens();

    // OBTEM O ID DO AUTOR NA LINHA DA TABELA SELECIONADA
    let i = posicaoAutor.parentNode.parentNode.rowIndex;
    let id = (document.getElementById("tabela-autores").rows[i].cells[0].innerHTML);

    // replace para remover espaco vazio antes do id
    let autorTempRef = firebase.database().ref(`autores/ ${id}`.replace(/\s/g, ''));

    let autor = [];
    autorTempRef.on('value', function(snapshot) {
        if (!!snapshot) {
            autor = {
                id: snapshot.val().id,
                nome: snapshot.val().nome,
                pais: snapshot.val().pais,
                email: snapshot.val().email,
                cidade: snapshot.val().cidade,
                cutter: snapshot.val().cutter,
                dtnasc: snapshot.val().dtnasc
            }

            //VARIAVEL USADA NO METODO gravarAlteracaoAutor, NECESSARIO PARA SABER QUAL POSICAO SERA EDITADA
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
    });

}

function gravarAlteracaoAutor() {

    let autorModificado = {
        id: document.getElementById("editar-id-autor").value,
        nome: document.getElementById("editar-nome-autor").value,
        pais: document.getElementById("editar-pais-autor").value,
        email: document.getElementById("editar-email-autor").value,
        cidade: document.getElementById("editar-cidade-autor").value,
        cutter: document.getElementById("editar-cutter-autor").value,
        dtnasc: document.getElementById("editar-data-nascimento-autor").value
    }

    //ALTERAR CAMPOS QUE SÃO APRESENTADOS NA TABELA
    let linhaAutor = document.getElementById("tabela-autores").rows[posicaoAutorGravar].cells;
    linhaAutor[1].innerHTML = autorModificado.nome;
    linhaAutor[2].innerHTML = autorModificado.cutter;

    let path = 'autores/' + autorModificado.id;

    app_firebase.dataBaseApi.update(path, autorModificado, messageHandlerUpdate)
}

function gravarAutor() {

    let uid = firebase.database().ref().child('autores').push().key;

    // GRAVAR NOVO AUTOR
    let autor = {
        id: uid,
        nome: document.getElementById("nome-autor").value,
        pais: document.getElementById("pais-autor").value,
        email: document.getElementById("email-autor").value,
        cidade: document.getElementById("cidade-autor").value,
        cutter: document.getElementById("cutter-autor").value,
        dtnasc: document.getElementById("data-nascimento-autor").value

    }

    let path = 'autores/' + uid;
    app_firebase.dataBaseApi.create(path, autor, messageHandlerCreate);
}

//Pesquisar com tecla enter
function teclaEnter(event) {

    let tecla = event.key;
    if (tecla == "Enter") {
        pesquisarAutores();
    }
}


function pesquisarAutores() {

    let filtroAutor = document.getElementById("filtroAutor").value;

    tbody.innerHTML = "";
    body = document.getElementsByTagName("body")[0];
    table = body.getElementsByTagName("table")[0];
    tbody = table.getElementsByTagName("tbody")[0];

    // Buscar autor especifico
    if (filtroAutor.length != 0) {
        montarTabelaComFiltro(filtroAutor);
        // Buscar todos autores
    } else {
        montarTabelaTodosAutores();
    }

}

function montarTabelaComFiltro(filtro) {

    autoresRef
        .orderByChild("nome")
        .startAt(filtro)
        .once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {

                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();

                let autor = {
                    id: childKey,
                    nome: childData.nome,
                    pais: childData.pais,
                    email: childData.email,
                    cidade: childData.cidade,
                    cutter: childData.cutter,
                    dtnasc: childData.dtnasc
                }

                infoPesquisa.innerHTML = "";
                apresentarTabela.style.display = "block";

                if (autor.nome.toUpperCase().indexOf(filtro.toUpperCase()) != -1) {
                    tbody.innerHTML += `<tr><th> ${autor.id} </th> <td> ${autor.nome} </td> <td> ${autor.cutter} </td>
                    <td><button onclick="montarModalEdicao(this)" data-toggle="modal" data-target="#modal-editar-autor" class="btn btn-success"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-danger" onclick="excluirAutor(this)"><i class="fa fa-trash"></i></button></td> </tr>`;
                }
            });
        })
}

// RETORNA TODOS AUTORES CADASTRADOS
function montarTabelaTodosAutores() {
    autoresRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            let autor = {
                id: childKey,
                nome: childData.nome,
                pais: childData.pais,
                email: childData.email,
                cidade: childData.cidade,
                cutter: childData.cutter,
                dtnasc: childData.dtnasc
            }

            infoPesquisa.innerHTML = "";
            apresentarTabela.style.display = "block";

            tbody.innerHTML += `<tr><th> ${autor.id} </th> <td> ${autor.nome} </td> <td> ${autor.cutter} </td>
                <td><button onclick="montarModalEdicao(this)" data-toggle="modal" data-target="#modal-editar-autor" class="btn btn-success"><i class="fa fa-edit"></i></button>
                <button class="btn btn-danger" onclick="excluirAutor(this)"><i class="fa fa-trash"></i></button></td> </tr>`;

        });
    });
}