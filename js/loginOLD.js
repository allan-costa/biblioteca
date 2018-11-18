//Pegar elementos
const txtEmail = document.getElementById('txtEmail');
const txtSenha = document.getElementById('txtSenha');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');

// Add Login Event
btnLogin.addEventListener('click', e => {
    //Get email and pass
    const email = txtEmail.value;
    const senha = txtSenha.value;
    const auth = firebase.auth();

    // Sign in
    const promisse = auth.signInWithEmailAndPassword(email, senha);
    promisse.catch(e => console.log(e.message));
});

btnSignUp.addEventListener('click', e => {
    //Get email and pass
    const email = txtEmail.value;
    const senha = txtSenha.value;
    const auth = firebase.auth();

    // Sign in
    const promisse = auth.createUserWithEmailAndPassword(email, senha);
    promisse
        .catch(e => console.log(e.message));
});

btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
});

// Add a realtime listener to auth
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser)
        btnLogout.classList.remove('d-none');
    } else {
        console.log("Usuario não logado")
        btnLogout.classList.add('d-none');
    }
});