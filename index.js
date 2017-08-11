'use strict'

const http = require('http');
const url = require('url');
const error = require('./errors');

const self = module.exports = {
    handlers: [],

    start: function(port) {
        var server = http.createServer();

        server.setTimeout(10000);

        server.on('request', function(request, response) {
            var body = [];

            request.on('data', function(chunk) {
                body.push(chunk);
            });

            request.on('end', function() {
                body = Buffer.concat(body).toString();
                self.handleRequest(request, response, body);
            });

            request.on('error', function(error) {
                console.log('[REQUEST] [ERR] ' + error);
                self.responseError(response, error.RequestError);
            });

            response.on('error', function(error) {
                console.log('[RESPONSE] [ERR] ' + error);
            });

            response.on('timeout', function() {
                console.log('[RESPONSE] [TIMEOUT]');
                self.responseError(response, error.ResponseTimeout);
            });
        });

        server.on('listening', function() {
            console.log('[SERVER] [READY]');
        });

        server.on('error', function(error) {
            console.log('[SERVER] [ERR] ' + error);

            if (error.code === 'EADDRINUSE') {
                server.close();
            } else {
                setTimeout(function() {
                    process.exit(1);
                }, 1000);
            }
        });

        server.on('close', function() {
            console.log('[SERVER] [CLOSE]');

            setTimeout(function() {
                server.listen(port);
            }, 1000);
        });

        server.listen(port);
    },

    handleRequest: function(request, response, body) {
        console.log('[REQUEST] [DATA] ' + body);

        try {
            body = JSON.parse(body);
        } catch (e) {
            return self.responseError(response, error.JsonError);
        }

        if (!body.hasOwnProperty('method')) {
            return self.responseError(response, error.InvalidAction);
        }

        if (!(body.method in self.handlers)) {
            return self.responseError(response, error.MissingAction);
        }

        var data = {};

        if (body.hasOwnProperty('data')) {
            data = body.data;
        }

        try {
            var out = self.handlers[body.method](data);

            return self.handleResponse(response, out);
        } catch (e) {
            return self.responseError(response, error.ServerError);
        }
    },

    handleResponse: function(response, out) {
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(out));
        response.end();
    },

    responseError: function(response, error) {
        self.handleResponse(response, {
            'response': error
        });
    },

    handle: function(route, handler) {
        self.handlers[route] = handler;
    }
};
