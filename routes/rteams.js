module.exports = function(app, swig, DBManager, validationManager) {

    function showView(file, variables, session){
        variables["user"]=session.user;
        return swig.renderFile(file, variables);
    }

    app.get("/team/add", function(req,res) {
        var respuesta = swig.renderFile('views/addTeam.html', { user: req.session.usuario });
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
                    } else {
                        res.redirect("/player/add");
                    }
                });
            }
        });
    });

}