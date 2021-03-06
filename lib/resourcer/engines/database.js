var sys = require('sys')
var path = require('path');

var resourcer = require('resourcer'),
    cradle = require('cradle');

resourcer.Cache = require('resourcer/cache').Cache;

this.Connection = function (host, port, config) {
    this.connection = new(cradle.Connection)({
        host: '127.0.0.1',
        port: port || 5984,
        raw: true,
        cache: false
    }).database(resourcer.env); 
    this.cache = new(resourcer.Cache);
};

this.Connection.prototype = {
    protocol: 'database',
    request: function (method) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.connection[method].apply(this.connection, args);
    },
    get: function () {
        var args = Array.prototype.slice.call(arguments);
        return this.request.apply(this, ['get'].concat(args));
    },
    put: function () {
        var args = Array.prototype.slice.call(arguments);
        return this.request.apply(this, ['put'].concat(args));
    },
    destroy: function () {
    
    },
    view: function (path, opts, callback) {
        return this.request.call(this, 'view', path, opts, function (e, res) {
            if (e) { callback(e) }
            else {
                callback(null, res.rows.map(function (r) { return r.value }));
            }
        });
    }
};
