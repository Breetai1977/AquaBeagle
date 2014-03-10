/*******************************************************************************
 * AquaBeagle
 * Name: lightController.js
 * Copyright (c) 2014. Brian Harris
 * Controller for aquarium lights part of the AquaBeagle aquarium
 * controller. my test
 ******************************************************************************/

var config = require('config.js');
var ephemeris = require('ephemeris');
var pwm = require('BeaglePwm');

// Declare internals
var internals = {};

internals.now = {
    intervalId: 0
};

exports.start = function() {
    var callback = arguments[0];

    if (internals.now.intervalId) {
        process.nextTick(function() {
            callback();
        });

        return;
    }


};

exports.stop = function() {
    if (!internals.now.intervalId) {
        return;
    }

    clearInterval(internals.now.intervalId);
    internals.now.intervalId = 0;
};

module.exports = {
    start: function() {
        // Initialize pwm driver for configured pins
        pwm.start();
        pwm.setFreq(500); // This is the PWM frequency in Hz, (Recommended between 500Hz - 1KHz for most PWM drivers).
        // Initialize pin P9_42 for fan control if configured.
        if (config.fanControl) {
            pwm.setFreq(25000, 'P9_42'); // 25KHz frequency, standard for PC fans.
            // Disable any light settings on same pin.
            config.pwmSettings[0][7] = 0;
            config.pwmSettings[1][7] = 0;
            config.pwmSettings[2][7] = 0;
        }


    },

    start: function(options, callback) {
        if (arguments.length !== 2) {
            callback = arguments[0];
            options = config;
        }


        var now = Date();

        // Perform tasks once daily
        if (now.getDay() > lastDay || (now.getDay() == 0 && lastDay == 6)) {
            lastDay = now.getDay(); // Set lastDay to now so we're sure this only runs once per day.
            // TODO: Set the system clock via ntp.
            // Perform these tasks only if in "auto" mode
            if (config..controllerMode == "auto") {
                // Get the Sunrise/set times for today.
                sunTimes = ephemeris.Sun.getTimes(now, config.latitude, config.longitude);
                // Get the Moonrise/set times for today.
                moonTimes = ephemeris.Moon.getTimes(now, config.latitude, config.longitude);
            }
        }


    }
};