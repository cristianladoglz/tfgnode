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

};