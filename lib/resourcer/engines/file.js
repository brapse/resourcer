var resourcer = require('resourcer'),
    fs = require('fs'),
    sys = require('sys');

resourcer.Cache = require('resourcer/cache').Cache;
//
// File Json store
//
this.stores = {};
this.caches = {};
this.Connection = function (uri, options) {
    this.storeFile = uri || "/tmp/test_store.json";

    // Application-wide store
    this.store = exports.stores[uri] = {};
    var that = this;

    try {
        var stat = fs.statSync(this.storeFile).mode;
    }catch(e) {
        var stat = 0666;
    }
    this.fd = fs.openSync(this.storeFile, 'a+', stat.mode);
};

this.Connection.prototype = {
    protocol: 'file',

    load: function (data) {
        // load data in the data store
        this.store = data;
        this.persist();

        return this;
    },
    sync: function(){
        var that = this;
        fs.readFile(this.fd, function(err, data){
            if(err) throw err;
            var lines = data.split("\n");

            //iterate in reverse, loading the items in reverse
            for(var i = lines.length; i >= 0; i--){
                var item = JSON.parse(line);
                if(!this.store[item['_id']]){
                    this.store[item['_id']] = item;
                }
            }
        });
    },
    from_bottom: function(action){
        for(var i = Object.keys(this.store).length -1; i >= 0; i--){
            action(JSON.parse(line));
        }
    },
    persist: function(){
        var that = this;
        var contents = Object.keys(this.store).map(function(k){
                return JSON.stringify(that.store[k]);
        }).join("\n");

        fs.writeFile(this.storeFile, contents, function (err) {
            if (err) throw err;
        });
    },
    save: function(key, val, callback) {
        this.store[hey] = val;
        this.persist();
        callback(null, { status: 201 });
    },
    destroy: function(id) { },
    get: function(key, callback) {
        sync();
        if(this.store[key]){
            callback(null, this.store[key]);
        }else{
            callback({status: 404})
        }
    },
    find: function(conditions, callback){
        var store = this.store;
        this.filter(function (obj) {
            return Object.keys(conditions).every(function (k) {
                return conditions[k] ===  obj[k];
            });
        }, callback);
    },

    filter: function (filter, callback) {
        var matches = {}, store = this.store, result = {};
        this.from_bottom(function(item) {
            if (filter(item) && !result[item['_id']]) {
                result[item['_id']] = item;
            }
        });
        callback(null, result);
    }
};
