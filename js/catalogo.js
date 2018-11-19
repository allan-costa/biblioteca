// Salvar linha posição da linha do catalogo na opção editar
let posicaoGravar;

// Tabela com resultados da pesquisa
let apresentarTabela = document.getElementById("resultado-pesquisa");

//Informar mensagem resultado nao encontrado
let infoPesquisa = document.getElementById("info-pesquisa");

//Informar mensagem cadastro catalogo
let infoCadastro = document.getElementById("info-cadastro");

//Informar mensagem exclusao 
let infoExclusao = document.getElementById("info-exclusao");

//Informar mensagem editar pessoa
let infoEditar = document.getElementById("info-editar");

// Conexao com catalogos
let catalogosRef = firebase.database().ref('catalogos/');

function excluir(posicao) {

    var i = posicao.parentNode.parentNode.rowIndex;

    let key = (document.getElementById("tabela-catalogos").rows[i].cells[0].innerHTML);
    document.getElementById("tabela-catalogos").deleteRow(i);

    let path = `catalogos/${key}`;
    path = path.replace(/\s/g, '');
    console.log(path.replace(/\s/g, ''));

    app_firebase.dataBaseApi.delete(path, messageHandlerDelete);
}

function removerEspaco(string) {
    string = string.replace(/\s/g, '');
    return string;
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


function errorFunction(snapshot) {
    return 'ERRO';
}

function teclaEnter(event) {
    let tecla = event.key;
    if (tecla == "Enter") {
        pesquisar();
    }
}


function inicializarDados() {
    montarListaAutores(false);
    montarListaEditoras(false);
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

function montarListaAutores(isEditar) {
    const autoresRef = firebase.database().ref('autores/');
    let x;


    if (isEditar) {
        x = document.getElementById("editar-catalogo-autor");
    } else {
        x = document.getElementById("catalogo-autor");
        console.log(isEditar);
    }

    autoresRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            let option = document.createElement("option");
            let childData = childSnapshot.val();

            option.id = removerEspaco(childData.id);
            option.text = childData.nome;
            option.value = childData.id;
            x.add(option);

        });
    });
}



function montarListaEditoras(isEditar) {
    const editorasRef = firebase.database().ref('editoras/');
    let x;

    if (isEditar) {

        x = document.getElementById("editar-catalogo-editora");
    } else {
        x = document.getElementById("catalogo-editora");
    }

    editorasRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            let option = document.createElement("option");
            let childData = childSnapshot.val();
            option.id = removerEspaco(childData.id);

            option.text = childData.nome;
            option.value = childData.id;
            x.add(option);


        });
    });
}

function criarExemplares(catalogo) {

    for (i = 0; i < catalogo.numeroExemplares; i++) {

        let newID = firebase.database().ref().child('exemplares').push().key;

        let exemplar = {
            id: newID,
            catalogo: { "id": catalogo.id, "titulo": catalogo.titulo },
            situacao: 'Disponivel',
            autor: { "id": catalogo.autor.id, "nome": catalogo.autor.nome },
            tombo: null,
            consulta: false
        }

        let path = 'exemplares/' + newID;
        app_firebase.dataBaseApi.create(path, exemplar, messageHandlerCreate);
    }

}

function gravar() {

    let newID = firebase.database().ref().child('catalogos').push().key;

    let autorTemp = document.getElementById('catalogo-autor');
    let autorNome = autorTemp.options[autorTemp.selectedIndex].text;
    let autorId = autorTemp.options[autorTemp.selectedIndex].value;

    let editoraTemp = document.getElementById('catalogo-editora');
    let editoraNome = editoraTemp.options[editoraTemp.selectedIndex].text;
    let editoraId = editoraTemp.options[editoraTemp.selectedIndex].value;

    let catalogo = {
        id: newID,
        titulo: document.getElementById("catalogo-titulo").value,
        subtitulo: document.getElementById("catalogo-subtitulo").value,
        abreviacao: document.getElementById("catalogo-abreviacao").value,
        dataPublicacao: document.getElementById("catalogo-dataPublicacao").value,
        numeroPaginas: document.getElementById("catalogo-numeroPaginas").value,
        editora: { "id": editoraId, "nome": editoraNome },
        autor: { "id": autorId, "nome": autorNome },
        edicao: document.getElementById("catalogo-edicao").value,
        volume: document.getElementById("catalogo-volume").value,
        cutterpha: document.getElementById("catalogo-cutterpha").value,
        isbn: document.getElementById("catalogo-isbn").value,
        issn: document.getElementById("catalogo-issn").value,
        numeroControle: document.getElementById("catalogo-numeroControle").value,
        classificacao: document.getElementById("catalogo-classificacao").value,
        tipoCatalogo: document.getElementById("catalogo-tipoCatalogo").value,
        areaConhecimento: document.getElementById("catalogo-areaConhecimento").value,
        numeroExemplares: document.getElementById("catalogo-numeroExemplares").value
    }

    let path = 'catalogos/' + newID;
    app_firebase.dataBaseApi.create(path, catalogo, messageHandlerCreate);

    // ira criar os exemplares que é informado no momento do cadastro
    criarExemplares(catalogo);

}


// MONTAR MODAL COM DADOS PARA EDICAO
function montarModalEdicao(posicao) {

    // LIMPAR TODAS MENSAGENS
    limparMensagens();

    montarListaEditoras(true);
    montarListaAutores(true);

    // OBTEM O ID DA EDITORA NA LINHA DA TABELA SELECIONADA
    let i = posicao.parentNode.parentNode.rowIndex;
    let id = (document.getElementById("tabela-catalogos").rows[i].cells[0].innerHTML);
    let catalogo = [];
    // replace para remover espaco vazio antes do id
    let referenciaBd = firebase.database().ref(`catalogos/ ${id}`.replace(/\s/g, ''));

    referenciaBd.on('value', function(snapshot) {

        if (!!snapshot) {
            catalogo = {
                id: snapshot.val().id,
                titulo: snapshot.val().titulo,
                subtitulo: snapshot.val().subtitulo,
                abreviacao: snapshot.val().abreviacao,
                dataPublicacao: snapshot.val().dataPublicacao,
                numeroPaginas: snapshot.val().numeroPaginas,
                editora: snapshot.val().editora,
                autor: snapshot.val().autor,
                editora: { "id": snapshot.val().editora.id, "nome": snapshot.val().editora.nome },
                autor: { "id": snapshot.val().autor.id, "nome": snapshot.val().autor.nome },
                edicao: snapshot.val().edicao,
                volume: snapshot.val().volume,
                cutterpha: snapshot.val().cutterpha,
                isbn: snapshot.val().isbn,
                issn: snapshot.val().issn,
                numeroControle: snapshot.val().numeroControle,
                classificacao: snapshot.val().classificacao,
                tipoCatalogo: snapshot.val().tipoCatalogo,
                areaConhecimento: snapshot.val().areaConhecimento,
                numeroExemplares: snapshot.val().numeroExemplares
            }

            //VARIAVEL USADA NO METODO gravarAlteracao, NECESSARIO PARA SABER QUAL POSICAO SERA EDITADA
            posicaoGravar = i;

            document.getElementById("editar-catalogo-id").value = catalogo.id;
            document.getElementById("editar-catalogo-titulo").value = catalogo.titulo;
            document.getElementById("editar-catalogo-subtitulo").value = catalogo.subtitulo;
            document.getElementById("editar-catalogo-abreviacao").value = catalogo.abreviacao;
            document.getElementById("editar-catalogo-dataPublicacao").value = catalogo.dataPublicacao;
            document.getElementById("editar-catalogo-numeroPaginas").value = catalogo.numeroPaginas;
            document.getElementById("editar-catalogo-editora").value = catalogo.editora.nome; // TODO não esta carregando
            document.getElementById("editar-catalogo-autor").value = catalogo.autor.nome; // TODO não esta carregando exemplo https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_option_selected
            document.getElementById("editar-catalogo-edicao").value = catalogo.edicao;
            document.getElementById("editar-catalogo-volume").value = catalogo.volume;
            document.getElementById("editar-catalogo-cutterpha").value = catalogo.cutterpha;
            document.getElementById("editar-catalogo-isbn").value = catalogo.isbn;
            document.getElementById("editar-catalogo-issn").value = catalogo.issn;
            document.getElementById("editar-catalogo-numeroControle").value = catalogo.numeroControle;
            document.getElementById("editar-catalogo-classificacao").value = catalogo.classificacao;
            document.getElementById("editar-catalogo-tipoCatalogo").value = catalogo.tipoCatalogo;
            document.getElementById("editar-catalogo-areaConhecimento").value = catalogo.areaConhecimento;
            document.getElementById("editar-catalogo-numeroExemplares").value = catalogo.numeroExemplares;
        }
    })
}


function montarTabelaCompleta() {
    catalogosRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();

            let catalogo = {
                id: childData.id,
                titulo: childData.titulo,
                subtitulo: childData.subtitulo,
                abreviacao: childData.abreviacao,
                dataPublicacao: childData.dataPublicacao,
                numeroPaginas: childData.numeroPaginas,
                editora: childData.editora,
                autor: childData.autor,
                edicao: childData.edicao,
                volume: childData.volume,
                cutterpha: childData.cutterpha,
                isbn: childData.isbn,
                issn: childData.issn,
                numeroControle: childData.numeroControle,
                classificacao: childData.classificacao,
                tipoCatalogo: childData.tipoCatalogo,
                areaConhecimento: childData.areaConhecimento,
                numeroExemplares: childData.numeroExemplares
            }

            infoPesquisa.innerHTML = "";
            apresentarTabela.style.display = "block";

            tbody.innerHTML += `<tr><th> ${catalogo.id} </th> <td> ${catalogo.titulo} </td> <td> ${catalogo.autor.nome} </td> <td> ${catalogo.numeroExemplares} </td>
                <td><button onclick="montarModalEdicao(this)" data-toggle="modal" data-target="#modal-editar" class="btn btn-success"><i class="fa fa-edit"></i></button>
                <button class="btn btn-danger" onclick="excluir(this)"><i class="fa fa-trash"></i></button></td> </tr>`;

        });
    });
}


function montarTabelaComFiltro(filtro) {
    catalogosRef.orderByChild("nome").once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();

            let catalogo = {
                id: childData.id,
                titulo: childData.titulo,
                subtitulo: childData.subtitulo,
                abreviacao: childData.abreviacao,
                dataPublicacao: childData.dataPublicacao,
                numeroPaginas: childData.numeroPaginas,
                editora: childData.editora,
                autor: childData.autor,
                edicao: childData.edicao,
                volume: childData.volume,
                cutterpha: childData.cutterpha,
                isbn: childData.isbn,
                issn: childData.issn,
                numeroControle: childData.numeroControle,
                classificacao: childData.classificacao,
                tipoCatalogo: childData.tipoCatalogo,
                areaConhecimento: childData.areaConhecimento,
                numeroExemplares: childData.numeroExemplares
            }

            infoPesquisa.innerHTML = "";
            apresentarTabela.style.display = "block";

            if (catalogo.titulo.toUpperCase().indexOf(filtro.toUpperCase()) != -1) {
                tbody.innerHTML += `<tr><th> ${catalogo.id} </th> <td> ${catalogo.titulo} </td> <td> ${catalogo.autor.nome} </td> <td> ${catalogo.numeroExemplares} </td>
                    <td><button onclick="montarModalEdicao(this)" data-toggle="modal" data-target="#modal-editar" class="btn btn-success"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-danger" onclick="excluir(this)"><i class="fa fa-trash"></i></button></td> </tr>`;
            }
        });
    })
}
