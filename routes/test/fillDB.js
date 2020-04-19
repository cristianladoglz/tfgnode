module.exports = function(app, swig, DBManager) {
    app.get("/fillDB", function (req, res) {
        DBManager.resetDB(function () {
            res.send({reset: true});
        });

        //Users

        //Teams
        var team1 = {
            teamName: "Barça Lassa",
            teamCourt: "Palau"
        };

        var team2 = {
            teamName: "Real Madrid",
            teamCourt: "Palacio de los Deportes"
        };

        var team3 = {
            teamName: "Sanfer",
            teamCourt: "Colegio San Fernando"
        };

        var team4 = {
            teamName: "ADBA",
            teamCourt: "Polideportivo Quirinal"
        };

        var team5 = {
            teamName: "Llaranes",
            teamCourt: "La Toba"
        };

        var team6 = {
            teamName: "test",
            teamCourt: "test"
        };

        var team7 = {
            teamName: "test2",
            teamCourt: "test2"
        };

        //Coaches
        var coach1 = {
            teamName: "Sanfer",
            coachName: "Pablo"
        };

        var coach2 = {
            teamName: "Llaranes",
            coachName: "Suso"
        };

        //Players
        var player1 = {
            teamName : "Sanfer",
            playerName : "Cristian",
            playerBib : 23
        };

        var player2 = {
            teamName : "Sanfer",
            playerName : "Adrián",
            playerBib : 15
        };

        var player3 = {
            teamName : "Llaranes",
            playerName : "Dani",
            playerBib : 10
        };

        var player4 = {
            teamName : "test",
            playerName : "Test",
            playerBib : 0
        };

        //Matches
        var match1 = {
            localTeam : "ADBA",
            visitorTeam : "Barça Lassa",
            quartersNumber : 4,
            durationQuarter : 10,
            runningTime : false,
            timeOuts : 2,
            maxPersonalFouls : 5,
            date : "2020-10-23",
            time : "18:00",
            matchCourt : "Niemeyer",
            tableOfficial : "",
            state : "created"
        };

        var match2 = {
            localTeam : "Sanfer",
            visitorTeam : "ADBA",
            quartersNumber : 4,
            durationQuarter : 1,
            runningTime : false,
            timeOuts : 2,
            maxPersonalFouls : 5,
            date : "2020-04-10",
            time : "20:11",
            matchCourt : "Polideportivo Quirinal",
            tableOfficial : "",
            state : "active"
        };

        //Events


        DBManager.insertTeam(team1, function(){
            DBManager.insertTeam(team2, function(){
                DBManager.insertTeam(team3, function(){
                    DBManager.insertTeam(team4, function(){
                        DBManager.insertTeam(team5, function(){
                            DBManager.insertTeam(team6, function(){
                                DBManager.insertTeam(team7, function(){
                                    DBManager.insertCoach(coach1, function(){
                                        DBManager.insertCoach(coach2, function(){
                                            DBManager.insertPlayer(player1, function(){
                                                DBManager.insertPlayer(player2, function(){
                                                    DBManager.insertPlayer(player3, function(){
                                                        DBManager.insertPlayer(player4, function(){
                                                            DBManager.insertMatch(match1, function(){
                                                                DBManager.insertMatch(match2, function(){
                                                                    res.send({
                                                                        users: "usuarios insertados",
                                                                        teams: "equipos insertados",
                                                                        coaches: "entrenadores insertados",
                                                                        players: "jugadores insertados",
                                                                        matches: "partidos insertados",
                                                                        events: "eventos insertados",
                                                                        records: "historial insertado"
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
};