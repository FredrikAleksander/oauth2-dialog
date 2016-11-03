var path = require('path');
var electronPath = require('electron');
var appPath = require.resolve('../app/app.js');
var appFolder = path.dirname(appPath);

var proc = require('child_process');

function login(authorizationEndpoint, flow, clientId, clientSecret, scopes, redirectUri) {
    return new Promise(function login(resolve, reject) {
        if (!authorizationEndpoint) {
            throw new Error('Missing OAuth 2 authorization endpoint');
        }
        if (flow !== 'implicit') {
            throw new Error('Only \'implicit\' flow currently supported!');
        }
        if (!clientId) {
            throw new Error('Missing ClientId');
        }
        if (!scopes || scopes.length <= 0) {
            throw new Error('Missing scopes');
        }
        if (!redirectUri) {
            throw new Error('Missing redirect uri');
        }

        var stdoutOutput = '';
        var stderrOutput = '';
        var params = [];
        
        params.push('--endpoint=' + authorizationEndpoint);
        params.push('--flow=' + (flow || 'implicit'));
        params.push('--client-id=' + clientId);
        if (clientSecret) {
            params.push('--client-secret=' + clientSecret);
        }
        if (redirectUri) {
            params.push('--redirect-uri=' + redirectUri);
        }
        if (scopes) {
            params.push('--scopes=' + scopes.join(','));
        }
        
        var child = proc.spawn(electronPath, [appPath, ...params], { encoding: 'utf-8' });
    
    child.stdout.on('data', function receiveAccessTokenData(data) {
        stdoutOutput += data;
    });
    child.stderr.on('data', function receiveAccessTokenErrorData(data) {
        stderrOutput += data;
    });
    child.on('close', function loginWindowClosed(code) {
        if (code === 0) {
            // Succesful, get access token from stdout
            resolve(JSON.parse(stdoutOutput.trim()));
        } else {
            // Failure, get error reason from stderr
            reject(stderrOutput);
        }
    });
});
}

module.exports.login = login;