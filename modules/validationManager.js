module.exports = {

    DBManager: null,
    app: null,
    message: null,

    init: function (app, DBManager) {
        this.DBManager = DBManager;
        this.app = app;
    },

    userRegister : function(user,funcionCallback) {
        this.DBManager.getUsers({userName:user.userName}, function(users) {
            if (users.length > 0)
                this.message="El nombre de usuario ya existe";
            if (user.userName === "")
                this.message="Campo nombre de usuario vacio";
            if(user.password==="")
                this.message="Campo contraseña vacio";
            if (user.password !== user.passwordConfirm)
                this.message="Las contraseñas no coinciden";
            funcionCallback(this.message);
            this.message=null;
        });
    },

};