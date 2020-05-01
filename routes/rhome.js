module.exports = function(app, swig, DBManager) {

    function showView(file, variables, session){
        variables["user"]=session.user;
        return swig.renderFile(file, variables);
    }

    app.get("/", function(req, res) {
        if(req.session.user!=null) {
            var criterion = {userName: req.session.user.userName};

            DBManager.getMatches(criterion, function (matches) {
                if (matches == null) {
                    res.send("Error al listar partidos");
                } else {
                    var response = showView('views/myMatches.html', {matches : matches}, req.session);
                    res.send(response);
                }
            });
        } else
            res.redirect('/inicioSesion');
    });

};