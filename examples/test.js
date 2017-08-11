'use strict'

const api = require('../index');

api.start(8000);

api.handle('ping', ping);

function ping(data) {
    var out = {
        response: api.status.OK,
        data: 'pong'
    };

    return out;
}
