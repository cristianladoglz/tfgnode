var assert = require('assert');
var appjs = require("../../app.js");

var DBManager = require("../../modules/DBManager.js");
DBManager.init(appjs.app, appjs.mongo);

var matchValidationManager = require("../../modules/matchValidationManager.js");
matchValidationManager.init(appjs.app,DBManager);

describe('Match creation', function() {
    describe('Correct creation', function () {
        it('message should be null', function () {
            var correctMatch = {localTeam : "test",
                visitorTeam : "test2",
                quartersNumber : 1,
                durationQuarter : 1,
                runningTime : "false",
                timeOuts : 0,
                maxPersonalFouls : 0,
                date : "2020-01-01",
                time : "00:00",
                matchCourt : "test",
                tableOfficial : "",
                state : "created"};
            matchValidationManager.matchCreation(correctMatch, function (msg) {
                assert.equal(msg, null);

                console.log("FINISH MATCH VALIDATION TEST");
            });
        });
    });
});