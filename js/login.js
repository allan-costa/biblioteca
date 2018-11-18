const usuarioTxt = document.getElementById('usuario');
const senhaTxt = document.getElementById('senha');
const btnLogin = document.getElementById('btnLogin');
const infoLogin = document.getElementById('infoLogin');

console.log(window.location.pathname.indexOf("login") != -1);

if (sessionStorage.getItem("usuario") == null && window.location.pathname.indexOf("login") == -1) {
    window.location.replace("login.html");
}

if (sessionStorage.getItem("usuario")) {
    const usuarioLogado = document.getElementById('usuarioLogado');
    usuarioLogado.innerHTML = 'Bem vindo ' + sessionStorage.getItem("usuario");
}


function logOut() {
    sessionStorage.clear();
    window.location.replace("login.html");
}


function autenticarUsuario() {

    const pessoasRef = firebase.database().ref("pessoas/");
    const usuario = usuarioTxt.value;
    const senha = senhaTxt.value;

    pessoasRef.orderByChild("usuario").equalTo(usuario).on("child_added", function(data) {
        if (data.val().usuario === usuario && data.val().senha === senha) {
            sessionStorage.setItem("usuario", usuario);
            sessionStorage.setItem("senha", senha);
            window.location.replace("index2.html");
        } else {
            infoLogin.innerHTML = 'Senha incorreta!!';
        }
    });


}