var assert = require('assert');
var appjs = require("../../app.js");

var DBManager = require("../../modules/DBManager.js");
DBManager.init(appjs.app, appjs.mongo);

var teamValidationManager = require("../../modules/teamValidationManager.js");
teamValidationManager.init(appjs.app,DBManager);

describe('Team creation', function() {
    describe('Team court empty', function() {
        it('message should be "Campo cancha vacio"', function() {
            var emptyCourt = { teamName: "correctTeam", teamCourt: "" };
            teamValidationManager.teamCreation(emptyCourt, function(msg){
                assert.equal(msg, "Campo cancha vacio");
            });
        });
    });
});