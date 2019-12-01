var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://collectionsapp.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://collectionsapp.herokuapp.com',
    issuer: 'https://collectionsapp.auth0.com/',
    algorithms: ['RS256']
});

module.exports = {
    jwtCheck
};