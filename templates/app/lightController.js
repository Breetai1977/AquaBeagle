/********************************************************************
 * LightController.js
 * (c) 2014 Brian Harris
 * Controller for aquarium lights part of the AquaBeagle aquarium
 * controller.
*********************************************************************/
var config = require('config.js');
var ephemeris = require('ephemeris');
var pwm = require('BeaglePwm');

var currentPwm = [0, 0, 0, 0, 0, 0, 0, 0],
    lastJDate = 0;

module.exports = {

    running: 0,

    begin: function() {
        // Initialize running
        this.running = 1;
        // Initialize pwm driver for configured pins
        pwm.begin();
        pwm.setFreq(500); // This is the PWM frequency in Hz, (Recommended between 500Hz - 1KHz for most PWM drivers).
        // Initialize pin P9_42 for fan control if configured.
        if (config.fanControl) {
            pwm.setFreq(25000, 'P9_42'); // 25KHz frequency, standard for PC fans.
            // Disable any light settings on same pin.
            config.pwmSettings[0][7] = 0;
            config.pwmSettings[1][7] = 0;
            config.pwmSettings[2][7] = 0;
        }

        while (this.running) {
            var now = Date();

            // Perform daily tasks
            if (ephemeris.toJulian(now) > lastJDate) {
                lastJDate
                // TODO set the system time via ntp.
            }
        }
    }
};