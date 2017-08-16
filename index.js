'use strict';

const http = require('http');

const self = module.exports = {
    status: require('./status'),
    handlers: [],

    start: function(options) {
        if (!options.hasOwnProperty('port')) {
            console.log(self.stamp() + ' [SERVER] [ERR] Server port is not defined');
            return self.shutdown();
        }

        var server = http.createServer();

        if (options.hasOwnProperty('timeout')) {
            server.setTimeout(options.timeout);
        }

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
                console.log(self.stamp() + ' [REQUEST] [ERR] ' + error);
                self.responseError(response, self.status.RequestError);
            });

            response.on('error', function(error) {
                console.log(self.stamp() + ' [RESPONSE] [ERR] ' + error);
            });

            response.on('timeout', function() {
                console.log(self.stamp() + ' [RESPONSE] [TIMEOUT]');
                self.responseError(response, self.status.ResponseTimeout);
            });
        });

        server.on('listening', function() {
            console.log(self.stamp() + ' [SERVER] [READY] port: ' + options.port);
        });

        server.on('error', function(error) {
            console.log(self.stamp() + ' [SERVER] [ERR] ' + error);

            if (error.code === 'EADDRINUSE') {
                server.close();
            } else {
                return self.shutdown();
            }
        });

        server.on('close', function() {
            console.log(self.stamp() + ' [SERVER] [CLOSE] restarting...');

            setTimeout(function() {
                server.listen(options.port);
            }, 1000);
        });

        server.listen(options.port);
    },

    handleRequest: function(request, response, body) {
        console.log(self.stamp() + ' [REQUEST] [OK] ' + body);

        try {
            body = JSON.parse(body);
        } catch (e) {
            return self.responseError(response, self.status.JsonError);
        }

        if (!body.hasOwnProperty('method') || body.method.trim() === '') {
            return self.responseError(response, self.status.InvalidAction);
        }

        if (!body.hasOwnProperty('secret') || body.secret.trim() === '') {
            return self.responseError(response, self.status.InvalidSecret);
        }

        if (!self.checkSecret(body.secret)) {
            return self.responseError(response, self.status.Forbidden);
        }

        if (!(body.method in self.handlers)) {
            return self.responseError(response, self.status.MissingAction);
        }

        var data = {};

        if (body.hasOwnProperty('data')) {
            data = body.data;
        }

        try {
            var out = self.handlers[body.method](data);

            return self.handleResponse(response, out);
        } catch (e) {
            return self.responseError(response, self.status.ServerError);
        }
    },

    handleResponse: function(response, out) {
        console.log(self.stamp() + ' [RESPONSE] [OK] ' + JSON.stringify(out));

        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(out));
        response.end();
    },

    responseError: function(response, error) {
        console.log(self.stamp() + ' [RESPONSE] [ERROR] ' + JSON.stringify(error));

        self.handleResponse(response, {
            'response': error
        });
    },

    handle: function(route, handler) {
        self.handlers[route] = handler;
    },

    checkSecret: function(secret) {
        // TODO: check secret in database
        return true;
    },

    shutdown: function() {
        setTimeout(function() {
            process.exit(1);
        }, 1000);
    },

    stamp: function() {
        return new Date().toISOString();
    }
};
