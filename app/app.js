var electron = require('electron');
var app = electron.app, BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win;

var args = process.argv.slice(2);
var options = {
    endpoint: null,
    flow: 'implicit',
    clientId: null,
    clientSecret: null,
    scopes: [],
    redirectUri: 'oauth2://process'
};
var result = {
    error: 'An unknown error occured'
};

options.endpoint = process.env.OAUTH2_AUTHORIZE_ENDPOINT || options.endpoint;
options.flow = process.env.OAUTH2_FLOW || options.flow;
options.clientId = process.env.OAUTH2_CLIENT_ID || options.clientId;
options.clientSecret = process.env.OAUTH2_CLIENT_SECRET || options.clientId;
options.scopes = process.env.OAUTH2_SCOPES ? process.env.OAUTH2_SCOPES.split(',').map(_ => _.trim()) : options.scopes;
options.redirectUri = process.env.OAUTH2_REDIRECT_URI || options.redirectUri;

for (var arg of args) {
    if (arg.indexOf('--endpoint=') === 0) {
        options.endpoint = arg.substr('--endpoint='.length);
    }
    else if (arg.indexOf('--flow=') === 0) {
        options.flow = arg.substr('--flow='.length);
    }
    else if (arg.indexOf('--client-id=') === 0) {
        options.clientId = arg.substr('--client-id='.length);
    }
    else if (arg.indexOf('--client-secret=') === 0) {
        options.clientSecret = arg.substr('--client-secret='.length);
    }
    else if (arg.indexOf('--redirect-uri=') === 0) {
        options.redirectUri = arg.substr('--redirect-uri='.length);
    }
    else if (arg.indexOf('--scopes=') === 0) {
        options.scopes = arg.substr('--scopes='.length).split(',').map(x => x.trim());
    }
}

function validateArguments() {
    if (!options.endpoint) {
        process.stderr.write('invalid input options');
        process.exitCode = 9;
        app.quit();
        return false;
    }
    return true;
}

function createWindow() {
    var url = options.endpoint + '?redirect_uri=' + encodeURIComponent(options.redirectUri) + '&grant_type=' + options.flow + '&client_id=' + options.clientId;
    if (options.clientSecret) {
        url += '&client_secret=' + options.clientSecret;
    }
    url += '&scope=' + options.scopes.join(',');
    url += '&response_type=token';

    win = new BrowserWindow({
        width: 400, height: 600, webPreferences: {
            nodeIntegration: false
        }
    });
    win.loadURL(url);
    //win.webContents.openDevTools();
    win.on('closed', function closed() {
        win = null;
    });
}

app.on('ready', function onReady() {
    electron.protocol.registerStringProtocol('oauth2', function processOAuth2Request(request, callback) {
        var fragmentIndex = request.url.indexOf('#');
        if (fragmentIndex >= 0) {
            var fragment = request.url.substr(fragmentIndex + 1);
            var tokens = fragment.split('&');
            for (var token of tokens) {
                var data = token.split('=');
                result[data[0]] = data.length > 1 ? data[1] : '';
            }
        }
        
        if (result.access_token) {
            result.error = null;
            process.stdout.write(JSON.stringify(result));
            app.quit();
            return;
        } else {
            if (result.error) {
                process.stderr.write(result.error);
            }
        }
        process.exit(1);
    });
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function windowAllClosed() {
    if (result.access_token) {
        app.quit();
    } else {
        process.exit(1);
    }
    
});

app.on('activate', function activate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    };
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.