var settings = {
    endpoint: null,
    flow: 'implicit',
    clientId: null,
    clientSecret: null,
    scopes: [],
    redirectUri: 'oauth2://process',
    listenPort: null,
    connect: null
};

settings.endpoint = process.env.OAUTH2_AUTHORIZE_ENDPOINT || settings.endpoint;
settings.flow = process.env.OAUTH2_FLOW || settings.flow;
settings.clientId = process.env.OAUTH2_CLIENT_ID || settings.clientId;
settings.clientSecret = process.env.OAUTH2_CLIENT_SECRET || settings.clientId;
settings.scopes = process.env.OAUTH2_SCOPES ? process.env.OAUTH2_SCOPES.split(',').map(function mapScopes(_) { return _.trim() }) : settings.scopes;
settings.redirectUri = process.env.OAUTH2_REDIRECT_URI || settings.redirectUri;
settings.connect = process.env.OAUTH2_CONNECT || settings.connect;
settings.listenPort = process.env.OAUTH2_LISTEN || settings.listenPort;

// Validate settings

function parseCommandLine() {
    var args = process.argv.slice(2);
    for (var arg of args) {
    if (arg.indexOf('--endpoint=') === 0) {
        settings.endpoint = arg.substr('--endpoint='.length);
    }
    else if (arg.indexOf('--flow=') === 0) {
        settings.flow = arg.substr('--flow='.length);
    }
    else if (arg.indexOf('--client-id=') === 0) {
        settings.clientId = arg.substr('--client-id='.length);
    }
    else if (arg.indexOf('--client-secret=') === 0) {
        settings.clientSecret = arg.substr('--client-secret='.length);
    }
    else if (arg.indexOf('--redirect-uri=') === 0) {
        settings.redirectUri = arg.substr('--redirect-uri='.length);
    }
    else if (arg.indexOf('--scopes=') === 0) {
        settings.scopes = arg.substr('--scopes='.length).split(',').map(x => x.trim());
    }
    else if (arg.indexOf('--listen=') === 0) {
        settings.listenPort = arg.substr('--listen='.length) >>> 0;
    }
    else if (arg.indexOf('--connect=') === 0) {
        settings.connect = arg.substr('--connect='.length);
    }
}
}

module.exports.settings = settings;
module.exports.parseCommandLine = parseCommandLine;