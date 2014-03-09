/**
 * Unit tests for the application Config module.
 */

var config = require('../app/config.js');

module.exports = {
    /*
     * Testing getter/setter(s)
     */
    test_controllerMode: function(test) {
        config.controllerMode = "blah";
        test.equal(config.controllerMode, "manual");
        test.done();
    },

    test_sunriseTime: function(test) {
        config.sunriseTime = new Date(2013, 4, 9, 9, 55);
        test.equal(config.sunriseTime, 35700);
        test.done();
    },

    test_sunriseTime_num: function(test) {
        config.sunriseTime = 99000;
        test.equal(config.sunriseTime, 25200);
        test.done();
    },

    test_sunsetTime: function(test) {
        config.sunsetTime = new Date(2013, 9, 25, 19, 56);
        test.equal(config.sunsetTime, 71760);
        test.done();
    },

    test_sunsetTime_num: function(test) {
        config.sunsetTime = 99000;
        test.equal(config.sunsetTime, 64800);
        test.done();
    },

    test_rampTime: function(test) {
        config.rampTime = 9000;
        test.equal(config.rampTime, 45);
        test.done();
    },

    test_cloudFrequency: function(test) {
        config.cloudFrequency = 20;
        test.equal(config.cloudFrequency, 0);
        test.done();
    },

    test_lightningFrequency: function(test) {
        config.lightningFrequency = 20;
        test.equal(config.lightningFrequency, 0);
        test.done();
    },

    test_simulateMoon: function(test) {
        config.simulateMoon = 3;
        test.equal(config.simulateMoon, 0);
        test.done();
    },

    test_latitude: function(test) {
        config.latitude = 170;
        test.equal(config.latitude, 0);
        test.done();
    },

    test_longitude: function(test) {
        config.longitude = 400;
        test.equal(config.longitude, 0);
        test.done();
    },

    test_fanControl: function(test) {
        config.fanControl = 5;
        test.equal(config.fanControl, 0);
        test.done();
    },

    test_pwmSettings: function(test) {
        test.equal(config.pwmSettings[3][0], "P9_22");
        test.done();
    },

    test_saveConfig: function(test) {
        var fs = require('fs');
        config.latitude = 32.22;
        config.save();

        // Assert that the latitude was written out as 32.22
        fs.readFile('./config.json', function (err, data) {
            test.ok(!err);
            test.ok(data.latitude == 32.22);
        });

        test.done();
    }
};
