var app_firebase = {};

(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCNc0k-AqTvZp0-lbaxYigICZKIs9JUjP0",
        authDomain: "bibliotecaapp-aaf28.firebaseapp.com",
        databaseURL: "https://bibliotecaapp-aaf28.firebaseio.com",
        projectId: "bibliotecaapp-aaf28",
        storageBucket: "bibliotecaapp-aaf28.appspot.com",
        messagingSenderId: "213799862113"
    };
    firebase.initializeApp(config);

    app_firebase = firebase;

    function fnCreate(path, body, callBack) {
        if (!path || !body) return;
        app_firebase.database().ref(path).set(body, callBack);
    }

    function fnUpdate(path, body, callBack) {
        if (!path || !body) return;
        app_firebase.database().ref(path).update(body, callBack);
    }

    function fnDelete(path, callBack) {
        if (!path) return;
        app_firebase.database().ref(path).remove(callBack);
    }

    function fnRead(path, succesFunction, errorFunction) {
        if (!path || !succesFunction || !errorFunction) return;
        app_firebase.database().ref(path).once('value').then(succesFunction, errorFunction);
    }

    app_firebase.dataBaseApi = {
        create: fnCreate,
        read: fnRead,
        update: fnUpdate,
        delete: fnDelete
    }
})()