const { firebase } = require('../config');

module.exports.failErrors = {
    1: "Password is not correct", // 'auth/wrong-password'
    2: "User does not exist in the system", // 'auth/user-not-found'
    3: "Unknown Error Occurred"
};

module.exports.convertAuthCodeToError = (authCode) => {
    console.log(authCode);
    switch (authCode) {
        case 'auth/user-not-found': return 2;
        case 'auth/wrong-password': return 1;
        default: return 3;
    }
}

module.exports.login = async (email, password) => {
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        let idToken = await firebase.auth().currentUser.getIdToken(true)
        return {success: true, message: idToken};
    } catch (err) {
        console.log(err);
        return {success: false, message: err.code};
    }
}

module.exports.logout = async () => {
    try {
        await firebase.auth().signOut();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports.isAuthenticatedToken = () => {
    let user = firebase.auth().currentUser;
    if (user) {
        user.getIdToken(false).then((idToken) => {
            return idToken;
        }).catch((err) => {
            console.log(err);
            return null;
        });
    } else {
        return null;
    }
}

module.exports.isAuthenticated = () => {
    let user = firebase.auth().currentUser;
    console.log(user);
    return !!user;
}

module.exports.getName = () => {
    let user = firebase.auth().currentUser;
    if (user) {
        if (user.displayName) return user.displayName
        return user.email;
    } else {
        return null;
    }
}

