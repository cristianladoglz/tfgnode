module.exports = function(app, swig) {

    function showView(file, variables, session){
        variables["user"]=session.user;
        return swig.renderFile(file, variables);
    }

    app.get("/", function(req, res) {
        var response = showView('views/base.html', {}, req.session);
        res.send(response);
    });

};