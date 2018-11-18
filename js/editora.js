// GUARDAR LINHA SELECIONADA DO EDITORA QUANDO A OPCAO E EDITAR
let posicaoEditoraGravar;

// Tabela com resultados da pesquisa
let apresentarTabela = document.getElementById("resultado-pesquisa");

//Informar mensagem resultado nao encontrado
let infoPesquisa = document.getElementById("info-pesquisa");

//Informar mensagem cadastro editora
let infoCadastroEditora = document.getElementById("info-cadastro-editora");

//Informar mensagem exclusao editora
let infoExclusaoEditora = document.getElementById("info-exclusao-editora");

//Informar mensagem editar editora
let infoEditarEditora = document.getElementById("info-editar-editora");

// Conexao com autores
let editoraRef = firebase.database().ref('editoras/');

function excluirEditora(posicaoEditora) {

    var i = posicaoEditora.parentNode.parentNode.rowIndex;

    let key = (document.getElementById("tabela-editoras").rows[i].cells[0].innerHTML);
    document.getElementById("tabela-editoras").deleteRow(i);

    let path = `editoras/${key}`;
    path = path.replace(/\s/g, '');

    app_firebase.dataBaseApi.delete(path, messageHandlerDelete);
}

// LIMPAR MENSAGENS 
function limparMensagens() {
    infoCadastroEditora.innerHTML = "";
    infoEditarEditora.innerHTML = "";
    infoPesquisa.innerHTML = "";
}


function messageHandlerUpdate(err) {
    if (!!err) {
        infoEditarEditora.innerHTML = "Alteracão não realizada!";
    } else {
        infoEditarEditora.innerHTML = "Alteracão realizada com sucesso!";
    }
}

function messageHandlerCreate(err) {
    if (!!err) {
        infoCadastroEditora.innerHTML = "Não foi possivel realizar o cadastro!";
    } else {
        infoCadastroEditora.innerHTML = "Cadastrado realizado!";
    }
}

function messageHandlerDelete(err) {
    if (!!err) {
        infoExclusaoEditora.innerHTML = "Não foi possivel excluir!";
    } else {
        infoExclusaoEditora.innerHTML = "Registro foi removido!";
    }
}


function gravarEditora() {

    let newID = firebase.database().ref().child('editoras').push().key;

    let editora = {
        id: newID,
        nome: document.getElementById("nome-editora").value,
        pais: document.getElementById("pais-editora").value,
        telefone: document.getElementById("telefone-editora").value,
        email: document.getElementById("email-editora").value,
        cidade: document.getElementById("cidade-editora").value,
        endereco: document.getElementById("endereco-editora").value,
        cnpj: document.getElementById("cnpj-editora").value
    }

    let path = 'editoras/' + newID;
    app_firebase.dataBaseApi.create(path, editora, messageHandlerCreate);
}

function montarTabelaComFiltro(filtro) {
    editoraRef.orderByChild("nome").startAt(filtro).once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            let editora = {
                id: childKey,
                nome: childData.nome,
                pais: childData.pais,
                telefone: childData.telefone,
                email: childData.email,
                cidade: childData.cidade,
                endereco: childData.endereco,
                cnpj: childData.cnpj
            }

            infoPesquisa.innerHTML = "";
            apresentarTabela.style.display = "block";

            if (editora.nome.toUpperCase().indexOf(filtro.toUpperCase()) != -1) {
                tbody.innerHTML += `<tr><th> ${editora.id} </th> <td> ${editora.nome} </td> <td> ${editora.cidade} </td>
                    <td><button onclick="montarModalEdicao(this)" data-toggle="modal" data-target="#modal-editar-editora" class="btn btn-success"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-danger" onclick="excluirEditora(this)"><i class="fa fa-trash"></i></button></td> </tr>`;
            }
        });
    })
}

// RETORNA TODOS AUTORES CADASTRADOS
function montarTabelaCompleta() {
    editoraRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            let editora = {
                id: childKey,
                nome: childData.nome,
                pais: childData.pais,
                telefone: childData.telefone,
                email: childData.email,
                cidade: childData.cidade,
                endereco: childData.endereco,
                cnpj: childData.cnpj
            }

            infoPesquisa.innerHTML = "";
            apresentarTabela.style.display = "block";

            tbody.innerHTML += `<tr><th> ${editora.id} </th> <td> ${editora.nome} </td> <td> ${editora.cidade} </td>
                <td><button onclick="montarModalEdicao(this)" data-toggle="modal" data-target="#modal-editar-editora" class="btn btn-success"><i class="fa fa-edit"></i></button>
                <button class="btn btn-danger" onclick="excluirEditora(this)"><i class="fa fa-trash"></i></button></td> </tr>`;

        });
    });
}


function pesquisarEditora() {

    let filtroPesquisa = document.getElementById("filtroPesquisa").value;

    tbody.innerHTML = "";
    body = document.getElementsByTagName("body")[0];
    table = body.getElementsByTagName("table")[0];
    tbody = table.getElementsByTagName("tbody")[0];

    // Buscar editora especifica
    if (filtroPesquisa.length != 0) {
        montarTabelaComFiltro(filtroPesquisa);
        // Buscar todas editoras
    } else {
        montarTabelaCompleta();
    }

}



function gravarAlteracaoEditora() {

    let editoraModificada = {
        id: document.getElementById("editar-id-editora").value,
        nome: document.getElementById("editar-nome-editora").value,
        pais: document.getElementById("editar-pais-editora").value,
        telefone: document.getElementById("editar-telefone-editora").value,
        email: document.getElementById("editar-email-editora").value,
        cidade: document.getElementById("editar-cidade-editora").value,
        cnpj: document.getElementById("editar-cnpj-editora").value,
        endereco: document.getElementById("editar-endereco-editora").value
    }

    //ALTERAR CAMPOS QUE SÃO APRESENTADOS NA TABELA
    let linhaEditora = document.getElementById("tabela-editoras").rows[posicaoEditoraGravar].cells;
    linhaEditora[1].innerHTML = editoraModificada.nome;
    linhaEditora[2].innerHTML = editoraModificada.cidade;

    let path = 'editoras/' + editoraModificada.id;

    app_firebase.dataBaseApi.update(path, editoraModificada, messageHandlerUpdate)
}

// MONTAR MODAL COM DADOS DO AUTOR PARA EDICAO
function montarModalEdicao(posicaoEditora) {

    // LIMPAR TODAS MENSAGENS
    limparMensagens();

    // OBTEM O ID DA EDITORA NA LINHA DA TABELA SELECIONADA
    let i = posicaoEditora.parentNode.parentNode.rowIndex;
    let id = (document.getElementById("tabela-editoras").rows[i].cells[0].innerHTML);

    // replace para remover espaco vazio antes do id
    let editoraTempRef = firebase.database().ref(`editoras/ ${id}`.replace(/\s/g, ''));

    let editora = [];
    editoraTempRef.on('value', function(snapshot) {

        if (!!snapshot) {
            editora = {
                id: snapshot.val().id,
                nome: snapshot.val().nome,
                pais: snapshot.val().pais,
                email: snapshot.val().email,
                cidade: snapshot.val().cidade,
                cutter: snapshot.val().cutter,
                telefone: snapshot.val().telefone,
                endereco: snapshot.val().endereco,
                cnpj: snapshot.val().cnpj
            }

            //VARIAVEL USADA NO METODO gravarAlteracaoAutor, NECESSARIO PARA SABER QUAL POSICAO SERA EDITADA
            posicaoEditoraGravar = i;
            // PREENCHER MODAL COM DADOS DO AUTOR PARA EDICAO
            document.getElementById("editar-id-editora").value = editora.id;
            document.getElementById("editar-cnpj-editora").value = editora.cnpj;
            document.getElementById("editar-pais-editora").value = editora.pais;
            document.getElementById("editar-email-editora").value = editora.email;
            document.getElementById("editar-cidade-editora").value = editora.cidade;
            document.getElementById("editar-nome-editora").value = editora.nome;
            document.getElementById("editar-telefone-editora").value = editora.telefone;
            document.getElementById("editar-endereco-editora").value = editora.endereco;
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
        pesquisarEditora();
    }
}