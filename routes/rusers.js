module.exports = function(app, swig, DBManager, validationManager) {

    function showView(file, variables, session){
        variables["user"]=session.user;
        return swig.renderFile(file, variables);
    }

    app.get("/registro", function(req, res) {
        var response = showView('views/signUp.html', {}, req.session);
        res.send(response);
    });

    app.post("/user", function(req, res) {
        var validateUser = {
            userName : req.body.userName,
            password : req.body.password,
            passwordConfirm: req.body.passwordConfirm
        };

        validationManager.userRegister(validateUser,function(message){
            if(message!=null) {
                res.redirect("/registro" +
                    "?message=" + message +
                    "&messageType=alert-danger");
            }else {

                var lock = app.get("crypto").createHmac('sha256', app.get('clave'))
                    .update(req.body.password).digest('hex');
                var user = {
                    userName: req.body.userName,
                    password: lock
                };

                DBManager.insertUser(user, function (id) {
                    if (id == null) {
                        res.redirect("/registro?message=Error al registrar usuario");
                    } else {
                        res.redirect("/");
                    }
                });
            }
        });
    });

};