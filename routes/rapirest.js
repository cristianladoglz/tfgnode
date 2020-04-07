module.exports = function(app, swig, DBManager, io) {

    /**
     * Return a list with active matches
     */
    app.get("/api/activeMatches", function(req, res) {
        var criterion = {
            state: "active"
        };

        DBManager.getMatches(criterion, function (matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                res.status(200);
                res.send("{"+
                    '"activeMatches":'+
                    JSON.stringify(matches)+
                    "}");
            }
        });
    });

    /**
     * Return a list with team players
     */
    app.get("/api/players/:teamName", function(req, res) {
        var criterion = {
            teamName: req.params.teamName
        };

        DBManager.getPlayers(criterion, function (players) {
            if (players == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                res.status(200);
                res.send("{"+
                    '"players":'+
                    JSON.stringify(players)+
                    "}");
            }
        });
    });

    /**
     * Start a match
     */
    app.put("/api/start/match/:id", function(req, res) {
        var criterion = {
            _id : DBManager.mongo.ObjectID(req.params.id)
        };

        DBManager.getMatches(criterion, function(matches){
            if(matches[0]!==null){
                var state={ state : "playing" };
                DBManager.modifyMatch(criterion, state,function(result){
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error : "Se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje : "Partido en juego"
                        })
                    }
                });
            }
        });
    });

    /**
     * Add new event start
     */
    app.post("/api/add/start", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var start = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    eventType: "start"
                };
                DBManager.insertEvent(start, function (newEvent) {
                    if (newEvent == null) {
                        res.status(500);
                        res.json({
                            error: "Se ha producido un error"
                        })
                    } else {
                        res.status(201);
                        res.send(JSON.stringify(newEvent));
                    }

                });
            }
        });
    });

    /**
     * Add new event stop
     */
    app.post("/api/add/stop", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var stop = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    eventType: "stop"
                };
                DBManager.insertEvent(stop, function (newEvent) {
                    if (newEvent == null) {
                        res.status(500);
                        res.json({
                            error: "Se ha producido un error"
                        })
                    } else {
                        res.status(201);
                        res.send(JSON.stringify(newEvent));
                    }

                });
            }
        });
    });

    /**
     * Add new event resume
     */
    app.post("/api/add/resume", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var resume = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    eventType: "resume"
                };
                DBManager.insertEvent(resume, function (newEvent) {
                    if (newEvent == null) {
                        res.status(500);
                        res.json({
                            error: "Se ha producido un error"
                        })
                    } else {
                        res.status(201);
                        res.send(JSON.stringify(newEvent));
                    }

                });
            }
        });
    });

    /**
     * Add new event addPoints
     */
    app.post("/api/add/points", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var addPoints = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    player: req.body.player,
                    points: req.body.points,
                    eventType: "addPoints"
                };
                DBManager.insertEvent(addPoints, function (newEvent) {
                    if (newEvent == null) {
                        res.status(500);
                        res.json({
                            error: "Se ha producido un error"
                        })
                    } else {
                        res.status(201);
                        res.send(JSON.stringify(newEvent));
                    }

                });
            }
        });
    });

};