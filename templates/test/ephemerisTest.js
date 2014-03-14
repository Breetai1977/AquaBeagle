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
    solarNoon: Date.UTC(2014, 2, 12, 19, 35, 13),
    nadir: Date.UTC(2014, 2, 12, 7, 35, 13),
    sunrise: Date.UTC(2014, 2, 12, 13, 40, 23),
    sunset: Date.UTC(2014, 2, 13, 1, 30, 3),
    sunriseEnd: Date.UTC(2014, 2, 12, 13, 42, 54),
    sunsetStart: Date.UTC(2014, 2, 13, 1, 27, 32),
    dawn: Date.UTC(2014, 2, 12, 13, 15, 55),
    dusk: Date.UTC(2014, 2, 13, 1, 54, 30),
    nauticalDawn: Date.UTC(2014, 2, 12, 12, 47, 32),
    nauticalDusk: Date.UTC(2014, 2, 13, 2, 22, 53),
    nightEnd: Date.UTC(2014, 2, 12, 12, 19, 2),
    night: Date.UTC(2014, 2, 13, 2, 51, 23)
};

var testMoonTimes = {
    moonrise: Date.UTC(2014, 2, 12, 22, 15, 14),
    moonset: Date.UTC(2014, 2, 12, 11, 3, 33)
}

module.exports = {
    test_dates: function(test) {
        console.log(new Date(Date.UTC(2014, 2, 13, 15, 49, 0)).valueOf());
        console.log(Date.UTC(2014, 2, 13, 15, 49, 0));
        test.done();
    },

    /*
     * Should return an object with correct azimuth and altitude for the given time and location.
     */
    test_getPosition: function(test) {
        var sunPos = ephemeris.Sun.getPosition(date, lat, lng);

        assertNear(test, ephemeris.toDegrees(sunPos.altitude), 17.80, 0.01);
        assertNear(test, ephemeris.toDegrees(sunPos.azimuth), 253.80, 0.01);
        test.done();
    },

    test_getTimes: function(test) {
        var times = ephemeris.Sun.getTimes(date, lat, lng);

        for (var i in testSunTimes) {
            if (testSunTimes[i] != "")
                test.equal(new Date(times[i]).toString(), new Date(testSunTimes[i]).toString());
        }
        test.done();
    },

    test_getMoonPosition: function(test) {
        var moonPos = ephemeris.Moon.getPosition(date, lat, lng);

        assertNear(test, ephemeris.toDegrees(moonPos.altitude), 32.25, 0.01);
        assertNear(test, ephemeris.toDegrees(moonPos.azimuth), 91.44, 0.01);
        assertNear(test, moonPos.distance, 405883.71, 0.01);
        test.done();
    },

    test_getMoonTimes: function(test) {
        var times = ephemeris.Moon.getTimes(date, lat, lng);

        test.equal(new Date(times.moonrise).toString(), new Date(testMoonTimes.moonrise).toString());
        test.equal(new Date(times.moonset).toString(), new Date(testMoonTimes.moonset).toString());
        test.done();
    },

    test_getMoonIllumination: function(test) {
        var moonIllum = ephemeris.Moon.getMoonIllumination(date);

        assertNear(test, moonIllum.fraction, 0.8030, 0.0001);
        assertNear(test, moonIllum.angle, -1.4409, 0.0001);
        test.done();
    }
};