'use strict';
var LoopBackContext = require('loopback-context');

exports.init = function (app, config, auditLogger) {

    function log(context) {
        var auditLog = {};
        var method = context.method;

        auditLog.method = context.req.method;
        auditLog.url = context.req.originalUrl;
        auditLog.eventName = method.sharedClass.name;
        auditLog.subEventName = method.name;
        auditLog.arguments = {
            params: context.req.params,
            query: context.req.query,
            headers: context.req.headers, 
            args: context.args
        };
        auditLog.result = context.result || {};
        auditLog.error = context.error || {};
        auditLog.status = context.error ? (context.error.statusCode || context.error.status) : (Object.keys(context.result) > 0 ? 200 : 204);

        var user = {};
        auditLog.user = user;

        var loopbackCtx = LoopBackContext.getCurrentContext();

        if (loopbackCtx) {

            var accessToken = loopback.getCurrentContext().get('accessToken');
            if (accessToken) {
                user = accessToken.user().toJSON();
            } else {
                user.name = 'ANONYMOUS';
            }
        } else {
            user.name = 'NO LOOPBACK CONTEXT';
        }

        user.ip = context.req.ip ||
            context.req._remoteAddress ||
            (context.req.connection && context.req.connection.remoteAddress) ||
            undefined;

        process.nextTick(function () {
            auditLogger.info({ 'log': auditLog });
        });
    }

    var models = app.models();
    models.forEach(function (Model) {

        Model.afterRemote('**', function (context, unused, next) {
            log(context);
            next();
        });
        Model.afterRemoteError('**', function (context, next) {
            log(context);
            next();
        });
    });
};
