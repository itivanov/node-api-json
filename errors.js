'use strict';

const status = {
    BadRequest: 400,
    InternalServerError: 500
};

const code = {

};

module.exports = {
    OperationTimedOut: {
        status: status.InternalServerError,
        error: code
    },
    ParseError: {
        status: status.BadRequest,
        error: code
    }
};

/*
 ERR_SERVER_CLIENT: 1,
 ERR_REQUEST_GENERAL: 2,
 - ERR_REQUEST_JSON: 3,
 - ERR_REQUEST_TIMEOUT: 4,
 ERR_REQUEST_INVALID_ACTION: 5,
 ERR_REQUEST_MISSING_ACTION: 6
 */