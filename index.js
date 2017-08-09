'use strict'

const http = require('http');
const url = require('url');
const error = require('./errors');

const self = module.exports = {
    handlers: [],

    start: function(port) {
        let server = http.createServer();

        server.setTimeout(10000);

        server.on('request', function(request, response) {
            let body = [];

            request.on('data', function(chunk) {
                body.push(chunk);
            });

            request.on('end', function() {
                body = Buffer.concat(body).toString();
                self.handleRequest(request, response, body);
            });

            request.on('error', function(error) {
                console.log('[REQUEST] [ERR] ' + error);
                self.responseError(response, error.ERR_REQUEST_GENERAL);
            });

            response.on('error', function(error) {
                console.log('[RESPONSE] [ERR] ' + error);
            });

            response.on('timeout', function() {
                console.log('[RESPONSE] [TIMEOUT]');
                self.responseError(response, error.ERR_REQUEST_TIMEOUT);
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

        let out = {};
        let path = url.parse(request.url).pathname.replace(/\/$/g, '');

        try {
            body = JSON.parse(body);
        } catch (e) {
            return self.responseError(response, error.ERR_REQUEST_JSON);
        }

        if (path in self.handlers) {
            out = self.handlers[path](body);

            return self.handleResponse(response, out);
        }

        return self.responseError(response, error.ERR_REQUEST_HANDLER);
    },

    handleResponse: function(response, out) {
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(out));
        response.end();
    },

    responseError: function(response, error) {
        self.handleResponse(response, {
            'error': error
        });
    },

    handle: function(route, handler) {
        self.handlers[route] = handler;
    }
};
