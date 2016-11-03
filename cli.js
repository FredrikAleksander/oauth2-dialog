#!/usr/bin/env node

const { login } = require('./lib/login');
const { settings, parseCommandLine } = require('./settings');
const { connect } = require('./client');
const { listen } = require('./server');

parseCommandLine();

if (settings.listenPort) {
    listen(settings.listenPort);
}
else if (settings.connect) {
    connect(settings)
        .then((accessToken) => {
            console.log(accessToken);
            process.exit(0);
        }, (error) => {
            console.log(error);
            process.exit(1);
        });
} else {
    login(settings.endpoint,
        settings.flow,
        settings.clientId,
        settings.clientSecret,
        settings.scopes,
        settings.redirectUri)
        .then((accessToken) => {
            console.log(accessToken);
            process.exit(0);
        }, (errorReason) => {
            console.log(errorReason);
            process.exit(1);
        });
}