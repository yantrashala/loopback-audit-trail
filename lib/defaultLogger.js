'use strict';

var bunyan = require('bunyan');
var defaultLogger;
defaultLogger = bunyan.createLogger(
    {
        name: 'defaultLogger',
        serializers: bunyan.stdSerializers
    }
);
defaultLogger.level('info');
module.exports = defaultLogger;
