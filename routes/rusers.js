module.exports = function(app, swig, DBManager, validationManager) {

    function showView(file, variables, session){
        variables["user"]=session.user;
        return swig.renderFile(file, variables);
    }

    /**
     * Go to the sign up view
     */
    app.get("/registro", function(req, res) {
        var response = showView('views/signUp.html', {}, req.session);
        res.send(response);
    });

    /**
     * Register an user with values from the form
     */
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
                        req.session.user = user;
                        res.redirect("/");
                    }
                });
            }
        });
    });

    /**
     * Go to the sign in view
     */
    app.get("/inicioSesion", function(req, res) {
        var response = showView('views/signIn.html', {}, req.session);
        res.send(response);
    });

    /**
     * Login an user with values from the form
     */
    app.post("/signIn", function(req, res) {
        var lock = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var validateUser = {
            userName : req.body.userName,
            password : lock
        };
        validationManager.login(validateUser, function(message, user) {
            if (message != null) {
                req.session.user = null;
                res.redirect("/inicioSesion" +
                    "?message=" + message +
                    "&messageType=alert-danger");
            } else {
                req.session.user = user;
                res.redirect("/");
            }
        });
    });

    /**
     * Remove session user and go to login view
     */
    app.get('/cerrarSesion', function (req, res) {
        req.session.user = null;
        res.redirect("/inicioSesion");
    });

};