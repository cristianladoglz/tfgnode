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

};