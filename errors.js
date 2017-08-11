'use strict';

const status = {
    BadRequest: 400,
    NotFound: 404,
    NotAcceptable: 406,
    UnprocessableEntity: 422,
    InternalServerError: 500,
    GatewayTimeout: 504,
};

const code = {
    RequestError: 1,
    ResponseTimeout: 2,
    JsonError: 3,
    InvalidAction: 4,
    MissingAction: 5,
    ServerError: 6,
};

module.exports = {
    RequestError: {
        status: status.BadRequest,
        error: code.RequestError
    },
    ResponseTimeout: {
        status: status.GatewayTimeout,
        error: code
    },
    JsonError: {
        status: status.UnprocessableEntity,
        error: code.JsonError
    },
    InvalidAction: {
        status: status.NotAcceptable,
        error: code.InvalidAction
    },
    MissingAction: {
        status: status.NotFound,
        error: code.MissingAction
    },
    ServerError: {
        status: status.InternalServerError,
        error: code.ServerError
    },
};
