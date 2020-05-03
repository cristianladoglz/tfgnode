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
     * Return a list with all matches visible
     */
    app.get("/api/allMatchesVisible", function(req, res) {
        var criterion = {
            state: {$ne: "created"}
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
                    '"allMatchesVisible":'+
                    JSON.stringify(matches)+
                    "}");
            }
        });
    });

    /**
     * Return the team id
     */
    app.get("/api/team/:teamName", function(req, res) {
        var criterion = {
            teamName: req.params.teamName
        };

        DBManager.getTeams(criterion, function (teams) {
            if (teams == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                res.status(200);
                res.send("{"+
                    '"teams":'+
                    JSON.stringify(teams)+
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
     * Return a list with team coaches
     */
    app.get("/api/coaches/:teamName", function(req, res) {
        var criterion = {
            teamName: req.params.teamName
        };

        DBManager.getCoaches(criterion, function (coaches) {
            if (coaches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                res.status(200);
                res.send("{"+
                    '"coaches":'+
                    JSON.stringify(coaches)+
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
                var state={ $set : { state : "playing" } };
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

    //Record events

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
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var addPoints = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    points: parseInt(req.body.points),
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

    /**
     * Add new event subPoints
     */
    app.post("/api/sub/points", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var subPoints = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    points: parseInt(req.body.points),
                    eventType: "subPoints"
                };
                DBManager.insertEvent(subPoints, function (newEvent) {
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
     * Add new event addPersonalFoul
     */
    app.post("/api/add/personalFoul", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var addPersonalFoul = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "addPersonalFoul"
                };
                DBManager.insertEvent(addPersonalFoul, function (newEvent) {
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
     * Add new event subPersonalFoul
     */
    app.post("/api/sub/personalFoul", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var subPersonalFoul = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "subPersonalFoul"
                };
                DBManager.insertEvent(subPersonalFoul, function (newEvent) {
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
     * Add new event timeout
     */
    app.post("/api/add/timeout", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var timeout = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "timeout"
                };
                DBManager.insertEvent(timeout, function (newEvent) {
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
     * Add new event overAndBack
     */
    app.post("/api/add/overAndBack", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var overAndBack = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "overAndBack"
                };
                DBManager.insertEvent(overAndBack, function (newEvent) {
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
     * Add new event shotClock
     */
    app.post("/api/add/shotClock", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var shotClock = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "shotClock"
                };
                DBManager.insertEvent(shotClock, function (newEvent) {
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
     * Add new event eightSeconds
     */
    app.post("/api/add/eightSeconds", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var eightSeconds = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "eightSeconds"
                };
                DBManager.insertEvent(eightSeconds, function (newEvent) {
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
     * Add new event travelling
     */
    app.post("/api/add/travelling", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var travelling = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "travelling"
                };
                DBManager.insertEvent(travelling, function (newEvent) {
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
     * Add new event doouble
     */
    app.post("/api/add/double", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var double = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "double"
                };
                DBManager.insertEvent(double, function (newEvent) {
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
     * Add new event foot
     */
    app.post("/api/add/foot", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var foot = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "foot"
                };
                DBManager.insertEvent(foot, function (newEvent) {
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
     * Add new event fiveSeconds
     */
    app.post("/api/add/fiveSeconds", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var fiveSeconds = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "fiveSeconds"
                };
                DBManager.insertEvent(fiveSeconds, function (newEvent) {
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
     * Add new event threeSeconds
     */
    app.post("/api/add/threeSeconds", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var threeSeconds = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "threeSeconds"
                };
                DBManager.insertEvent(threeSeconds, function (newEvent) {
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
     * Add new event unsportmanlike
     */
    app.post("/api/add/unsportmanlike", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var unsportmanlike = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "unsportmanlike"
                };
                DBManager.insertEvent(unsportmanlike, function (newEvent) {
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
     * Add new event technicalFoul
     */
    app.post("/api/add/technicalFoul", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var technicalFoul = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "technicalFoul"
                };
                DBManager.insertEvent(technicalFoul, function (newEvent) {
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
     * Add new event finishQuarter
     */
    app.post("/api/add/finishQuarter", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var finishQuarter = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    quarter : req.body.quarter,
                    eventType: "finishQuarter"
                };
                DBManager.insertEvent(finishQuarter, function (newEvent) {
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
     * Add new event startQuarter
     */
    app.post("/api/add/startQuarter", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var startQuarter = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    quarter : req.body.quarter,
                    eventType: "startQuarter"
                };
                DBManager.insertEvent(startQuarter, function (newEvent) {
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
     * Add new event finish
     */
    app.post("/api/add/finish", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var finish = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    eventType: "finish"
                };
                DBManager.insertEvent(finish, function (newEvent) {
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
     * Finish a match
     */
    app.put("/api/finish/match/:id", function(req, res) {
        var criterion = {
            _id : DBManager.mongo.ObjectID(req.params.id)
        };

        DBManager.getMatches(criterion, function(matches){
            if(matches[0]!==null){
                var state={ $set : {
                    state : "finished",
                    localPoints : req.body.localPoints,
                    visitorPoints : req.body.visitorPoints }
                };
                DBManager.modifyMatch(criterion, state,function(result){
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error : "Se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje : "Partido finalizado"
                        })
                    }
                });
            }
        });
    });

    /**
     * Add new event substitution
     */
    app.post("/api/add/substitution", function(req, res) {
        DBManager.getMatches({ "_id" : DBManager.mongo.ObjectID(req.body.matchId)},function(matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var idPlayer = "";
                var idSubstitutor = "";

                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);
                if(req.body.substitutorId!=="")
                    idSubstitutor = DBManager.mongo.ObjectID(req.body.substitutorId);

                var substitution = {
                    matchId: DBManager.mongo.ObjectID(req.body.matchId),
                    time: req.body.time,
                    playerId: idPlayer,
                    playerName: req.body.playerName,
                    playerBib: req.body.playerBib,
                    substitutorId: idSubstitutor,
                    substitutorName: req.body.substitutorName,
                    substitutorBib: req.body.substitutorBib,
                    teamId: DBManager.mongo.ObjectID(req.body.teamId),
                    eventType: "substitution"
                };
                DBManager.insertEvent(substitution, function (newEvent) {
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
     * Record finish match summary
     */
    app.post("/api/record/match/:id", function(req, res) {
        var criterion = {
            _id : DBManager.mongo.ObjectID(req.params.id)
        };

        DBManager.getMatches(criterion, function(matches){
            if(matches[0]!==null){
                var idPlayer = "";
                if(req.body.playerId!=="")
                    idPlayer = DBManager.mongo.ObjectID(req.body.playerId);

                var record={
                    matchId : DBManager.mongo.ObjectID(req.params.id),
                    playerId : idPlayer,
                    playerName : req.body.playerName,
                    playerBib : req.body.playerBib,
                    teamId : DBManager.mongo.ObjectID(req.body.teamId),
                    points : req.body.points,
                    personalFouls : req.body.personalFouls,
                    technicalFouls : req.body.technicalFouls,
                    unsportmanlikeFouls : req.body.unsportmanlikeFouls
                };
                DBManager.recordMatch(record,function(result){
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error : "Se ha producido un error"
                        })
                    } else {
                        res.status(201);
                        res.send(JSON.stringify(record));
                    }
                });
            }
        });
    });

    //Follow matches

    /**
     * Return match events
     */
    app.get("/api/events/:id", function(req, res) {
        var criterion = {
            matchId : DBManager.mongo.ObjectID(req.params.id)
        };

        DBManager.getEvents(criterion, function (events) {
            if (events == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                res.status(200);
                res.send("{"+
                    '"events":'+
                    JSON.stringify(events)+
                    "}");
            }
        });
    });

    /**
     * Return match points of two teams
     */
    app.get("/api/points/:id", function(req, res) {
        var criterion = {
            matchId : DBManager.mongo.ObjectID(req.params.id),
            $or : [ { eventType : "addPoints" } , { eventType : "subPoints" } ]
        };

        DBManager.getEvents(criterion, function (events) {
            if (events == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                res.status(200);
                res.send("{"+
                    '"points":'+
                    JSON.stringify(events)+
                    "}");
            }
        });
    });

    //Users management

    /**
     * Return a list with users
     */
    app.get("/api/users", function(req, res) {
        var criterion = {
        };

        DBManager.getUsers(criterion, function (users) {
            if (users == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                res.status(200);
                res.send("{"+
                    '"users":'+
                    JSON.stringify(users)+
                    "}");
            }
        });
    });

    /**
     * Record user
     */
    app.post("/api/add/user", function(req, res) {
        var lock = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var user = {
            userName: req.body.userName,
            password: lock
        };

        DBManager.insertUser(user, function (id) {
            if (id == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                });
            } else {
                res.status(201);
                res.send(JSON.stringify(user));
            }
        });
    });

    /**
     * Return a user or no one if not exist
     */
    app.post("/api/user", function(req, res) {
        var lock = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        var criterion = {
            userName: req.body.userName,
            password: lock
        };

        DBManager.getUsers(criterion, function (users) {
            if (users == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                res.status(200);
                res.send("{"+
                    '"user":'+
                    JSON.stringify(users)+
                    "}");
            }
        });
    });

    /**
     * Add follower to a match
     */
    app.put("/api/add/follower/:id", function(req, res) {
        var criterion = {
            _id : DBManager.mongo.ObjectID(req.params.id)
        };

        DBManager.getMatches(criterion, function(matches){
            if(matches[0]!==null){
                var followers={ $push : { followers : req.body.userName } };
                DBManager.modifyMatch(criterion, followers,function(result){
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error : "Se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje : "Seguidor añadido"
                        })
                    }
                });
            }
        });
    });

    /**
     * Remove a follower from a match
     */
    app.put("/api/remove/follower/:id", function(req, res) {
        var criterion = {
            _id : DBManager.mongo.ObjectID(req.params.id)
        };

        DBManager.getMatches(criterion, function(matches){
            if(matches[0]!==null){
                var followers={ $pull : { followers : req.body.userName } };
                DBManager.modifyMatch(criterion, followers,function(result){
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error : "Se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje : "Seguidor eliminado"
                        })
                    }
                });
            }
        });
    });

    /**
     * Return a list with a match players summary
     */
    app.get("/api/records/:id", function(req, res) {
        var criterion = {
            _id : DBManager.mongo.ObjectID(req.params.id)
        };

        DBManager.getMatches(criterion, function (matches) {
            if (matches == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                });
            } else {
                var criterionRecord = { matchId : DBManager.mongo.ObjectID(req.params.id) }
                DBManager.getRecords(criterionRecord, function(records){
                    if(records == null){
                        res.status(500);
                        res.json({
                            error: "Se ha producido un error"
                        });
                    } else {
                        res.status(200);
                        res.send("{"+
                            '"records":'+
                            JSON.stringify(records)+
                            "}");
                    }
                });
            }
        });
    });

    io.on('connection', (socket) => {
        socket.on('event', function (event, points, teamId) {
            let  message = {
                "event" : event,
                "points" : points,
                "teamId" : teamId
            };

            io.emit("event", message);
        });
    });

};