'use strict';

var auditLogger;
var defaultLogger = require('./lib/defaultLogger');
var loopbackHook = require('./lib/loopbackHook');

module.exports = function (app, config) {

    app = app || defaultLogger;
    var hook;

    // check if the app instance is loopback
    if (app.hasOwnProperty('loopback')) {
        if (!auditLogger) {
            console.log('WARN: Logger not initialized correctly');
            auditLogger = defaultLogger;
        }

        loopbackHook.init(app, config, auditLogger);

        return;
    } else {
        if (!auditLogger) {
            auditLogger = app;
        }

        return auditLogger;
    }
};
