/*******************************************************************************
 * AquaBeagle
 * Name: lightControllerTest.js
 * Copyright (c) 2014. Brian Harris
 * Nodeunit tests for lightController module.
 ******************************************************************************/

var config = require('aquaConfig')();
var ctrl = require('lightController');
var ephemeris = require('ephemeris');
var sunTimes, moonTimes;

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
            now = new Date().getHours(),
            offset;

        // Calculate the offset to be 1200.
        if (now < 12) {
            offset = 12 - now;
        } else {
            offset = 24 - now + 12;
        }

        // Start the lighting process
        ctrl.start({
            offset: offset
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
            now = new Date().getHours(),
            offset;

        // Calculate the offset to 2300
        if (now < 23) {
            offset = 23 - now;
        } else {
            offset = 24 - now + 23;
        }

        // Start the lighting process
        ctrl.start({
            offset: offset
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
            now = new Date().getHours(),
            offset;

        // Set the offset to put you between 0700 and 0800
        if (now < 7) {
            offset = 7 - now + .5;
        } else {
            offset = 24 - now + 7.5;
        }

        // Start the lighting process
        ctrl.start({
            offset: offset
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
            now = new Date().getHours(),
            offset;

        // Set the offset to put you between 1700 and 1800
        if (now < 18) {
            offset = 17 - now + .5;
        } else {
            offset = 24 - now + 17.5;
        }

        // Start the lighting process
        ctrl.start({
            offset: offset
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
        var now = new Date();
        sunTimes = ephemeris.Sun.getTimes(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())), 32.22, -110.96);
        callback();
    },

    testDaytime: function(test) {
        var counter = 0,
            now = new Date().getHours(),
            offset;

        // Calculate offset so it is between sunriseEnd and sunsetStart
        var diff = (sunTimes.sunsetStart - sunTimes.sunriseEnd) / 2;
        if (now < sunTimes.sunriseEnd.getHours()) {
            offset = sunTimes.sunriseEnd.getHours() - now + (diff / (1000*60*60));
        } else if (now > sunTimes.sunsetStart.getHours()) {
            offset = (now - sunTimes.sunsetStart.getHours()) * -1 - (diff / (1000*60*60));
        } else {
            offset = 0;
        }

        // Start the lighting process
        ctrl.start({
            offset: offset
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
        test.done();
    },

    testNighttimeWithoutMoon: function(test) {
        test.done();
    },

    testSunrise: function(test) {
        var counter = 0,
            now = new Date().getHours(),
            offset;

        // Calculate offset so it is between nightEnd and sunriseEnd
        var diff = (sunTimes.sunriseEnd - sunTimes.nightEnd) / 2;
        if (now < sunTimes.nightEnd.getHours()) {
            offset = sunTimes.nightEnd.getHours() - now + (diff / (1000*60*60));
        } else if (now > sunTimes.sunriseEnd.getHours()) {
            offset = (now - sunTimes.sunriseEnd.getHours()) * -1 - (diff / (1000*60*60));
        } else {
            offset = 0;
        }

        // Start the lighting process
        ctrl.start({
            offset: offset
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
            now = new Date().getHours(),
            offset;

        // Calculate offset so it is between nightEnd and sunriseEnd
        var diff = (sunTimes.night - sunTimes.sunsetStart) / 2;
        if (now < sunTimes.sunsetStart.getHours()) {
            offset = sunTimes.sunsetStart.getHours() - now + (diff / (1000*60*60));
        } else if (now > sunTimes.night.getHours()) {
            offset = (now - sunTimes.night.getHours()) * -1 - (diff / (1000*60*60));
        } else {
            offset = 0;
        }

        // Start the lighting process
        ctrl.start({
            offset: offset
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