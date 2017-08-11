# Node.js JSON API Server

## Usage

``` js
const api = require('node-json-api-server');

api.start(8000);

api.handle('ping', ping);

function ping(data) {
    var out = {
        response: api.status.OK,
        data: 'pong'
    };

    return out;
}
```

```
curl -X POST -d '{"method":"ping"}' http://localhost:8000/

{"response":{"status":200},"data":"pong"}
```
