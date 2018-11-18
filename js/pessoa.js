// Salvar linha posição da linha da pessoa na opção editar
let posicaoGravar;

// Tabela com resultados da pesquisa
let apresentarTabela = document.getElementById("resultado-pesquisa");

//Informar mensagem resultado nao encontrado
let infoPesquisa = document.getElementById("info-pesquisa");

//Informar mensagem cadastro pessoa
let infoCadastro = document.getElementById("info-cadastro");

//Informar mensagem exclusao 
let infoExclusao = document.getElementById("info-exclusao");

//Informar mensagem editar pessoa
let infoEditar = document.getElementById("info-editar");

// Conexao com pessoas
let pessoasRef = firebase.database().ref('pessoas/');

function excluir(posicao) {

    let i = posicao.parentNode.parentNode.rowIndex;
    let key = (document.getElementById("tabela-pessoas").rows[i].cells[0].innerHTML);
    let path = `pessoas/${key}`;
    path = path.replace(/\s/g, '');

    app_firebase.dataBaseApi.delete(path, messageHandlerDelete);
    document.getElementById("tabela-pessoas").deleteRow(i);
}


function limparMensagens() {
    infoCadastro.innerHTML = "";
    infoEditar.innerHTML = "";
    infoPesquisa.innerHTML = "";
}


function messageHandlerUpdate(err) {
    if (!!err) {
        infoEditar.innerHTML = "Alteracão não realizada!";
    } else {
        infoEditar.innerHTML = "Alteracão realizada com sucesso!";
    }
}

function messageHandlerCreate(err) {
    if (!!err) {
        infoCadastro.innerHTML = "Não foi possivel realizar o cadastro!";
    } else {
        infoCadastro.innerHTML = "Cadastrado realizado!";
    }
}

function messageHandlerDelete(err) {
    if (!!err) {
        infoExclusao.innerHTML = "Não foi possivel excluir!";
    } else {
        infoExclusao.innerHTML = "Registro foi removido!";
    }
}


function pesquisar() {

    let filtroPesquisa = document.getElementById("filtroPesquisa").value;

    tbody.innerHTML = "";
    body = document.getElementsByTagName("body")[0];
    table = body.getElementsByTagName("table")[0];
    tbody = table.getElementsByTagName("tbody")[0];

    if (filtroPesquisa.length != 0) {
        montarTabelaComFiltro(filtroPesquisa);
    } else {
        montarTabelaCompleta();
    }

}


function gravar() {

    let newID = firebase.database().ref().child('pessoas').push().key;

    let pessoa = {
        id: newID,
        nome: document.getElementById("nome-pessoa").value,
        perfil: document.getElementById("perfil-pessoa").value,
        telefone: document.getElementById("telefone-pessoa").value,
        email: document.getElementById("email-pessoa").value,
        curso: document.getElementById("curso-pessoa").value,
        instituicao: document.getElementById("instituicao-pessoa").value,
        escolaridade: document.getElementById("escolaridade-pessoa").value,
        endereco: document.getElementById("endereco-pessoa").value,
        cpf: document.getElementById("cpf-pessoa").value,
        rg: document.getElementById("rg-pessoa").value,
        responsavel: document.getElementById("responsavel-pessoa").value,
        usuario: document.getElementById("usuario-pessoa").value,
        senha: document.getElementById("senha-pessoa").value
    }

    let path = 'pessoas/' + newID;
    app_firebase.dataBaseApi.create(path, pessoa, messageHandlerCreate);

    infoCadastro.innerHTML = "Pessoa cadastrada com sucesso!";

}

function gravarAlteracao() {

    let dadoAlterado = {
        id: document.getElementById("editar-id-pessoa").value,
        nome: document.getElementById("editar-nome-pessoa").value,
        perfil: document.getElementById("editar-perfil-pessoa").value,
        telefone: document.getElementById("editar-telefone-pessoa").value,
        email: document.getElementById("editar-email-pessoa").value,
        curso: document.getElementById("editar-curso-pessoa").value,
        instituicao: document.getElementById("editar-instituicao-pessoa").value,
        escolaridade: document.getElementById("editar-escolaridade-pessoa").value,
        endereco: document.getElementById("editar-endereco-pessoa").value,
        cpf: document.getElementById("editar-cpf-pessoa").value,
        rg: document.getElementById("editar-rg-pessoa").value,
        responsavel: document.getElementById("editar-responsavel-pessoa").value,
        usuario: document.getElementById("editar-usuario-pessoa").value,
        senha: document.getElementById("editar-senha-pessoa").value
    }

    //ALTERAR CAMPOS QUE SÃO APRESENTADOS NA TABELA
    let linhaTabela = document.getElementById("tabela-pessoas").rows[posicaoGravar].cells;
    let path = 'pessoas/' + dadoAlterado.id;
    app_firebase.dataBaseApi.update(path, dadoAlterado, messageHandlerUpdate);
    linhaTabela[1].innerHTML = dadoAlterado.nome;
    linhaTabela[2].innerHTML = dadoAlterado.perfil;

    infoEditar.innerHTML = "Alteracão realizada com sucesso!";
}


// MONTAR MODAL COM DADOS PARA EDICAO
function montarModalEdicao(posicao) {

    // LIMPAR TODAS MENSAGENS
    limparMensagens();

    // OBTEM O ID DA EDITORA NA LINHA DA TABELA SELECIONADA
    let i = posicao.parentNode.parentNode.rowIndex;
    let id = (document.getElementById("tabela-pessoas").rows[i].cells[0].innerHTML);

    // replace para remover espaco vazio antes do id
    let referenciaBd = firebase.database().ref(`pessoas/ ${id}`.replace(/\s/g, ''));

    let pessoa = [];
    referenciaBd.on('value', function(snapshot) {

        if (!!snapshot) {
            pessoa = {
                id: snapshot.val().id,
                nome: snapshot.val().nome,
                perfil: snapshot.val().perfil,
                telefone: snapshot.val().telefone,
                email: snapshot.val().email,
                curso: snapshot.val().curso,
                instituicao: snapshot.val().instituicao,
                escolaridade: snapshot.val().escolaridade,
                endereco: snapshot.val().endereco,
                cpf: snapshot.val().cpf,
                rg: snapshot.val().rg,
                responsavel: snapshot.val().responsavel,
                usuario: snapshot.val().usuario,
                senha: snapshot.val().senha
            }

            //VARIAVEL USADA NO METODO gravarAlteracao, NECESSARIO PARA SABER QUAL POSICAO SERA EDITADA
            posicaoGravar = i;

            // PREENCHER MODAL COM DADOS PARA EDICAO
            document.getElementById("editar-id-pessoa").value = pessoa.id;
            document.getElementById("editar-nome-pessoa").value = pessoa.nome;
            document.getElementById("editar-perfil-pessoa").value = pessoa.perfil;
            document.getElementById("editar-telefone-pessoa").value = pessoa.telefone;
            document.getElementById("editar-email-pessoa").value = pessoa.email;
            document.getElementById("editar-curso-pessoa").value = pessoa.curso;
            document.getElementById("editar-instituicao-pessoa").value = pessoa.instituicao;
            document.getElementById("editar-escolaridade-pessoa").value = pessoa.escolaridade;
            document.getElementById("editar-endereco-pessoa").value = pessoa.endereco;
            document.getElementById("editar-cpf-pessoa").value = pessoa.cpf;
            document.getElementById("editar-rg-pessoa").value = pessoa.rg;
            document.getElementById("editar-responsavel-pessoa").value = pessoa.responsavel;
            document.getElementById("editar-usuario-pessoa").value = pessoa.usuario;
            document.getElementById("editar-senha-pessoa").value = pessoa.senha;
        }
    });
}

function errorFunction(snapshot) {
    return 'ERRO';
}

function teclaEnter(event) {
    let tecla = event.key;
    if (tecla == "Enter") {
        pesquisar();
    }
}

function montarTabelaCompleta() {
    pessoasRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            let pessoa = {
                id: childKey,
                nome: childData.nome,
                perfil: childData.perfil,
                telefone: childData.telefone,
                email: childData.email,
                curso: childData.curso,
                instituicao: childData.instituicao,
                escolaridade: childData.escolaridade,
                endereco: childData.endereco,
                cpf: childData.cpf,
                rg: childData.rg,
                responsavel: childData.responsavel,
                usuario: childData.usuario,
                senha: childData.senha
            }

            infoPesquisa.innerHTML = "";
            apresentarTabela.style.display = "block";

            tbody.innerHTML += `<tr><th> ${pessoa.id} </th> <td> ${pessoa.nome} </td> <td> ${pessoa.perfil} </td>
                <td><button onclick="montarModalEdicao(this)" data-toggle="modal" data-target="#modal-editar" class="btn btn-success"><i class="fa fa-edit"></i></button>
                <button class="btn btn-danger" onclick="excluir(this)"><i class="fa fa-trash"></i></button></td> </tr>`;

        });
    });
}


function montarTabelaComFiltro(filtro) {
    pessoasRef.orderByChild("nome").once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            let pessoa = {
                id: childKey,
                nome: childData.nome,
                perfil: childData.perfil,
                telefone: childData.telefone,
                email: childData.email,
                curso: childData.curso,
                instituicao: childData.instituicao,
                escolaridade: childData.escolaridade,
                endereco: childData.endereco,
                cpf: childData.cpf,
                rg: childData.rg,
                responsavel: childData.responsavel,
                usuario: childData.usuario,
                senha: childData.senha
            }

            infoPesquisa.innerHTML = "";
            apresentarTabela.style.display = "block";

            if (pessoa.nome.toUpperCase().indexOf(filtro.toUpperCase()) != -1) {
                tbody.innerHTML += `<tr><th> ${pessoa.id} </th> <td> ${pessoa.nome} </td> <td> ${pessoa.perfil} </td>
                    <td><button onclick="montarModalEdicao(this)" data-toggle="modal" data-target="#modal-editar" class="btn btn-success"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-danger" onclick="excluir(this)"><i class="fa fa-trash"></i></button></td> </tr>`;
            }
        });
    })
}

// Verificar se o usuario tem perfil para usar o sistema
function usuarioSistema(perfil) {
    if (perfil.value == "Administrador") {
        document.getElementById("div-usuario").style.display = "block";
        document.getElementById("div-senha").style.display = "block";
    } else {
        document.getElementById("div-usuario").style.display = "none";
        document.getElementById("div-senha").style.display = "none";
    }
}