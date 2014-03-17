/**
 * ephemerisTest.js
 * (c) 2014 Brian Harris
 * Unit tests for the ephemeris module.
 */

var ephemeris = require('ephemeris');

function assertNear(test, val1, val2, margin) {
    margin = margin || 1E-15;
    test.ok(Math.abs(val1 - val2) < margin, 'asserted almost equal: ' + val1 + ', ' + val2);
}

module.exports = {
    fromJulian: function(test) {
        console.log('fromJulian()');
        var date;
        date = ephemeris.fromJulian(2456733.140278);

        console.log(date);
        console.log('');
        test.ok(date.toString() === new Date(2014, 2, 16, 8, 22).toString());
        test.done();
    },

    fromUTCHours: function(test) {
        console.log('fromUTCHours()');
        var date;
        date = ephemeris.fromUTCHours(2014, 3, 16, 25.54151232708563);

        console.log(date.toUTCString());
        console.log('');
        test.ok(date.toUTCString() === new Date(Date.UTC(2014, 2, 17, 1, 32, 29)).toUTCString());
        test.done();
    },

    fromLocalHours: function(test) {
        console.log('fromLoaclHours()');
        var date;
        date = ephemeris.fromLocalHours(2014, 3, 16, 6.336774310498183);

        console.log(date);
        console.log('');
        test.ok(date.toString() === new Date(2014, 2, 16, 6, 20, 12).toString());
        test.done();
    },

    sunTimes: function(test) {
        console.log('sunTimes()');
        var times;
        times = ephemeris.Sun.getTimes(2014, 3, 16, 32.22, -110.96);

        console.log(times);
        console.log('');
        assertNear(test, times[0][1], 13.53, 0.01);
        assertNear(test, times[0][2], 25.54, 0.01);
        assertNear(test, times[1][1], 12.18, 0.01);
        assertNear(test, times[1][2], 26.90, 0.01);
        test.done();
    },

    moonPosition: function(test) {
        console.log('moonPosition()');
        var pos;
        pos = ephemeris.Moon.getPosition(2014, 3, 16, 23.25);

        console.log(pos);
        console.log('');
        assertNear(test, pos[0], 11.88, 0.01);
        assertNear(test, pos[1], -2.02, 0.01);
        assertNear(test, pos[2], 394822, 1);
        test.done();
    },

    moonTimes: function(test) {
        console.log('moonTimes()');
        var times;
        times = ephemeris.Moon.getTimes(2014, 3, 16, new Date().getTimezoneOffset()/60*-1, 32.22, -110.96);

        console.log(times);
        console.log('');
        assertNear(test, times[0], 18.83, 0.01);
        assertNear(test, times[1], 6.33, 0.01);
        test.done();
    },

    moonFraction: function(test) {
        console.log('moonFraction()');
        var frac;
        frac = ephemeris.Moon.getFraction(2014, 3, 16, 0);

        console.log(frac);
        console.log('');
        assertNear(test, frac, 1.0, 0.1);
        test.done();
    },

    moonQuarters: function(test) {
        console.log('moonQuarters()');
        var quarters;
        quarters = ephemeris.Moon.getQuarters(2014, 3, 16);

        for (var i=0; i<4; i++) {
            console.log(ephemeris.fromJulian(quarters[i]).toUTCString());
        }
        console.log('');
        test.ok(ephemeris.fromJulian(quarters[0]).toUTCString() === new Date(Date.UTC(2014, 2, 1, 7, 59, 53)).toUTCString());
        test.ok(ephemeris.fromJulian(quarters[1]).toUTCString() === new Date(Date.UTC(2014, 2, 8, 13, 26, 54)).toUTCString());
        test.ok(ephemeris.fromJulian(quarters[2]).toUTCString() === new Date(Date.UTC(2014, 2, 16, 17, 8, 38)).toUTCString());
        test.ok(ephemeris.fromJulian(quarters[3]).toUTCString() === new Date(Date.UTC(2014, 2, 24, 1, 46, 23)).toUTCString());
        test.done();
    }
};