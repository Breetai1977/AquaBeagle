/*******************************************************************************
 * AquaBeagle
 * Name: lightControllerTest.js
 * Copyright (c) 2014. Brian Harris
 * Nodeunit tests for lightController module.
 ******************************************************************************/

var config = require('../app/config.js');
var ctrl = require('lightController');

exports.manualMode = {
    setUp: function(callback) {
        // Configure some lights
        config.controllerMode = "manual";
        config.cloudFrequency = 5;
        config.lightningFrequency = 5;

        callback();
    },

    test_start: function(test) {
        ctrl.start();
        setTimeout(function() {
            ctrl.stop();
        }, 2*60*1000); // 2 minutes
    }
};