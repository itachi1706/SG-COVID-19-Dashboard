const { firebase, admin } = require('../config');

module.exports.failErrors = {
    1: "You must login before doing this operation"
};

module.exports.isAuthenticatedToken = async (token) => {
    if (token) {
        try {
            let decodedToken = admin.auth().verifyIdToken(token, true);
            if (decodedToken) return decodedToken;
            return null;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    return false;
}

module.exports.getName = (user) => {
    if (user) {
        if (user.displayName) return user.displayName
        return user.email;
    } else {
        return null;
    }
}

