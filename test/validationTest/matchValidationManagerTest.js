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
                timeout : 0,
                maxPersonalFouls : 0,
                date : "2020-01-01",
                time : "00:00",
                matchCourt : "test",
                tableOfficial : "none",
                state : "created"};
            matchValidationManager.matchCreation(correctMatch, function (msg) {
                assert.equal(msg, null);

                describe('Quarters number less than 1', function () {
                    var correctMatch = {localTeam : "test",
                        visitorTeam : "test2",
                        quartersNumber : 0,
                        durationQuarter : 1,
                        runningTime : "false",
                        timeout : 0,
                        maxPersonalFouls : 0,
                        date : "2020-01-01",
                        time : "00:00",
                        matchCourt : "test",
                        tableOfficial : "none",
                        state : "created"};
                    matchValidationManager.matchCreation(correctMatch, function (msg) {
                        assert.equal(msg, "El número de cuartos debe ser mínimo 1");

                        describe('Quarters number empty', function () {
                            var correctMatch = {
                                localTeam: "test",
                                visitorTeam: "test2",
                                quartersNumber: "",
                                durationQuarter: 1,
                                runningTime: "false",
                                timeout: 0,
                                maxPersonalFouls: 0,
                                date: "2020-01-01",
                                time: "00:00",
                                matchCourt: "test",
                                tableOfficial: "none",
                                state: "created"
                            };
                            matchValidationManager.matchCreation(correctMatch, function (msg) {
                                assert.equal(msg, "Número de cuartos vacío");

                                describe('Duration quarter less than 1', function () {
                                    var correctMatch = {
                                        localTeam: "test",
                                        visitorTeam: "test2",
                                        quartersNumber: 4,
                                        durationQuarter: 0,
                                        runningTime: "false",
                                        timeout: 0,
                                        maxPersonalFouls: 0,
                                        date: "2020-01-01",
                                        time: "00:00",
                                        matchCourt: "test",
                                        tableOfficial: "none",
                                        state: "created"
                                    };
                                    matchValidationManager.matchCreation(correctMatch, function (msg) {
                                        assert.equal(msg, "La duración de cada cuarto debe ser mínimo de 1 minuto");

                                        describe('Duration quarter greater than 60', function () {
                                            var correctMatch = {
                                                localTeam: "test",
                                                visitorTeam: "test2",
                                                quartersNumber: 4,
                                                durationQuarter: 61,
                                                runningTime: "false",
                                                timeout: 0,
                                                maxPersonalFouls: 0,
                                                date: "2020-01-01",
                                                time: "00:00",
                                                matchCourt: "test",
                                                tableOfficial: "none",
                                                state: "created"
                                            };
                                            matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                assert.equal(msg, "La duración de cada cuarto debe ser máximo de 60 minutos");

                                                describe('Duration quarter empty', function () {
                                                    var correctMatch = {
                                                        localTeam: "test",
                                                        visitorTeam: "test2",
                                                        quartersNumber: 4,
                                                        durationQuarter: "",
                                                        runningTime: "false",
                                                        timeout: 0,
                                                        maxPersonalFouls: 0,
                                                        date: "2020-01-01",
                                                        time: "00:00",
                                                        matchCourt: "test",
                                                        tableOfficial: "none",
                                                        state: "created"
                                                    };
                                                    matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                        assert.equal(msg, "Duración de cada cuarto vacío");

                                                        describe('Nonexistent local team', function () {
                                                            var correctMatch = {
                                                                localTeam: "",
                                                                visitorTeam: "test2",
                                                                quartersNumber: 4,
                                                                durationQuarter: 60,
                                                                runningTime: "false",
                                                                timeout: 0,
                                                                maxPersonalFouls: 0,
                                                                date: "2020-01-01",
                                                                time: "00:00",
                                                                matchCourt: "test",
                                                                tableOfficial: "none",
                                                                state: "created"
                                                            };
                                                            matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                                assert.equal(msg, "El nombre del equipo local no existe");

                                                                describe('Nonexistent visitor team', function () {
                                                                    var correctMatch = {
                                                                        localTeam: "test",
                                                                        visitorTeam: "",
                                                                        quartersNumber: 4,
                                                                        durationQuarter: 60,
                                                                        runningTime: "false",
                                                                        timeout: 0,
                                                                        maxPersonalFouls: 0,
                                                                        date: "2020-01-01",
                                                                        time: "00:00",
                                                                        matchCourt: "test",
                                                                        tableOfficial: "none",
                                                                        state: "created"
                                                                    };
                                                                    matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                                        assert.equal(msg, "El nombre del equipo visitante no existe");

                                                                        describe('Equal local and visitor teams', function () {
                                                                            var correctMatch = {
                                                                                localTeam: "test",
                                                                                visitorTeam: "test",
                                                                                quartersNumber: 4,
                                                                                durationQuarter: 60,
                                                                                runningTime: "false",
                                                                                timeout: 0,
                                                                                maxPersonalFouls: 0,
                                                                                date: "2020-01-01",
                                                                                time: "00:00",
                                                                                matchCourt: "test",
                                                                                tableOfficial: "none",
                                                                                state: "created"
                                                                            };
                                                                            matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                                                assert.equal(msg, "Los nombres de los equipos son iguales");

                                                                                describe('Incorrect running time', function () {
                                                                                    var correctMatch = {
                                                                                        localTeam: "test",
                                                                                        visitorTeam: "test2",
                                                                                        quartersNumber: 4,
                                                                                        durationQuarter: 60,
                                                                                        runningTime: "",
                                                                                        timeout: 0,
                                                                                        maxPersonalFouls: 0,
                                                                                        date: "2020-01-01",
                                                                                        time: "00:00",
                                                                                        matchCourt: "test",
                                                                                        tableOfficial: "none",
                                                                                        state: "created"
                                                                                    };
                                                                                    matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                                                        assert.equal(msg, "La opción de tiempo corrido no está bien seleccionada");

                                                                                        describe('Running time true', function(){
                                                                                            var correctMatch = {
                                                                                                localTeam: "test",
                                                                                                visitorTeam: "test2",
                                                                                                quartersNumber: 4,
                                                                                                durationQuarter: 60,
                                                                                                runningTime: "true",
                                                                                                timeout: 0,
                                                                                                maxPersonalFouls: 0,
                                                                                                date: "2020-01-01",
                                                                                                time: "00:00",
                                                                                                matchCourt: "test",
                                                                                                tableOfficial: "none",
                                                                                                state: "created"
                                                                                            };
                                                                                            matchValidationManager.matchCreation(correctMatch, function(msg){
                                                                                                assert.equal(msg, null);

                                                                                                describe('Running time false', function(){
                                                                                                    var correctMatch = {
                                                                                                        localTeam: "test",
                                                                                                        visitorTeam: "test2",
                                                                                                        quartersNumber: 4,
                                                                                                        durationQuarter: 60,
                                                                                                        runningTime: "false",
                                                                                                        timeout: 0,
                                                                                                        maxPersonalFouls: 0,
                                                                                                        date: "2020-01-01",
                                                                                                        time: "00:00",
                                                                                                        matchCourt: "test",
                                                                                                        tableOfficial: "none",
                                                                                                        state: "created"
                                                                                                    };
                                                                                                    matchValidationManager.matchCreation(correctMatch, function(msg){
                                                                                                        assert.equal(msg, null);

                                                                                                        describe('Negative timeouts', function () {
                                                                                                            var correctMatch = {
                                                                                                                localTeam: "test",
                                                                                                                visitorTeam: "test2",
                                                                                                                quartersNumber: 4,
                                                                                                                durationQuarter: 60,
                                                                                                                runningTime: "true",
                                                                                                                timeout: -1,
                                                                                                                maxPersonalFouls: 0,
                                                                                                                date: "2020-01-01",
                                                                                                                time: "00:00",
                                                                                                                matchCourt: "test",
                                                                                                                tableOfficial: "none",
                                                                                                                state: "created"
                                                                                                            };
                                                                                                            matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                                                                                assert.equal(msg, "El número de tiempos muertos no puede ser negativo");

                                                                                                                describe('Timeouts empty', function () {
                                                                                                                    var correctMatch = {
                                                                                                                        localTeam: "test",
                                                                                                                        visitorTeam: "test2",
                                                                                                                        quartersNumber: 4,
                                                                                                                        durationQuarter: 60,
                                                                                                                        runningTime: "true",
                                                                                                                        timeout: "",
                                                                                                                        maxPersonalFouls: 0,
                                                                                                                        date: "2020-01-01",
                                                                                                                        time: "00:00",
                                                                                                                        matchCourt: "test",
                                                                                                                        tableOfficial: "none",
                                                                                                                        state: "created"
                                                                                                                    };
                                                                                                                    matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                                                                                        assert.equal(msg, "Número de tiempos muertos vacío");

                                                                                                                        describe('Negative max personal fouls', function () {
                                                                                                                            var correctMatch = {
                                                                                                                                localTeam: "test",
                                                                                                                                visitorTeam: "test2",
                                                                                                                                quartersNumber: 4,
                                                                                                                                durationQuarter: 60,
                                                                                                                                runningTime: "true",
                                                                                                                                timeout: 1,
                                                                                                                                maxPersonalFouls: -1,
                                                                                                                                date: "2020-01-01",
                                                                                                                                time: "00:00",
                                                                                                                                matchCourt: "test",
                                                                                                                                tableOfficial: "none",
                                                                                                                                state: "created"
                                                                                                                            };
                                                                                                                            matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                                                                                                assert.equal(msg, "El número de máximo de faltas personales no puede ser negativo");

                                                                                                                                describe('Max personal fouls empty', function () {
                                                                                                                                    var correctMatch = {
                                                                                                                                        localTeam: "test",
                                                                                                                                        visitorTeam: "test2",
                                                                                                                                        quartersNumber: 4,
                                                                                                                                        durationQuarter: 60,
                                                                                                                                        runningTime: "true",
                                                                                                                                        timeout: 1,
                                                                                                                                        maxPersonalFouls: "",
                                                                                                                                        date: "2020-01-01",
                                                                                                                                        time: "00:00",
                                                                                                                                        matchCourt: "test",
                                                                                                                                        tableOfficial: "none",
                                                                                                                                        state: "created"
                                                                                                                                    };
                                                                                                                                    matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                                                                                                        assert.equal(msg, "Máximo de faltas personales vacío");

                                                                                                                                        describe('Nonexistent court', function () {
                                                                                                                                            var correctMatch = {
                                                                                                                                                localTeam: "test",
                                                                                                                                                visitorTeam: "test2",
                                                                                                                                                quartersNumber: 4,
                                                                                                                                                durationQuarter: 60,
                                                                                                                                                runningTime: "true",
                                                                                                                                                timeout: 1,
                                                                                                                                                maxPersonalFouls: 1,
                                                                                                                                                date: "2020-01-01",
                                                                                                                                                time: "00:00",
                                                                                                                                                matchCourt: "",
                                                                                                                                                tableOfficial: "none",
                                                                                                                                                state: "created"
                                                                                                                                            };
                                                                                                                                            matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                                                                                                                assert.equal(msg, "El nombre del lugar no existe");

                                                                                                                                                describe('Date empty', function () {
                                                                                                                                                    var correctMatch = {
                                                                                                                                                        localTeam: "test",
                                                                                                                                                        visitorTeam: "test2",
                                                                                                                                                        quartersNumber: 4,
                                                                                                                                                        durationQuarter: 60,
                                                                                                                                                        runningTime: "true",
                                                                                                                                                        timeout: 1,
                                                                                                                                                        maxPersonalFouls: 1,
                                                                                                                                                        date: "",
                                                                                                                                                        time: "00:00",
                                                                                                                                                        matchCourt: "test",
                                                                                                                                                        tableOfficial: "none",
                                                                                                                                                        state: "created"
                                                                                                                                                    };
                                                                                                                                                    matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                                                                                                                        assert.equal(msg, "La fecha está vacía");

                                                                                                                                                        describe('Time empty', function () {
                                                                                                                                                            var correctMatch = {
                                                                                                                                                                localTeam: "test",
                                                                                                                                                                visitorTeam: "test2",
                                                                                                                                                                quartersNumber: 4,
                                                                                                                                                                durationQuarter: 60,
                                                                                                                                                                runningTime: "true",
                                                                                                                                                                timeout: 1,
                                                                                                                                                                maxPersonalFouls: 1,
                                                                                                                                                                date: "2020-01-01",
                                                                                                                                                                time: "",
                                                                                                                                                                matchCourt: "test",
                                                                                                                                                                tableOfficial: "none",
                                                                                                                                                                state: "created"
                                                                                                                                                            };
                                                                                                                                                            matchValidationManager.matchCreation(correctMatch, function (msg) {
                                                                                                                                                                assert.equal(msg, "La hora está vacía");

                                                                                                                                                                console.log("FINISH MATCH VALIDATION TEST");
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