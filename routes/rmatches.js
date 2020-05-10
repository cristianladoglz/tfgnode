module.exports = function(app, swig, DBManager, validationManager) {

    function showView(file, variables, session){
        variables["user"]=session.user;
        return swig.renderFile(file, variables);
    }

    app.get("/match/add", function(req, res) {
        var criterion={};

        DBManager.getTeams(criterion, function(teams){
            if (teams == null) {
                res.send("Error al obtener equipos");
            } else {
                DBManager.getUsers(criterion, function(users){
                    if(users == null){
                        res.send("Error al obtener usuarios");
                    } else {
                        var response = showView('views/addMatch.html', {teams: teams, users: users}, req.session);
                        res.send(response);
                    }
                });
            }
        });
    });

    app.post("/match", function(req, res) {
        var validateMatch = {
            localTeam : req.body.local.valueOf(),
            visitorTeam : req.body.visitor.valueOf(),
            matchCourt : req.body.courtSelect.valueOf(),
            runningTime : req.body.runningTime.valueOf()
        };

        validationManager.matchCreation(validateMatch,function(message){
            if(message!=null) {
                res.redirect("/match/add" +
                    "?message=" + message +
                    "&messageType=alert-danger");
            }else {

                var tableOfficial="";
                var court=req.body.courtSelect.valueOf();

                if(req.body.tableOfficial.valueOf()!=="none")
                    tableOfficial=req.body.tableOfficial.valueOf().toString();

                if(court==="otro")
                    court=req.body.court;

                var runningTime = req.body.runningTime.valueOf() === "true";

                var match = {
                    localTeam : req.body.local.valueOf(),
                    visitorTeam : req.body.visitor.valueOf(),
                    quartersNumber : parseInt(req.body.quarter),
                    durationQuarter : parseInt(req.body.duration),
                    runningTime : runningTime,
                    timeOuts : parseInt(req.body.timeOut),
                    maxPersonalFouls : parseInt(req.body.personalFoul),
                    date : req.body.date,
                    time : req.body.time,
                    matchCourt : court,
                    tableOfficial : tableOfficial,
                    userName : req.session.user.userName,
                    followers : [],
                    state : "created"
                };

                DBManager.insertMatch(match, function (id) {
                    if (id == null) {
                        res.redirect("/match/add?message=Error al insertar partido");
                    } else {
                        res.redirect("/match/mine?message=Partido creado correctamente");
                    }
                });
            }
        });
    });

    app.get("/match/mine", function(req, res) {
        var criterion={userName: req.session.user.userName};

        DBManager.getMatches(criterion, function(matches) {
            if (matches == null) {
                res.send("Error al listar partidos");
            } else {
                var respuesta = showView('views/myMatches.html', {matches : matches}, req.session);
                res.send(respuesta);
            }
        });
    });

    app.get('/match/activate/:id', function (req, res) {
        var matchId = DBManager.mongo.ObjectID(req.params.id);
        var user = req.session.user;
        var criterion={ _id: matchId };

        DBManager.getMatches(criterion, function(matches){
            var matchCriterion = { _id: matchId };
            DBManager.modifyMatch(matchCriterion, { $set : { state : "active" } }, function (result) {
                if (result == null) {
                    res.send("Error al actualizar el partido como activo");
                } else {
                    res.redirect("/match/mine");
                }
            });
        });
    });

    app.get('/match/modify/:id', function (req, res) {
        var matchId = DBManager.mongo.ObjectID(req.params.id);
        var user = req.session.usuario;
        var criterion = { _id : matchId };

        DBManager.getMatches(criterion, function(matches){
            if(matches.length === 0)
                res.send("Error al obtener partido");

            var criterion={};

            DBManager.getTeams(criterion, function(teams){
                if (teams == null) {
                    res.send("Error al obtener equipos");
                } else {
                    DBManager.getUsers(criterion, function(users){
                        if(users == null){
                            res.send("Error al obtener usuarios");
                        } else {
                            var respuesta = showView('views/modifyMatch.html', {match: matches[0], teams: teams, users: users}, req.session);
                            res.send(respuesta);
                        }
                    });
                }
            });
        });
    });

    app.post("/match/:id", function(req, res) {
        var validateMatch = {
            localTeam : req.body.local.valueOf(),
            visitorTeam : req.body.visitor.valueOf(),
            matchCourt : req.body.courtSelect.valueOf(),
            runningTime : req.body.runningTime.valueOf()
        };

        validationManager.matchCreation(validateMatch,function(message){
            if(message!=null) {
                res.redirect("/match/add" +
                    "?message=" + message +
                    "&messageType=alert-danger");
            }else {

                var tableOfficial="";
                var court=req.body.courtSelect.valueOf();

                if(req.body.tableOfficial.valueOf()!=="none")
                    tableOfficial=req.body.tableOfficial.valueOf().toString();

                if(court==="otro")
                    court=req.body.court;

                var runningTime = req.body.runningTime.valueOf() === "true";

                var match = {
                    localTeam : req.body.local.valueOf(),
                    visitorTeam : req.body.visitor.valueOf(),
                    quartersNumber : parseInt(req.body.quarter),
                    durationQuarter : parseInt(req.body.duration),
                    runningTime : runningTime,
                    timeOuts : parseInt(req.body.timeOut),
                    maxPersonalFouls : parseInt(req.body.personalFoul),
                    date : req.body.date,
                    time : req.body.time,
                    matchCourt : court,
                    userName : req.session.user.userName,
                    followers : [],
                    tableOfficial : tableOfficial,
                    state : "created"
                };

                var matchId = DBManager.mongo.ObjectID(req.params.id);
                var matchCriterion = {"_id": matchId};
                DBManager.modifyMatch(matchCriterion, match, function (id) {
                    if (id == null) {
                        res.redirect("/match/modify/"+req.params.id+"?message=Error al modificar partido");
                    } else {
                        res.redirect("/match/mine?message=Partido modificado correctamente");
                    }
                });
            }
        });
    });

};