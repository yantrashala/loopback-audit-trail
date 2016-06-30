'use strict';

exports.init = function(app, config, auditLogger) {

    function log(context) {
        var auditLog = {};
        var method = context.method;

        auditLog.method = context.req.method;
        auditLog.url = context.req.originalUrl;
        auditLog.eventName = method.sharedClass.name;
        auditLog.subEventName = method.name;
        auditLog.arguments = context.args;
        auditLog.result = context.result || {};
        auditLog.error = context.error || {};
        auditLog.status = context.error ? 'failure' : 'success';

        var user = {};
        auditLog.user = user;

        var loopback = app.loopback;
        var loopbackCtx = loopback.getCurrentContext();

        if(loopbackCtx) {

            var accessToken =
                        loopback.getCurrentContext().get('accessToken');
            if(accessToken) {
                user = accessToken.user.toJSON();
            } else {
                user.name = 'ANONYMOUS';
            }
        } else {
            user.name = 'NO LOOPBACK CONTEXT';
        }

        // response status code
        // url
        // http method

        user.ip = context.req.ip;

        process.nextTick(function(){
            auditLogger.info({'log':auditLog});
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
