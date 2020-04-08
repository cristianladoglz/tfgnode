var assert = require('assert');
var appjs = require("../../app.js");

var DBManager = require("../../modules/DBManager.js");
DBManager.init(appjs.app, appjs.mongo);

var teamValidationManager = require("../../modules/teamValidationManager.js");
teamValidationManager.init(appjs.app,DBManager);

describe('Team creation', function() {
    describe('Correct addition', function() {
        it('message should be null', function() {
            var correctCoach = { teamName: "test", coachName: "correctCoach" }
            teamValidationManager.coachAddition(correctCoach, function(msg){
                assert.equal(msg, null);
            });
        });
    });
});