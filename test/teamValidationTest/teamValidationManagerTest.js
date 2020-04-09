var assert = require('assert');
var appjs = require("../../app.js");

var DBManager = require("../../modules/DBManager.js");
DBManager.init(appjs.app, appjs.mongo);

var teamValidationManager = require("../../modules/teamValidationManager.js");
teamValidationManager.init(appjs.app,DBManager);

describe('Team creation', function() {
    describe('Correct creation', function() {
        it('message should be null', function() {
            var correctTeam = { teamName: "correctTeam", teamCourt: "correctCourt" };
            teamValidationManager.teamCreation(correctTeam, function(msg){
                assert.equal(msg, null);

                describe('Existing team', function() {
                    var repeatedTeam = { teamName: "test", teamCourt: "correctCourt" };
                    teamValidationManager.teamCreation(repeatedTeam, function(msg){
                        assert.equal(msg, "El nombre de equipo ya existe");

                        describe('Team name empty', function() {
                            var emptyTeamName = { teamName: "", teamCourt: "correctCourt" };
                            teamValidationManager.teamCreation(emptyTeamName, function(msg){
                                assert.equal(msg, "Campo nombre de equipo vacio");

                                describe('Team court empty', function() {
                                    var emptyCourt = { teamName: "correctTeam", teamCourt: "" };
                                    teamValidationManager.teamCreation(emptyCourt, function(msg){
                                        assert.equal(msg, "Campo cancha vacio");

                                        describe('Correct coach addition', function() {
                                            var correctCoach = { teamName: "test", coachName: "correctCoach" };
                                            teamValidationManager.coachAddition(correctCoach, function(msg){
                                                assert.equal(msg, null);

                                                describe('Nonexistent team', function() {
                                                    var nonexistentTeam = { teamName: "nonexistentTeam", coachName: "correctCoach" };
                                                    teamValidationManager.coachAddition(nonexistentTeam, function(msg){
                                                        assert.equal(msg, "El equipo no existe");

                                                        describe('Coach name empty', function() {
                                                            var coachNameEmpty = { teamName: "test", coachName: "" };
                                                            teamValidationManager.coachAddition(coachNameEmpty, function(msg){
                                                                assert.equal(msg, "Campo nombre de entrenador vacio");

                                                                describe('Coach team name empty', function() {
                                                                    var coachTeamNameEmpty = { teamName: "", coachName: "correctCoach" };
                                                                    teamValidationManager.coachAddition(coachTeamNameEmpty, function(msg){
                                                                        assert.equal(msg, "El equipo no existe");

                                                                        describe('Existing bib', function() {
                                                                            var repeatedBib = { teamName : "test",
                                                                                playerName : "correctPlayer",
                                                                                playerBib : parseInt("0") };
                                                                            teamValidationManager.playerAddition(repeatedBib, function(msg){
                                                                                assert.equal(msg, "El dorsal ya existe en ese equipo");

                                                                                describe('Empty player name', function() {
                                                                                    var emptyName = { teamName : "test",
                                                                                        playerName : "",
                                                                                        playerBib : parseInt("99") };
                                                                                    teamValidationManager.playerAddition(emptyName, function(msg){
                                                                                        assert.equal(msg, "Campo nombre de jugador vacio");

                                                                                        describe('Empty team name', function() {
                                                                                            var emptyTeamName = { teamName : "",
                                                                                                playerName : "correctPlayer",
                                                                                                playerBib : parseInt("99") };
                                                                                            teamValidationManager.playerAddition(emptyTeamName, function(msg){
                                                                                                assert.equal(msg, "El equipo no existe");

                                                                                                describe('Correct player addtion', function() {
                                                                                                    var correctPlayer = { teamName : "test",
                                                                                                        playerName : "correctPlayer",
                                                                                                        playerBib : parseInt("99") };
                                                                                                    teamValidationManager.playerAddition(correctPlayer, function(msg){
                                                                                                        assert.equal(msg, null);

                                                                                                        describe('Negative player bib', function() {
                                                                                                            var correctPlayer = { teamName : "test",
                                                                                                                playerName : "correctPlayer",
                                                                                                                playerBib : parseInt("-1") };
                                                                                                            teamValidationManager.playerAddition(correctPlayer, function(msg){
                                                                                                                assert.equal(msg, "Dorsal negativo");

                                                                                                                describe('Player bib greater than 99', function() {
                                                                                                                    var correctPlayer = { teamName : "test",
                                                                                                                        playerName : "correctPlayer",
                                                                                                                        playerBib : parseInt("100") };
                                                                                                                    teamValidationManager.playerAddition(correctPlayer, function(msg){
                                                                                                                        assert.equal(msg, "Dorsal mayor que 99");

                                                                                                                        console.log("FINISH TEAM VALIDATION TEST");
                                                                                                                    });
                                                                                                                });
                                                                                                            });
                                                                                                        });
                                                                                                    });
                                                                                                });
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});