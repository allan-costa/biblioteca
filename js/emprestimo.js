// Tabela com resultados da pesquisa de emprestimos
let apresentarTabelaEmprestimosAtivos = document.getElementById("resultado-pesquisa-emprestimos");

// Tabela com resultados da pesquisa de pessoas que farao emprestimos
let apresentarTabelaPessoa = document.getElementById("resultado-pesquisa-pessoa");

let apresentarTabelaExemplares = document.getElementById("resultado-pesquisa-exemplar");

//Informar mensagem cadastro emprestimo
let infoCadastroEmprestimo = document.getElementById("info-cadastro-emprestimo");

//Informar mensagem resultado de emprestimo nao encontrado
let infoPesquisaEmprestimo = document.getElementById("info-pesquisar-emprestimo");

//Informar mensagem resultado da pessoa que ira fazer o emprestimo nao foi encontrado
let infoPesquisaPessoa = document.getElementById("info-pesquisa-pessoa");

// Variavel para popular a matricula da pessoa que esta realizando o emprestimo
let pessoaEmprestimo = document.getElementById("pessoa-emprestimo");

//Informar nome da pessoa selecionada na tela
let apresentarIdPessoa = document.getElementById("apresentar-id-pessoa");

//Informar nome da pessoa selecionada na tela
let apresentarIdExemplar = document.getElementById("apresentar-id-exemplar");

// Conexao com pessoas
const pessoasRef = firebase.database().ref('pessoas/');
const exemplaresRef = firebase.database().ref('exemplares/');
const emprestimosRef = firebase.database().ref('emprestimos/');

let dataEmprestimo = document.getElementById("data-emprestimo");

function limparMensagens() {
    infoCadastroEmprestimo.innerHTML = "";
    infoPesquisaEmprestimo.innerHTML = "";
    infoPesquisaPessoa.innerHTML = "";
    apresentarTabelaPessoa.style.display = "none";
}

function messageHandlerFinalizarEmprestimo(err) {
    if (!!err) {
        alert('Não foi possivel finalizar o emprestimo');
    } else {
        alert('Emprestimo finalizado!');
    }
}

function messageHandlerUpdate(err) {
    if (!!err) {
        infoEditarEm.innerHTML = "Alteracão não realizada!";
    } else {
        infoEditar.innerHTML = "Alteracão realizada com sucesso!";
    }
}

function messageHandlerCreate(err) {
    if (!!err) {
        infoCadastro.innerHTML = "Não foi possivel realizar o cadastro!";
    } else {
        infoCadastroEmprestimo.innerHTML = "Cadastrado realizado!";
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

function carregarBiblioteca() {
    const bibliotecasRef = firebase.database().ref('bibliotecas/');
    let x;
    x = document.getElementById("biblioteca-emprestimo");

    bibliotecasRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            let option = document.createElement("option");
            let childData = childSnapshot.val();

            option.id = childData.id;
            option.text = childData.nome;
            option.value = childData.id;
            x.add(option);

        });
    });
}

function inicializarDados() {
    data = new Date();
    dataEmprestimo.value = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;

    carregarBiblioteca();
    document.getElementById("atendente-emprestimo").value = sessionStorage.getItem("usuario");
}

function pesquisarPessoa() {
    limparMensagens();

    // OBTEM O NOME DA PESSOA QUE IRA FAZER O EMPRESTIMO
    let nomePessoa = document.getElementById("nomePessoa-emprestimo");
    let nomePessoaModal = document.getElementById("nomePessoa-emprestimo-modal");

    if (nomePessoaModal.value != '') {
        montarTabelaPesquisaPessoaComFiltro(nomePessoaModal.value);
    } else if (nomePessoa.value === '') {
        montarTabelaPesquisaPessoaCompleta();
    } else {
        montarTabelaPesquisaPessoaComFiltro(nomePessoa.value);
    }
    nomePessoa.value = '';
}

function pesquisarExemplar() {

    limparMensagens();

    // OBTEM O TITULO DO EXEMPLAR 
    let exemplar = document.getElementById("exemplar-emprestimo");
    let exemplarModal = document.getElementById("exemplar-emprestimo-modal");

    if (exemplarModal != '') {
        montarTabelaPesquisaExemplarComFiltro(exemplarModal.value);
    } else {
        montarTabelaPesquisaExemplarComFiltro(exemplar.value);
    }

    exemplar.value = '';
}

function montarTabelaPesquisaPessoaCompleta() {

    tbody.innerHTML = "";
    body = document.getElementsByTagName("body")[0];
    table = document.getElementById("tabela-resultado-pessoa");
    tbody = table.getElementsByTagName("tbody")[0];

    pessoasRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();

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

            infoPesquisaPessoa.innerHTML = "";
            apresentarTabelaPessoa.style.display = "block";

            tbody.innerHTML += `<tr><th> ${pessoa.id} </th> <td> ${pessoa.nome} </td> <td> ${pessoa.perfil} </td>
            <td>
                <button onclick="selecionarPessoa(this)" data-dismiss="modal" class="btn btn-success"><i class="fas fa-check"></i></button>
            </td> 
            </tr>`;
        });
    });
}


function montarTabelaPesquisaPessoaComFiltro(filtro) {

    tbody.innerHTML = "";
    body = document.getElementsByTagName("body")[0];
    table = document.getElementById("tabela-resultado-pessoa");
    tbody = table.getElementsByTagName("tbody")[0];

    pessoasRef.orderByChild("nome").once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();

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

            infoPesquisaPessoa.innerHTML = "";
            apresentarTabelaPessoa.style.display = "block";

            if (pessoa.nome.toUpperCase().indexOf(filtro.toUpperCase()) != -1) {
                tbody.innerHTML += `<tr><th> ${pessoa.id} </th> <td> ${pessoa.nome} </td> <td> ${pessoa.perfil} </td>
            <td>
                <button onclick="selecionarPessoa(this)" data-dismiss="modal" class="btn btn-success"><i class="fas fa-check"></i></button>
            </td> 
            </tr>`;
            }
        });
    })
}

function selecionarPessoa(posicaoPessoaNaTabela) {
    // OBTEM O ID DO AUTOR NA LINHA DA TABELA SELECIONADA
    let i = posicaoPessoaNaTabela.parentNode.parentNode.rowIndex;
    let idPessoa = (document.getElementById("tabela-resultado-pessoa").rows[i].cells[0].innerHTML);
    let nome = (document.getElementById("tabela-resultado-pessoa").rows[i].cells[1].innerHTML);

    document.getElementById("nomePessoa-emprestimo").value = nome.trim();
    apresentarIdPessoa.innerHTML = idPessoa.trim();
    document.getElementById("nomePessoa-emprestimo-modal").value = "";
    limparMensagens();
}

function montarTabelaPesquisaExemplarComFiltro(filtro) {

    tbody.innerHTML = "";
    body = document.getElementsByTagName("body")[0];
    table = document.getElementById("tabela-resultado-exemplar");
    tbody = table.getElementsByTagName("tbody")[0];

    exemplaresRef.orderByChild("id").once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            let childData = childSnapshot.val();

            let exemplar = {
                id: childData.id,
                catalogo: { "id": childData.catalogo.id, "titulo": childData.catalogo.titulo },
                situacao: childData.situacao,
                tombo: childData.tombo,
                consulta: childData.consulta
            }

            apresentarTabelaExemplares.style.display = "block";

            if (filtro != '' && exemplar.catalogo.titulo.toUpperCase().indexOf(filtro.toUpperCase()) != -1) {
                tbody.innerHTML += `<tr><th> ${exemplar.id} </th> <td> ${exemplar.catalogo.titulo} </td> <td> ${exemplar.situacao} </td>
            <td>
                <button onclick="selecionarExemplar(this)" data-dismiss="modal" class="btn btn-success"><i class="fas fa-check"></i></button>
            </td> 
            </tr>`;
            }
        });
    })
}

function selecionarExemplar(posicaoExemplarNaTabela) {

    let i = posicaoExemplarNaTabela.parentNode.parentNode.rowIndex;
    let idExemplar = (document.getElementById("tabela-resultado-exemplar").rows[i].cells[0].innerHTML);
    let titulo = (document.getElementById("tabela-resultado-exemplar").rows[i].cells[1].innerHTML);

    document.getElementById("exemplar-emprestimo").value = titulo.trim();
    apresentarIdExemplar.innerHTML = idExemplar.trim();
    document.getElementById("exemplar-emprestimo-modal").value = "";
    limparMensagens();
}

function atualizarSituacaoExemplar(idExemplar, operacao) {
    let dadoAlterado;

    console.log(idExemplar);
    if (operacao === 'gravar') {
        dadoAlterado = {
            id: idExemplar.replace(/\s/g, ''),
            situacao: 'Emprestado'
        }
    } else {
        dadoAlterado = {
            id: idExemplar.replace(/\s/g, ''),
            situacao: 'Disponivel'
        }
    }

    let path = 'exemplares/' + dadoAlterado.id;

    app_firebase.dataBaseApi.update(path, dadoAlterado, null);
}

function gravar() {

    let newID = firebase.database().ref().child('emprestimos').push().key;

    let emprestimo = {
        id: newID,
        data: document.getElementById("data-emprestimo").value,
        atendente: 'Admin', //document.getElementById("atendente-emprestimo").value,
        situacao: "Ativo",
        biblioteca: document.getElementById("biblioteca-emprestimo").value,
        pessoa: { "id": apresentarIdPessoa.innerHTML, "nome": document.getElementById("nomePessoa-emprestimo").value },
        exemplar: { "id": apresentarIdExemplar.innerHTML, "titulo": document.getElementById("exemplar-emprestimo").value },
        dataPrevisaoDevolucao: calcularDataDevolucao(),
        dataDevolucao: null
    }

    let path = 'emprestimos/' + newID;
    app_firebase.dataBaseApi.create(path, emprestimo, messageHandlerCreate);

    atualizarSituacaoExemplar(emprestimo.exemplar.id, 'gravar');

    apresentarIdPessoa.innerHTML = "";
    document.getElementById("exemplar-emprestimo").value = "";
    document.getElementById("nomePessoa-emprestimo").value = "";
    apresentarIdExemplar.innerHTML = "";

    tableExemplar = document.getElementById("tabela-resultado-exemplar");
    tbodyExemplar = tableExemplar.getElementsByTagName("tbody")[0];
    tbodyExemplar.innerHTML = "";

    tablePessoa = document.getElementById("tabela-resultado-pessoa");
    tbodyPessoa = tablePessoa.getElementsByTagName("tbody")[0];
    tbodyPessoa.innerHTML = "";
}



// CARREGAR PESSOAS QUE CORRESPODEM A PESQUISA 
function buscarPessoasCorrespondentes(nome) {
    let pessoas = consultaPessoaBD();
    let pessoasCorrespondentes = [];

    if (nome === '%%') {
        return pessoas;
    } else {
        for (let i = 0, pessoa; pessoa = pessoas[i]; i++) {
            if (pessoa.nome.toUpperCase().indexOf(nome.toUpperCase()) != -1) {
                pessoasCorrespondentes.push(pessoa);
            }
        }
        return pessoasCorrespondentes;
    }
}


function finalizarEmprestimo(posicao) {
    // OBTEM O ID DO EMPRESTIMO NA LINHA DA TABELA SELECIONADA
    let i = posicao.parentNode.parentNode.rowIndex;
    let idTemp = (document.getElementById("tabela-emprestimos").rows[i].cells[0].innerHTML);

    let dadoAlterado = {
        id: idTemp.replace(/\s/g, ''),
        dataDevolucao: new Date(),
        situacao: 'Devolvido'
    }

    let path = 'emprestimos/' + dadoAlterado.id;
    app_firebase.dataBaseApi.update(path, dadoAlterado, messageHandlerFinalizarEmprestimo);

    //Pegar emprestimo - Necessario para atualizar a situacao do exemplar para disponivel
    let referenciaBd = firebase.database().ref(`emprestimos/ ${idTemp}`.replace(/\s/g, ''));

    let emprestimo;
    referenciaBd.on('value', function(snapshot) {

        if (!!snapshot) {
            emprestimo = {
                id: snapshot.val().id,
                exemplar: snapshot.val().exemplar
            }
            atualizarSituacaoExemplar(emprestimo.exemplar.id, 'finalizar');
        }
    });


    document.getElementById("tabela-emprestimos").deleteRow(i);

}

function calcularDataDevolucao() {
    var hoje = new Date();
    var dataVenc = new Date(hoje.getTime() + (7 * 24 * 60 * 60 * 1000));
    return dataVenc.getFullYear() + "-" + (dataVenc.getMonth() + 1) + "-" + dataVenc.getDate();
}


function pesquisar() {

    let filtroPesquisa = document.getElementById("filtroPesquisa").value;

    tbody.innerHTML = "";
    body = document.getElementsByTagName("body")[0];
    table = body.getElementsByTagName("table")[0];
    tbody = table.getElementsByTagName("tbody")[0];

    if (filtroPesquisa.length != 0) {
        console.log(filtroPesquisa);
        montarTabelaComFiltro(filtroPesquisa);
    } else {
        montarTabelaCompleta();
    }
}

function compararData(dataPrevisaoDevolucao) {
    var date = new Date();
    var hoje = new Date(date.getTime());

    if (hoje > new Date(dataPrevisaoDevolucao)) {
        return true;
    } else {
        return false;
    }
}

function montarTabelaCompleta() {

    emprestimosRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            let childData = childSnapshot.val();

            let emprestimo = {
                id: childData.id,
                data: childData.data,
                atendente: childData.atendente,
                situacao: childData.situacao,
                biblioteca: childData.biblioteca,
                pessoa: childData.pessoa,
                exemplar: childData.exemplar,
                dataPrevisaoDevolucao: childData.dataPrevisaoDevolucao,
                dataDevolucao: childData.dataDevolucao
            }

            infoPesquisaEmprestimo.innerHTML = "";
            apresentarTabelaEmprestimosAtivos.style.display = "block";

            let situacao;
            let dataPrevisaoDevolucao;
            let finalizarEmprestimo;

            if (compararData(emprestimo.dataPrevisaoDevolucao) == true && emprestimo.situacao === 'Ativo') {
                dataPrevisaoDevolucao = `<td class="text-danger"> ${emprestimo.dataPrevisaoDevolucao} </td>`;
            } else {
                dataPrevisaoDevolucao = `<td> ${emprestimo.dataPrevisaoDevolucao} </td>`
            }

            if (emprestimo.situacao === 'Ativo') {
                situacao = `<td class="text-success"> ${emprestimo.situacao} </td>`;
            } else {
                situacao = `<td class="text-primary"> ${emprestimo.situacao} </td>`;
            }

            if (emprestimo.situacao === 'Devolvido') {
                finalizarEmprestimo = `<td><button disabled data-toggle="modal" class="btn btn-danger"><i class="fa fa-undo-alt"></i></button></td>`
            } else {
                finalizarEmprestimo = `<td><button onclick="finalizarEmprestimo(this)" data-toggle="modal" class="btn btn-success"><i class="fa fa-undo-alt"></i></button></td>`
            }

            tbody.innerHTML += `<tr><th> ${emprestimo.id} </th> <td> ${emprestimo.pessoa.nome} </td> <td> ${emprestimo.exemplar.titulo} </td>  
            ${dataPrevisaoDevolucao}
            ${situacao}
            ${finalizarEmprestimo}
            
            </tr>`;
        });
    });
}



function montarTabelaComFiltro(filtro) {
    emprestimosRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            let childData = childSnapshot.val();

            let emprestimo = {
                id: childData.id,
                data: childData.data,
                atendente: childData.atendente,
                situacao: childData.situacao,
                biblioteca: childData.biblioteca,
                pessoa: childData.pessoa,
                exemplar: childData.exemplar,
                dataPrevisaoDevolucao: childData.dataPrevisaoDevolucao,
                dataDevolucao: childData.dataDevolucao
            }

            infoPesquisaEmprestimo.innerHTML = "";
            apresentarTabelaEmprestimosAtivos.style.display = "block";

            if (emprestimo.pessoa.nome.toUpperCase().indexOf(filtro.toUpperCase()) != -1 && filtro != '') {
                let situacao;
                let dataPrevisaoDevolucao;
                let finalizarEmprestimo;

                if (compararData(emprestimo.dataPrevisaoDevolucao) == true && emprestimo.situacao === 'Ativo') {
                    dataPrevisaoDevolucao = `<td class="text-danger"> ${emprestimo.dataPrevisaoDevolucao} </td>`;
                } else {
                    dataPrevisaoDevolucao = `<td> ${emprestimo.dataPrevisaoDevolucao} </td>`
                }

                if (emprestimo.situacao === 'Ativo') {
                    situacao = `<td class="text-success"> ${emprestimo.situacao} </td>`;
                } else {
                    situacao = `<td class="text-primary"> ${emprestimo.situacao} </td>`;
                }

                if (emprestimo.situacao === 'Devolvido') {
                    finalizarEmprestimo = `<td><button disabled data-toggle="modal" class="btn btn-danger"><i class="fa fa-undo-alt"></i></button></td>`
                } else {
                    finalizarEmprestimo = `<td><button onclick="finalizarEmprestimo(this)" data-toggle="modal" class="btn btn-success"><i class="fa fa-undo-alt"></i></button></td>`
                }

                tbody.innerHTML += `<tr><th> ${emprestimo.id} </th> <td> ${emprestimo.pessoa.nome} </td> <td> ${emprestimo.exemplar.titulo} </td>  
            ${dataPrevisaoDevolucao}
            ${situacao}
            ${finalizarEmprestimo}
            
            </tr>`;
            }
        });
    });
}


function teclaEnter(event) {
    let tecla = event.key;
    if (tecla == "Enter") {
        pesquisar();
    }
}