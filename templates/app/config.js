/**************************************************************************
 * Config.js
 * (c) 2014 Brian Harris
 * Configuration library for the AquaBeagle aquarium controller.
***************************************************************************/

var fs = require('fs');
var cfg = require('./config.json');

var config = {
    save: function() {
        fs.writeFileSync('./templates/app/config.json', JSON.stringify(cfg));
        console.log('Saved config to \'config.json\'!');
    }
};

/*
 * PWM Settings property:
 *   Pulse-width modulation channels/pin(s) that control the lights/fan.
 *   Two dimensional Array:
 *      Row 1 - Daytime max setting for each of the 8 channels.
 *      Row 2 - Nighttime max setting for each of the 8 channels.
 *      Row 3 - Delay/offset settings.
 *      Row 4 - Channel. (For synchronizing pin(s) during light effects).
 *      Row 5 - BBB GPIO pin(s) numbers.
 *
 *      Settings can be  and number 0 - 4095.
 *      0 - off
 *      ...
 *      4095 - Max brightness
 */
Object.defineProperty(config, "pwmSettings", {
    get: function() {
        // Set default so that each channel is off.
        if (cfg["pwmSettings"] == undefined || cfg["pwmSettings"] == "") {
            // Setup a 4x8 Array with default off settings and standard BBB pin(s).
            cfg["pwmSettings"] = [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                ["P9_22", "P9_29", "P9_14", "P8_34", "P8_45", "P8_13", "P9_28", "P9_42"]
            ];
        }
        return cfg["pwmSettings"];
    }
});

/*
 * Controller Mode property:
 *   Defines the mode that the controller runs in.
 *
 *   Values:
 *      auto - Controller adjusts the light brightness based on calculated
 *             rise/set/phase for the user configured location and date.
 *      manual - Controller uses the user configured rise/set times and the
 *               max intensity for moonlight.
 */
Object.defineProperty(config, "controllerMode", {
    get: function() {
        // Set default to "manual".
        if (cfg["controllerMode"] == undefined || cfg["controllerMode"] == "") {
            cfg["controllerMode"] = "manual";
        }
        return cfg["controllerMode"];
    },

    set: function(mode) {
        // Ensure that the value is either "auto" or "manual".
        if (mode.toLowerCase() != 'auto' && mode.toLowerCase() != 'manual') {
            console.warn('Invalid controller mode; Supported values are [\'auto\', \'manual\'].  Setting to manual mode now.');
            cfg["controllerMode"] = "manual";
        } else {
            cfg["controllerMode"] = mode.toLowerCase();
        }
    }
});

/*
 * Sunrise Time property:
 *   Time when the lights attain full brightness when running in manual mode.
 *   Stored in number of seconds since midnight.
 *
 *   Values:
 *      A Javascript Date() object.
 *      Number of seconds since midnight: 0 to 86400.
 */
Object.defineProperty(config, "sunriseTime", {
    get: function() {
        // Set default to 7:00 AM local time.
        if (cfg["sunriseTime"] == undefined || cfg["sunriseTime"] == "") {
            cfg["sunriseTime"] = 25200; // Number of seconds from midnight for 7AM
        }
        return cfg["sunriseTime"];
    },

    set: function(time) {
        // Ensure that the value is either a Date or within the range of seconds in a day.
        if ((!(time instanceof Date) && typeof time != "number") || (typeof time == "number" && (time < 0 || time > 86400))) {
            console.warn('Invalid sunrise time; Supported values are a Date object or any number between 0 and 86400.  Setting to 7AM local time.');
            cfg["sunriseTime"] = 25200; // Number of seconds from midnight for 7AM
        } else if (time instanceof Date) {
            // Create a reference date of midnight the same day
            var refDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
            // Get difference in milliseconds
            var diff = Math.abs(time - refDate);
            // Convert to whole seconds
            cfg["sunriseTime"] = Math.floor(diff / 1000);
        } else {
            cfg["sunriseTime"] = Math.floor(time);  // Number of seconds from midnight
        }
    }
});

/*
 * Sunset Time property:
 *   Time when the lights begin to fade down for simulating night.
 *   Stored in number of seconds since midnight.
 *
 *   Values:
 *      A Javascript Date() object.
 *      Number of seconds since midnight: 0 to 86400.
 */
Object.defineProperty(config, "sunsetTime", {
    get: function() {
        // Set default to 6:00 PM local time.
        if (cfg["sunsetTime"] == undefined || cfg["sunsetTime"] == "") {
            cfg["sunsetTime"] = 64800; // Number of seconds from midnight to 6PM local time.
        }
        return cfg["sunsetTime"];
    },

    set: function(time) {
        // Ensure that the value is either a Date or within the range of seconds in a day.
        if ((!(time instanceof Date) && typeof time != "number") || (typeof time == "number" && (time < 0 || time > 86400))) {
            console.warn('Invalid sunset time; Supported values are a Date object or any number between 0 and 86400.  Setting to 6PM local time.');
            cfg["sunsetTime"] = 64800; // Number of seconds from midnight to 6PM local time.
        } else if (time instanceof Date) {
            // Create a reference date of midnight the same day.
            var refDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
            // Get the difference in milliseconds
            var diff = Math.abs(time - refDate);
            // Convert to whole seconds
            cfg["sunsetTime"] = Math.floor(diff / 1000);
        } else {
            cfg["sunsetTime"] = Math.floor(time); // Number of seconds from midnight.
        }
    }
});

/*
 * Ramp Time property:
 *   The number of minutes the lights take to fade up to full brightness and fade down to off.
 *
 *   Values:
 *      Number of minutes, valid range: 0 to 720.
 */
Object.defineProperty(config, "rampTime", {
    get: function() {
        // Set default to 45 minutes.
        if (cfg["rampTime"] == undefined || cfg["rampTime"] == "") {
            cfg["rampTime"] = 45;
        }
        return cfg["rampTime"];
    },

    set: function(minutes) {
        // Ensure that the value is a number between 0 and 720.
        if (typeof time != "number" || (time < 0  || time > 720)) {
            console.warn('Invalid ramp time; Supported values are any number between 0 and 720.  Setting to 45 minutes.');
            cfg["rampTime"] = 45;
        } else {
            cfg["rampTime"] = Math.floor(minutes);
        }
    }
});

/*
 * Cloud Frequency property:
 *   Ramps lights down to a lower brightness for a random number of seconds, then back up to full to simulate a passing cloud.
 *
 *   Values:
 *      0 - Feature disabled.
 *      1 - One cloud every 0 - 60 minutes. (random)
 *      2 - One cloud every 0 - 55 minutes. (random)
 *      ...
 *      13 - One cloud every minute.
 */
Object.defineProperty(config, "cloudFrequency", {
    get: function() {
        // Set default to disable feature.
        if (cfg["cloudFrequency"] == undefined || cfg["cloudFrequency"] == "") {
            cfg["cloudFrequency"] = 0;
        }
        return cfg["cloudFrequency"];
    },

    set: function(frequency) {
        // Ensure that the value is a number between 0 and 13.
        if (typeof frequency != "number" || (frequency < 0 || frequency > 13)) {
            console.warn('Invalid cloud frequency; Supported values are any number between 0 and 13.  Setting to 0, disabled.');
            cfg["cloudFrequency"] = 0;
        } else {
            cfg["cloudFrequency"] = Math.floor(frequency);
        }
    }
});

/*
 * Lightning Frequency property:
 *   Randomly flashes LEDs to simulate storm lightning.  Occurs only when a cloud is overhead.
 *
 *   Values:
 *      0 - Feature disabled.
 *      1 - 10% of clouds have a lightning effect. (random)
 *      ...
 *      10 - 100% of clouds have a lightning effect.
 */
Object.defineProperty(config, "lightningFrequency", {
    get: function() {
        // Set default to disable feature.
        if (cfg["lightningFrequency"] == undefined || cfg["lightningFrequency"] == "") {
            cfg["lightningFrequency"] = 0;
        }
        return cfg["lightningFrequency"];
    },

    set: function(frequency) {
        // Ensure that the value is a number between 0 and 10.
        if (typeof frequency != "number" || (frequency < 0 || frequency > 10)) {
            console.warn('Invalid lightning frequency; Supported values are any number between 0 and 10.  Setting to 0, disabled.');
            cfg["lightningFrequency"] = 0;
        } else {
            cfg["lightningFrequency"] = Math.floor(frequency);
        }
    }
});

/*
 * Simulate Moon property:
 *   Enables adjusting of nighttime brightness to simulate the phases and rise/set times of the Moon.
 *   If enabled uses dedicated Moonlight channels, or daylight channels if no dedicated Moonlight channels are configured.
 *
 *   Values:
 *      0 - Feature disabled.
 *      1 - Simulate Moon.
 */
Object.defineProperty(config, "simulateMoon", {
    get: function() {
        // Set default to disable feature.
        if (cfg["simulateMoon"] == undefined || cfg["simulateMoon"] == "") {
            cfg["simulateMoon"] = 0;
        }
        return cfg["simulateMoon"];
    },

    set: function(onof) {
        // Ensure that the value is a number between 0 and 1.
        if (typeof onof != "number" || (onof < 0 || onof > 1)) {
            console.warn('Invalid simulate Moon value; Supported values are either a 0 or a 1.  Setting to 0, disabled.');
            cfg["simulateMoon"] = 0;
        } else {
            cfg["simulateMoon"] = Math.floor(onof);
        }
    }
});

/*
 * Latitude property:
 *   Latitude to use for calculating rise/set times and phases of the Moon, in auto mode.
 *
 *   Values:
 *      Decimal in degrees of latitude: North is positive, South is negative.
 */
Object.defineProperty(config, "latitude", {
    get: function() {
        // Set default to the Equator, 0*.
        if (cfg["latitude"] == undefined || cfg["latitude"] == "") {
            cfg["latitude"] = 0;
        }
        return cfg["latitude"];
    },

    set: function(lat) {
        // Ensure that the value is a number between -90 and 90.
        if (typeof lat != "number" || (lat < -90 || lat > 90)) {
            console.warn('Invalid latitude; Supported values are any number between -90 and 90.  Setting to 0, Equator.');
            cfg["latitude"] = 0;
        } else {
            cfg["latitude"] = lat;
        }
    }
});

/*
 * Longitude property:
 *   Longitude to use for calculating rise/set times and phases of the Moon, in auto mode.
 *
 *   Values:
 *      Decimal in degrees of longitude: East is positive, West is negative.
 */
Object.defineProperty(config, "longitude", {
    get: function() {
        // Set default to the Prime Meridian, 0*.
        if (cfg["longitude"] == undefined || cfg["longitude"] == "") {
            cfg["longitude"] = 0;
        }
        return cfg["longitude"];
    },

    set: function(lon) {
        // Ensure that the value is a number between -180 and 180.
        if (typeof lon != "number" || (lon < -180 || lon > 180)) {
            console.warn('Invalid longitude; Supported values are any number between -180 and 180.  Setting to 0, Prime Meridian');
            cfg["longitude"] = 0;
        } else {
            cfg["longitude"] = lon;
        }
    }
});

/*
 * Fan Control property:
 *   Designate pin number P9_42 as to control a PWM PC fan.
 *
 *   Values:
 *      0 - Feature disabled.
 *      1 - Enable fan control.
 */
Object.defineProperty(config, "fanControl", {
    get: function() {
        // Set default to disable feature.
        if (cfg["fanControl"] == undefined || cfg["fanControl"] == "") {
            cfg["fanControl"] = 0;
        }
        return cfg["fanControl"];
    },

    set: function(onof) {
        // Ensure that the value is a number between 0 and 1.
        if (typeof onof != "number" || (onof < 0 || onof > 1)) {
            console.warn('Invalid fan control; Supported values are either a 0 or 1.  Setting to 0, disabled.');
            cfg["fanControl"] = 0;
        } else {
            cfg["fanControl"] = Math.floor(onof);
        }
    }
});

/*
 * Fan Max property:
 *   The maximum setting for the fan speed.
 *
 *   Values:
 *      0 - Fan off.
 *      ...
 *      4095 - Max fan speed.
 */
Object.defineProperty(config, "fanMax", {
    get: function() {
        // Set default to turn fan off.
        if (cfg["fanMax"] === undefined || cfg["fanMax"] ==="") {
            cfg["fanMax"] = 0;
        }
        return cfg["fanMax"];
    },

    set: function(setting) {
        // Ensure the value is a number between 0 and 4095.
        if (typeof setting != "number" || (setting < 0 || setting > 4095)) {
            console.warn("Invalid fan max; Supported values are between 0 and 4095.  Setting to 0, off.");
            cfg["fanMax"] = 0;
        } else {
            cfg["fanMax"] = Math.floor(setting);
        }
    }
});

module.exports = config;