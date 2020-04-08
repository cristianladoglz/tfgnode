var assert = require('assert');
var appjs = require("../../app.js");

var DBManager = require("../../modules/DBManager.js");
DBManager.init(appjs.app, appjs.mongo);

var matchValidationManager = require("../../modules/matchValidationManager.js");
matchValidationManager.init(appjs.app,DBManager);

describe('Match creation', function() {
    describe('Correct creation', function () {
        it('message should be null', function () {
            var correctMatch = {teamName: "correctTeam", teamCourt: "correctCourt"};
            matchValidationManager.matchCreation(correctMatch, function (msg) {
                assert.equal(msg, null);
            });
        });
    });
});