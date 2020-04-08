var assert = require('assert');
var appjs = require("../../app.js");

var DBManager = require("../../modules/DBManager.js");
DBManager.init(appjs.app, appjs.mongo);

var teamValidationManager = require("../../modules/teamValidationManager.js");
teamValidationManager.init(appjs.app,DBManager);

describe('Team creation', function() {
    describe('Existing team', function() {
        it('message should be "El nombre de equipo ya existe"', function() {
            var repeatedTeam = { teamName: "test", teamCourt: "correctCourt" };
            teamValidationManager.teamCreation(repeatedTeam, function(msg){
                assert.equal(msg, "El nombre de equipo ya existe");
            });
        });
    });
});