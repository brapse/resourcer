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
    this.cache = new(resourcer.Cache);

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
        // Load all instances from file into memory
        var that = this;
        that.store = [];

        fs.readFile(this.storeFile, function(err, data){
            if(err) throw err;
            var lines = data.split("\n");

            //iterate in reverse, loading the items in reverse
            for(var i = lines.length; i >= 0; i--){
                var item = JSON.parse(line);
                if(!that.store[item['_id']]){
                    that.store[item['_id']] = item;
                }
            }
        });
    },
    persist: function(){
        // Put all instance in memory to file
        var that = this;
        var contents = Object.keys(this.store).map(function(k){
                return JSON.stringify(that.store[k]);
        }).join("\n") + "\n";

        fs.writeFile(this.storeFile, contents, function (err) {
            if (err) throw err;
        });
    },
    save: function (key, val, callback) {
        this.store[key] = val;
        this.persist();
        callback(null, { status: 201 });
    },
    put: function () {
        this.save.apply(this, arguments);
    },
    create: function () {
        this.save.apply(this, arguments);
    },
    destroy: function(id) { },
    get: function(key, callback) {
        this.sync();
        if(this.store[key]){
            callback(null, this.store[key]);
        }else{
            callback({status: 404})
        }
    },
    find: function (conditions, callback) {
        this.filter(function (obj) {
            return Object.keys(conditions).every(function (k) {
                return conditions[k] ===  obj[k];
            });
        }, callback);
    },
    filter: function (filter, callback) {
        var store = this.store, result = [];
        this.sync();
        Object.keys(store).forEach(function (k) {
            if (filter(store[k])) {
                result.push(store[k]);
            }
        });
        callback(null, result);
    }
};
