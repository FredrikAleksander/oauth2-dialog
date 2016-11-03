var Buffer = require('buffer').Buffer;
var http = require('http');
var login = require('./lib/login').login;

function parseLoginRequest(request, response, body) {
    return JSON.parse(body);
}

function processLoginRequest(request, response, settings) {
    login(settings.endpoint,
            settings.flow,
            settings.clientId,
            settings.clientSecret,
            settings.scopes,
            settings.redirectUri)
    .then(function (token) {
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(token));
        response.end();
    },
    function (error) {
        response.statusCode = 500;
        response.setHeader('Content-Type', 'text/plain');
        response.write('Login Failed: ' + error);
        response.end();
    });
}

function processRequest(request, response) {
    if (request.method.toLowerCase() !== 'post') {
        response.statusCode = 405;
        response.setHeader('Content-Type', 'text/plain');
        response.write('Invalid method (' + request.method + ')');
        response.end();
        
        return;
    }
    if (request.url !== '/') {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        response.write('Not Found');
        response.end();
        
        return;
    }
    
    var body = [];
    request.on('data', function (chunk) {
        body.push(chunk);
    })
    .on('end', function () {
        body = Buffer.concat(body).toString();
        var settings = parseLoginRequest(request, response, body);
        processLoginRequest(request, response, settings);
    });
}

function listen(port) {
    var result = http.createServer(processRequest).listen(port);
    console.log('Listening on port ' + port);
    return result;
}

module.exports.listen = listen;