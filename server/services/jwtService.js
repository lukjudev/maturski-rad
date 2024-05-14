const jwt = require('jsonwebtoken');

//Trajanje access & refresh tokena
const accessTokenExp = Math.floor(Date.now() / 1000) + (60*60*24);
const refreshTokenExp = Math.floor(Date.now() / 1000) + (60*60*24*30);

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function refreshToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function signAccessToken(data) {
    data.exp = accessTokenExp;
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
    return token;
}

function signRefreshToken(data) {
    data.exp = refreshTokenExp;
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
    return token;
}

module.exports.authenticateToken = authenticateToken;
module.exports.signAccessToken = signAccessToken;
module.exports.signRefreshToken = signRefreshToken;
module.exports.refreshToken = refreshToken;