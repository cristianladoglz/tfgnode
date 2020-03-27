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
                var respuesta = showView('views/addMatch.html', {teams: teams}, req.session);
                res.send(respuesta);
            }
        });
    });

    app.post("/match", function(req, res) {
        var validateMatch = {
            localTeam : req.body.local.valueOf(),
            visitorTeam : req.body.visitor.valueOf(),
            matchCourt : req.body.courtSelect.valueOf()
        };

        validationManager.matchCreation(validateMatch,function(message){
            if(message!=null) {
                res.redirect("/match/add" +
                    "?message=" + message +
                    "&messageType=alert-danger");
            }else {

                var tableOfficial="";
                var court="";

                console.log(req.body.court);

                if(req.body.tableOfficial.valueOf()!=="none")
                    tableOfficial=req.body.tableOfficial.valueOf().toString();

                if(req.body.courtSelect.valueOf()==="otro")
                    court=req.body.court;

                var match = {
                    localTeam : req.body.local.valueOf(),
                    visitorTeam : req.body.visitor.valueOf(),
                    quartersNumber : req.body.quarter,
                    durationQuarter : req.body.duration,
                    timeOuts : req.body.timeOut,
                    maxPersonalFouls : req.body.personalFoul,
                    date : req.body.date,
                    time : req.body.time,
                    court : court,
                    tableOfficial : tableOfficial
                };

                DBManager.insertMatch(match, function (id) {
                    if (id == null) {
                        res.redirect("/match/add?message=Error al insertar partido");
                    } else {
                        res.redirect("/match/add?message=Partido creado correctamente");
                    }
                });
            }
        });
    });

};