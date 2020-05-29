const { firebase, admin } = require('../config');

module.exports.failErrors = {
    1: "You must login before doing this operation"
};

module.exports.checkAuth = async (req, res, next) => {
    let token = await exports.isAuthenticatedToken(req.cookies.authToken);
    res.locals.refreshToken = false;
    if (token) {
        res.locals.authed = true;
        if (token !== "-1") res.locals.name = exports.getName(token);
        else res.locals.refreshToken = true;
        return true;
    }
    res.locals.authed = false;
    return false;
}

module.exports.isAuthenticatedToken = async (token) => {
    if (token) {
        try {
            let decodedToken = await admin.auth().verifyIdToken(token, true); // Is it cause no await here?
            if (decodedToken) return decodedToken;
            return false;
        } catch (e) {
            console.log(e);
            if (e.code === 'auth/id-token-expired') return "-1";
            return false;
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

