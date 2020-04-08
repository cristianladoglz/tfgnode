var assert = require('assert');
var appjs = require("../../app.js");

var DBManager = require("../../modules/DBManager.js");
DBManager.init(appjs.app, appjs.mongo);

var teamValidationManager = require("../../modules/teamValidationManager.js");
teamValidationManager.init(appjs.app,DBManager);

describe('Team creation', function() {
    describe('Team name empty', function() {
        it('message should be "Campo nombre de equipo vacio"', function() {
            var emptyTeamName = { teamName: "", teamCourt: "correctCourt" };
            teamValidationManager.teamCreation(emptyTeamName, function(msg){
                assert.equal(msg, "Campo nombre de equipo vacio");
            });
        });
    });
});