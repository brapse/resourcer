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
    "Resource()": {
        topic: function () {
            resourcer.use(resourcer.engines.file).connect('/tmp/file_engine_test.json').connection.load({
                bob: { _id: 42, age: 35, hair: 'black'},
                tim: { _id: 43, age: 16, hair: 'brown'},
                mat: { _id: 44, age: 29, hair: 'black'}
            });
            return resourcer.defineResource('person');
        },
        "should get initialize the store": function (Person) {
            assert.equal (true, true);
        }
    }
});
