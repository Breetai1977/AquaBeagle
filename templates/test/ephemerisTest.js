/**
 * Unit tests for the ephemeris.js module.
 */

var ephemeris = require('ephemeris');

function assertNear(test, val1, val2, margin) {
    margin = margin || 1E-15;
    test.ok(Math.abs(val1 - val2) < margin, 'asserted almost equal: ' + val1 + ', ' + val2);
}

var date = new Date('2014-03-04UTC'),
    lat = 32.22,
    lng = -110.96;

var testSunTimes = {
    solarNoon: "2014-03-04T19:37:12Z",
    nadir: "2014-03-04T07:37:12Z",
    sunrise: "2014-03-04T13:50:16Z",
    sunset: "2014-03-05T01:24:08Z",
    sunriseEnd: "2014-03-04T13:52:48Z",
    sunsetStart: "2014-03-05T01:21:37Z",
    dawn: "2014-03-04T13:25:42Z",
    dusk: "2014-03-05T01:48:43Z",
    nauticalDawn: "2014-03-04T12:57:18Z",
    nauticalDusk: "2014-03-05T02:17:07Z",
    nightEnd: "2014-03-04T12:28:55Z",
    night: "2014-03-05T02:45:30Z"
};

var testMoonTimes = {
    moonrise: "2014-03-04T15:51:08Z",
    moonset: "2014-03-05T05:18:56Z"
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
                test.equal(times[i].toUTCString(), new Date(testSunTimes[i]).toUTCString());
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

        test.equal(times.moonrise.toUTCString(), new Date(testMoonTimes.moonrise).toUTCString());
        test.equal(times.moonset.toUTCString(), new Date(testMoonTimes.moonset).toUTCString());
        test.done();
    },

    test_getMoonIllumination: function(test) {
        var moonIllum = ephemeris.Moon.getMoonIllumination(date);

        assertNear(test, moonIllum.fraction, 0.0944, 0.0001);
        assertNear(test, moonIllum.angle, -2.0008, 0.0001);
        test.done();
    }
};