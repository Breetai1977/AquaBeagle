/**
 * Unit tests for the ephemeris.js module.
 */

var ephemeris = require('ephemeris');

function assertNear(test, val1, val2, margin) {
    margin = margin || 1E-15;
    test.ok(Math.abs(val1 - val2) < margin, 'asserted almost equal: ' + val1 + ', ' + val2);
}

var date = Date.UTC(2014, 2, 12),
    lat = 32.22,
    lng = -110.96;

var testSunTimes = {
    solarNoon: Date.UTC(2014, 2, 4, 19, 37, 12),
    nadir: Date.UTC(2014, 2, 4, 7, 37, 12),
    sunrise: Date.UTC(2014, 2, 4, 13, 50, 16),
    sunset: Date.UTC(2014, 2, 5, 1, 24, 8),
    sunriseEnd: Date.UTC(2014, 2, 4, 13, 52, 48),
    sunsetStart: Date.UTC(2014, 2, 5, 1, 21, 37),
    dawn: Date.UTC(2014, 2, 4, 13, 25, 42),
    dusk: Date.UTC(2014, 2, 5, 1, 48, 43),
    nauticalDawn: Date.UTC(2014, 2, 4, 12, 57, 18),
    nauticalDusk: Date.UTC(2014, 2, 5, 2, 17, 7),
    nightEnd: Date.UTC(2014, 2, 4, 12, 28, 55),
    night: Date.UTC(2014, 2, 5, 2, 45, 30)
};

var testMoonTimes = {
    moonrise: Date.UTC(2014, 2, 4, 15, 51, 8),
    moonset: Date.UTC(2014, 2, 5, 5, 18, 56)
}

module.exports = {
    /*
     * Should return an object with correct azimuth and altitude for the given time and location.
     */
    test_getPosition: function(test) {
        var sunPos = ephemeris.Sun.getPosition(date, lat, lng);

        assertNear(test, ephemeris.toDegrees(sunPos.altitude), 16.36, 0.01);
        assertNear(test, ephemeris.toDegrees(sunPos.azimuth), 250.87, 0.01);
        test.done();
    },

    test_getTimes: function(test) {
        var times = ephemeris.Sun.getTimes(date, lat, lng);

        for (var i in testSunTimes) {
            if (testSunTimes[i] != "")
                test.equal(times[i], testSunTimes[i]);
        }
        test.done();
    },

    test_getMoonPosition: function(test) {
        var moonPos = ephemeris.Moon.getPosition(date, lat, lng);

        assertNear(test, ephemeris.toDegrees(moonPos.altitude), 51.10, 0.01);
        assertNear(test, ephemeris.toDegrees(moonPos.azimuth), 240.54, 0.01);
        assertNear(test, moonPos.distance, 378831.17, 0.01);
        test.done();
    },

    test_getMoonTimes: function(test) {
        var times = ephemeris.Moon.getTimes(date, lat, lng);

        test.equal(times.moonrise, testMoonTimes.moonrise);
        test.equal(times.moonset, testMoonTimes.moonset);
        test.done();
    },

    test_getMoonIllumination: function(test) {
        var moonIllum = ephemeris.Moon.getMoonIllumination(date);

        assertNear(test, moonIllum.fraction, 0.0944, 0.0001);
        assertNear(test, moonIllum.angle, -1.4658, 0.0001);
        test.done();
    }
};