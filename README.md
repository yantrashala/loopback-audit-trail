# loopback-audit-trail
A component to add audit trail capability to loopback projects

This logger works by attaching afterRemote and afterRemoteError methods on an API; this means it would work if API is called as http resource and not as method call. Following are logged as audit log. 

- HTTP method
- HTTP URL
- Model name
- Model method name
- Arguments as JSON object
  - Request params
  - Request query
  - Request headers
  - Method arguments
- Method result - This is the return object as specified in `returns` parameter of method declaration.
- Method error - In case of errors, it captures the error object as populated by loopback.
- User as JSON object
  - If user is associated with the current loopback access token then entire object is captured
  - If context is present but user is not present then `user.name` is set to `ANONYMOUS`
  - If context is not present `user.name` is set to `NO LOOPBACK CONTEXT`. This may occur in cases where loopback context gets null. Refer to loopback issue [#657](https://github.com/strongloop/loopback-datasource-juggler/issues/657).
- User IP address - It is captued in the user object as `user.ip`

## Sample usage
In your server.js, before calling [boot](https://apidocs.strongloop.com/loopback-boot/#boot) initialize a [bunyan](https://github.com/trentm/node-bunyan) logger instance like

```
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "myapp"});
```

Pass the instance of bunyan to [loopback-audit-trail](https://github.com/yantrashala/loopback-audit-trail) as
```
require('loopback-audit-trail')(log);
```

Add the following to initialize the component in your component-config.json.
```
"loopback-audit-trail": {}
```

**P.S.** You should add the code to initialize logger component with bunyan logger before calling boot method of loopback.
