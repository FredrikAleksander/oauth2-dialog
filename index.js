var login = require('./lib/login').login;
var settings = require('./settings').settings;
var parseCommandLine = require('./settings').parseCommandLine;
var listen = require('./server').listen;
var connect = require('./client').connect;


module.exports.login = login;
module.exports.settings = settings;
module.exports.parseCommandLine = parseCommandLine;
module.exports.listen = listen;
module.exports.connect = connect;

