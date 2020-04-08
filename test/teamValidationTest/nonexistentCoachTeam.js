var assert = require('assert');
var appjs = require("../../app.js");

var DBManager = require("../../modules/DBManager.js");
DBManager.init(appjs.app, appjs.mongo);

var teamValidationManager = require("../../modules/teamValidationManager.js");
teamValidationManager.init(appjs.app,DBManager);

describe('Team creation', function() {
    describe('Nonexistent team', function() {
        it('message should be "El equipo no existe"', function() {7
            var nonexistentTeam = { teamName: "nonexistentTeam", coachName: "correctCoach" };
            teamValidationManager.coachAddition(nonexistentTeam, function(msg){
                assert.equal(msg, "El equipo no existe");
            });
        });
    });
});