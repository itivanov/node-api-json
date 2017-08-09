'use strict'

const api = require('../index');

api.start(8000);

api.handle('/ping', ping);

function ping(data) {
    return 'pong';
}
