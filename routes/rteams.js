module.exports = function(app, swig, DBManager, validationManager) {

    function showView(file, variables, session){
        variables["user"]=session.user;
        return swig.renderFile(file, variables);
    }

    app.get("/team/add", function(req,res) {
        var respuesta = swig.renderFile('views/addTeam.html', { user: req.session.user });
        res.send(respuesta);
    });

    app.post("/team", function(req, res) {
        var validateTeam = {
            teamName : req.body.name,
            teamCourt : req.body.court
        };

        validationManager.teamCreation(validateTeam,function(message){
            if(message!=null) {
                res.redirect("/team/add" +
                    "?message=" + message +
                    "&messageType=alert-danger");
            }else {

                var team = {
                    teamName: req.body.name,
                    teamCourt: req.body.court
                };

                DBManager.insertTeam(team, function (id) {
                    if (id == null) {
                        res.redirect("/team/add?message=Error al crear equipo");
                    }
                    else {
                        res.redirect("/coach/add");
                    }
                });
            }
        });
    });

    app.get("/coach/add", function(req,res) {
        var criterion={};

        DBManager.getTeams(criterion, function(teams){
            if(teams == null){
                res.send("Error al obtener equipos");
            } else {
                var respuesta = showView('views/addCoach.html', {teams : teams.reverse()}, req.session);
                res.send(respuesta);
            }
        });
    });

    app.post("/coach", function(req, res) {
        var validateCoach = {
            coachName : req.body.coach,
            teamName : req.body.teamName
        };

        validationManager.coachAddition(validateCoach,function(message){
            if(message!=null) {
                res.redirect("/coach/add" +
                    "?message=" + message +
                    "&messageType=alert-danger");
            } else {

                var coach = {
                    teamName: req.body.teamName,
                    coachName: req.body.coach
                };

                DBManager.insertCoach(coach, function (id) {
                    if (id == null) {
                        res.redirect("/coach/add?message=Error al insertar entrenador");
                    } else {
                        res.redirect("/player/add?message=Entrenador añadido");
                    }
                });
            }
        });
    });

    app.get("/player/add", function(req,res) {
        var criterion={};

        DBManager.getTeams(criterion, function(teams){
            if(teams == null){
                res.send("Error al obtener equipos");
            } else {
                var respuesta = showView('views/addPlayer.html', {teams: teams.reverse()}, req.session);
                res.send(respuesta);
            }
        });
    });

    app.post("/player", function(req, res) {
        var validatePlayer = {
            playerName : req.body.player,
            teamName : req.body.teamName,
            playerBib : req.body.bib
        };

        validationManager.playerAddition(validatePlayer,function(message){
            if(message!=null) {
                res.redirect("/player/add" +
                    "?message=" + message +
                    "&messageType=alert-danger");
            }else {

                var player = {
                    teamName : req.body.teamName,
                    playerName : req.body.player,
                    playerBib : parseInt(req.body.bib)
                };

                DBManager.insertPlayer(player, function (id) {
                    if (id == null) {
                        res.redirect("/player/add?message=Error al insertar jugador");
                    } else {
                        res.redirect("/player/add?message=Jugador añadido");
                    }
                });
            }
        });
    });

    app.get("/team/list", function(req, res) {
        var criterion={};

        DBManager.getTeams(criterion, function(teams) {
            if (teams == null) {
                res.send("Error al listar equipos");
            } else {
                var respuesta = showView('views/listTeams.html', {teams: teams}, req.session);
                res.send(respuesta);
            }
        });
    });

    app.get('/team/delete/:id', function (req, res) {
        var criterion = {_id: DBManager.mongo.ObjectID(req.params.id)};
        DBManager.getTeams(criterion, function(teams){
            if(teams == null)
                res.send("Error al obtener equipos para eliminar");
            else{
                var teamName = {$or : [ { localTeam : teams[0].teamName } , { visitorTeam : teams[0].teamName } ]};
                DBManager.getMatches(teamName, function(matches){
                    if(matches == null)
                        res.send("Error al obtener partidos para eliminar equipo");
                    else if(matches.length>0)
                        res.redirect("/team/list?message=El equipo está en algún partido");
                    else{
                        DBManager.deleteTeam(criterion, function (teams) {
                            if (teams == null) {
                                res.send("Error al eliminar");
                            } else {
                                res.redirect("/team/list");
                            }
                        });
                    }
                });
            }
        });
    });

};