/*******************************************************************************
 * AquaBeagle
 * Name: lightControllerTest.js
 * Copyright (c) 2014. Brian Harris
 ******************************************************************************/

/*******************************************************************************
 * AquaBeagle
 * Name: lightControllerTest.js
 * Copyright (c) 2014. Brian Harris
 * Nodeunit tests for lightController module.
 ******************************************************************************/

var config = require('aquaConfig')();
var ctrl = require('lightController');

exports.manualMode = {
    setUp: function(callback) {
        // Configure some lights
        config.controllerMode = "manual";
        config.pwmSettings[0][0] = 4095;
        config.pwmSettings[0][1] = 4095;
        config.pwmSettings[1][2] = 287;
        config.rampTime = 60;

        callback();
    },

    testDaytime: function(test) {
        console.warn('Starting testDaytime()');
        var counter = 0,
            now = new Date(Date.UTC(2014, 2, 16, 19)); // Make the time 12 noon today

        // Start the lighting process
        ctrl.start({
            offset: now
        }, function(err, status) {
            if (err) console.error(err);

            console.log(status)
            if (status.status === "Day" && status.intensity[0] === 4095 && status.intensity[1] === 4095 && status.intensity[2] === 0) {
                counter++;
            }
        });

        // Run the process for 5 seconds
        setTimeout(function() {
            ctrl.stop();
            test.equal(counter, 5);
            test.done();
        }, 5*1000);
    },

    testNighttime: function(test) {
        console.warn('Starting testNighttime()');
        var counter = 0,
            now = new Date(Date.UTC(2014, 2, 17, 6)); // Make the time 11PM today

        // Start the lighting process
        ctrl.start({
            offset: now
        }, function(err, status) {
            if (err) console.error(err);

            console.log(status);
            if (status.status === "Night" && status.intensity[0] === 0 && status.intensity[1] === 0 && status.intensity[2] === 287) {
                counter++;
            }
        });

        // Run the process for 5 seconds
        setTimeout(function() {
            ctrl.stop();
            test.equal(counter, 5);
            test.done();
        }, 5*1000);
    },

    testSunrise: function(test) {
        console.warn('Starting testSunrise()');
        var counter = 0,
            now = new Date(Date.UTC(2014, 2, 16, 14, 30)); // Make the time 7:30 AM today

        // Start the lighting process
        ctrl.start({
            offset: now
        }, function(err, status) {
            if (err) console.error(err);

            console.log(status);
            if (status.status === "Sunrise" && status.intensity[0] > 0 && status.intensity[0] < 4095) {
                counter++;
            }
        });

        // Run the process for 5 seconds
        setTimeout(function() {
            ctrl.stop();
            test.equal(counter, 5);
            test.done();
        }, 5*1000);
    },

    testSunset: function(test) {
        console.warn('Starting testSunset()');
        var counter = 0,
            now = new Date(Date.UTC(2014, 2, 17, 0, 30)); // Make the time 5:30 PM today

        // Start the lighting process
        ctrl.start({
            offset: now
        }, function(err, status) {
            if (err) console.error(err);

            console.log(status);
            if (status.status === "Sunset" && status.intensity[0] < 4095 && status.intensity[0] > 0) {
                counter++;
            }
        });

        // Run the process for 5 seconds
        setTimeout(function() {
            ctrl.stop();
            test.equal(counter, 5);
            test.done();
        }, 5*1000);
    }
};

exports.autoMode = {
    setUp: function(callback) {
        // Configure some lights
        config.controllerMode = "auto";
        config.pwmSettings[0][0] = 4095;
        config.pwmSettings[0][1] = 4095;
        config.pwmSettings[1][2] = 287;
        config.pwmSettings[3][0] = 1;
        config.pwmSettings[3][1] = 1;
        config.latitude = 32.22;
        config.longitude = -110.96;
        config.cloudFrequency = 0;
        config.lightningFrequency = 0;

        ctrl.resetEphemeris();
        callback();
    },

    testDaytime: function(test) {
        var counter = 0,
            now = new Date(Date.UTC(2014, 2, 16, 19)); // Set time to noon

        // Start the lighting process
        ctrl.start({
            offset: now
        }, function(err, status) {
            if (err) console.error(err);

            console.log(status);
            if (status.status === "Day" && status.intensity[0] === 4095 && status.intensity[1] === 4095 && status.intensity[2] === 0) {
                counter++;
            }
        });

        // Run process for 5 seconds
        setTimeout(function() {
            ctrl.stop();
            test.equal(counter, 5);
            test.done();
        }, 5*1000);
    },

    testNighttimeWithMoon: function(test) {
        var counter = 0,
            now = new Date(Date.UTC(2014, 2, 17, 6));  // Set to 11PM today.

        // Start the lighting process
        ctrl.start({
            offset: now
        }, function(err, status) {
            if (err) console.error(err);

            console.log(status);
            if (status.status === "Night" && status.intensity[2] < config.pwmSettings[1][2]) {
                counter++;
            }
        });

        // Run process for 5 seconds
        setTimeout(function() {
            ctrl.stop();
            test.equal(counter, 5);
            test.done();
        }, 5*1000);
    },

    testNighttimeWithoutMoon: function(test) {
        var counter = 0,
            now = new Date(Date.UTC(2014, 2, 30, 6));  // Set to 11PM on 3/29

        // Start the lighting process
        ctrl.start({
            offset: now
        }, function(err, status) {
            if (err) console.error(err);

            console.log(status);
            if (status.status === "Night" && status.intensity[2] === 0) {
                counter++;
            }
        });

        // Run process for 5 seconds
        setTimeout(function() {
            ctrl.stop();
            test.equal(counter, 5);
            test.done();
        }, 5*1000);
    },

    testSunrise: function(test) {
        var counter = 0,
            now = new Date(Date.UTC(2014, 2, 16, 13)); // Set to 6AM today

        // Start the lighting process
        ctrl.start({
            offset: now
        }, function(err, status) {
            if (err) console.error(err);

            console.log(status);
            if (status.status === "Sunrise" && status.intensity[0] > 0 && status.intensity[0] < 4095 && status.intensity[2] === 0) {
                counter++;
            }
        });

        // Run process for 5 seconds
        setTimeout(function() {
            ctrl.stop();
            test.equal(counter, 5);
            test.done();
        }, 5*1000);
    },

    testSunset: function(test) {
        var counter = 0,
            now = new Date(Date.UTC(2014, 2, 17, 2)); // Set to 7PM today

        // Start the lighting process
        ctrl.start({
            offset: now
        }, function(err, status) {
            if (err) console.error(err);

            console.log(status);
            if (status.status === "Sunset" && status.intensity[0] > 0 && status.intensity[0] < 4095 && status.intensity[2] === 0) {
                counter++;
            }
        });

        // Run process for 5 seconds
        setTimeout(function() {
            ctrl.stop();
            test.equal(counter, 5);
            test.done();
        }, 5*1000);
    },

    testCloud: function(test) {
        test.done();
    },

    testLightning: function(test) {
        test.done();
    }
};