// Controlar mensagens pesquisa titulo
var CAMPO_VAZIO = 1;
var CAMPO_INSUFICIENTE = 2;
var CAMPO_VALIDO = 3;

// Tabela com resultados da pesquisa
let apresentarTabela = document.getElementById("resultado-pesquisa");

//Informar mensagem da pesquisa
let resultInfo = document.getElementById("result-info");

const exemplaresRef = firebase.database().ref('exemplares/');

apresentarTabela.style.display = "none";

function teclaEnter(event) {
    let tecla = event.key;
    if (tecla == "Enter") {
        pesquisarLivros();
    }
}

// Alterar mensagem para situacaoes diferentes entre si
function alterarMensagemPesquisa(tipo) {
    apresentarTabela.style.display = "none";
    resultInfo.classList.remove("text-primary");
    resultInfo.classList.add("text-danger");

    if (tipo == CAMPO_VAZIO) {
        resultInfo.innerHTML = "Informe o titulo que deseja buscar!";
    } else if (tipo == CAMPO_INSUFICIENTE) {
        resultInfo.innerHTML = "Sua busca deve ter pelo menos 3 caracteres!";
    } else {
        resultInfo.classList.remove("text-danger");
        resultInfo.classList.add("text-primary");
    }

}

function pesquisarLivros() {

    // Pegar o valor da pesquisa com o id="searchInput"
    let termosPesquisa = document.getElementById("searchInput").value;

    // Verifica se o campo de pesquisa esta vazio
    if (termosPesquisa === '') {
        alterarMensagemPesquisa(CAMPO_VAZIO);

    } else if (termosPesquisa.length < 3) {
        alterarMensagemPesquisa(CAMPO_INSUFICIENTE);

    } else {
        alterarMensagemPesquisa(CAMPO_VALIDO);
        tbody.innerHTML = "";

        montarTabelaPesquisaExemplarComFiltro(termosPesquisa);

    }
}

function montarTabelaPesquisaExemplarComFiltro(filtro) {

    let totalExemplaresPesquisa = 0;

    tbody.innerHTML = "";
    body = document.getElementsByTagName("body")[0];
    table = body.getElementsByTagName("table")[0];
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

            if (filtro != '' && exemplar.catalogo.titulo.toUpperCase().indexOf(filtro.toUpperCase()) != -1) {
                totalExemplaresPesquisa++;

                tbody.innerHTML += `<tr><th> ${totalExemplaresPesquisa} </th> <td> ${exemplar.catalogo.titulo} </td> <td> ${exemplar.autor} </td> <td> ${exemplar.situacao} </td>
            <td>
               <button onclick="selecionarExemplar(this)" data-dismiss="modal" class="btn btn-success"><i class="fas fa-check"></i></button>
            </td> 
             </tr>`;
            }
        });

        if (totalExemplaresPesquisa != 0) {
            apresentarTabela.style.display = "block";
        }
        resultInfo.innerHTML = "Sua pesquisa retornou " + totalExemplaresPesquisa + " resultado(s)!";
    })
}