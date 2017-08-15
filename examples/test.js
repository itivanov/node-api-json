'use strict';

const api = require('../index');

const config = {
    port: 8000,
    timeout: 10000
};

api.start(config);

api.handle('ping', ping);

function ping(data) {
    var out = {
        response: api.status.OK,
        data: 'pong'
    };

    return out;
}
