var http = require('http');

function connect(settings) {
    return new Promise((resolve, reject) => {
        var portIndex = settings.connect.indexOf(':');
        var port = 13666;
        var hostname = settings.connect;
        if (portIndex >= 0) {
            port = hostname.substr(portIndex + 1);
            hostname = hostname.substr(0, portIndex);
        }

        var responseData = '';

        var request = http.request({
            hostname: hostname,
            host: settings.connect,
            port: port,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, (response) => {
            response.setEncoding('utf-8');
            response.on('data', (chunk) => {
                responseData += chunk;
            });
            response.on('end', () => {
                if (response.statusCode !== 200) {
                    reject(responseData);
                } else {
                    var res = {};
                    try {
                        res = JSON.parse(responseData);
                    } catch (e) {
                        return reject(e);
                    }

                    return resolve(res);
                }
            });
        });

        request.on('error', (error) => {
            reject(error);
        });
        request.write(JSON.stringify({
            endpoint: settings.endpoint,
            flow: settings.flow,
            clientId: settings.clientId,
            clientSecret: settings.clientSecret,
            scopes: settings.scopes,
            redirectUri: settings.redirectUri
        }));
        request.end();
    });
}

module.exports.connect = connect;