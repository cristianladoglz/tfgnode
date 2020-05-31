/**
 * @module routes/rhome
 * @param app
 * @param swig
 * @param DBManager
 */
module.exports = function(app, swig, DBManager) {

    function showView(file, variables, session){
        variables["user"]=session.user;
        return swig.renderFile(file, variables);
    }

    /**
     * Go to the main view if there is an user in session or redirect to login
     */
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