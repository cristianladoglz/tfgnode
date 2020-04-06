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

};