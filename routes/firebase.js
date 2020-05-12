// These contain unique, non-secret keys and can be committed
const firebaseConfig = {
    apiKey: "AIzaSyCkKkEWlAdfVfBoqHaK7lYqmmG9wdzbvmQ",
    authDomain: "ccn-webapps.firebaseapp.com",
    databaseURL: "https://ccn-webapps.firebaseio.com",
    projectId: "ccn-webapps",
    storageBucket: "ccn-webapps.appspot.com",
    messagingSenderId: "985951588863",
    appId: "1:985951588863:web:ffc796cdd26ec65cb657ca",
    measurementId: "G-WE3YTSB1MJ"
};

const firebase = require('firebase');
const firebaseui = require('firebaseui');

let ui = new firebaseui.auth.AuthUI(firebase.auth);

module.exports.signin = function() {
    let uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult(authResult, redirectUrl) {
                // Successful sign in
                return true;
            },
            uiShown() {
                // Widget rendered, hide loader
                document.getElementById('loader').style.display = 'none';
            }
        },
        signInFlow: 'popup',
        signInSuccessUrl: 'redirecturl',
        signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
        tosUrl: '',
        privacyPolicyUrl: ''
    };
    ui.start('#firebaseui-auth-container', uiConfig);
}