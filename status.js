'use strict';

const status = {
    OK: 200,
    BadRequest: 400,
    NotFound: 404,
    NotAcceptable: 406,
    UnprocessableEntity: 422,
    InternalServerError: 500,
    GatewayTimeout: 504
};

const error = {
    RequestError: 1,
    ResponseTimeout: 2,
    JsonError: 3,
    InvalidAction: 4,
    MissingAction: 5,
    ServerError: 6
};

module.exports = {
    OK: {
        status: status.OK
    },
    RequestError: {
        status: status.BadRequest,
        error: error.RequestError
    },
    ResponseTimeout: {
        status: status.GatewayTimeout,
        error: error.ResponseTimeout
    },
    JsonError: {
        status: status.UnprocessableEntity,
        error: error.JsonError
    },
    InvalidAction: {
        status: status.NotAcceptable,
        error: error.InvalidAction
    },
    MissingAction: {
        status: status.NotFound,
        error: error.MissingAction
    },
    ServerError: {
        status: status.InternalServerError,
        error: error.ServerError
    }
};
