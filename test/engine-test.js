var path = require('path'),
    sys = require('sys'),
    assert = require('assert'),
    events = require('events'),
    http = require('http'),
    fs = require('fs');

require.paths.unshift(path.join(__dirname, '..', 'lib'));

var vows = require('vows');

var resourcer = require('resourcer');

vows.describe('resourcer/engine').addVows({
    "Factory": {
        topic: function () {
            resourcer.use(resourcer.engines.memory).connect();

            new(resourcer.engines.memory.Connection)('Person').load({
                1: { _id: 1, name: 'Peter', age: 30}
            });
            return resourcer.defineResource('Person');
        },
        "should initialize the store": function (Person) {
           assert.instanceOf (resourcer.connection, resourcer.engines.file.Connection);
        },
        "should be resource": function (Person) {
            assert.equal (Person.resource, 'Person');
        },
        "Create": {
            topic: function (Person) {
                Person.create({_id: 2, name: "Lori", age: 10 }, this.callback);
            },
            "Should provide a valid event": function (err, ev) {
                assert.isNull(err);
                assert.equal(201, ev.status);
            }
        },
        "Find": {
            topic: function (Person) {
                Person.find({name: "Peter"}, this.callback);
            },
            "Should extract Peter": function(err, results){
                assert.isNull(err);
                assert.instanceOf(results, Array);
                assert.length(results, 1);
            }
        }
    }
}).export(module);
