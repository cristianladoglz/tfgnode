/**
 * @description User validator
 * @module modules/userValidationManager
 * @type {{app: null, init: module.exports.init, DBManager: null, userRegister: module.exports.userRegister, message: null, login: module.exports.login}}
 */
module.exports = {

    DBManager: null,
    app: null,
    message: null,

    init: function (app, DBManager) {
        this.DBManager = DBManager;
        this.app = app;
    },

    /**
     * Validation for register an user
     * @param {JSON} user to register
     * @param {function} funcionCallback
     */
    userRegister : function(user, funcionCallback) {
        this.DBManager.getUsers({userName:user.userName}, function(users) {
            if (users.length > 0)
                this.message = "El nombre de usuario ya existe";
            if (user.userName === "")
                this.message="Campo nombre de usuario vacío";
            if(user.password==="")
                this.message="Campo contraseña vacío";
            if (user.password !== user.passwordConfirm)
                this.message="Las contraseñas no coinciden";
            funcionCallback(this.message);
            this.message=null;
        });
    },

    /**
     * Validation for login an user
     * @param {JSON} user to login
     * @param {function} funcionCallback
     */
    login : function(user, funcionCallback) {
        this.message = null;
        this.DBManager.getUsers({userName: user.userName}, function(users) {
            this.message = null;
           if(users.length === 0)
               this.message="Usuario o password incorrecto";
            if(users[0] != null || users[0] != undefined)
                if(user.password !== users[0].password)
                    this.message="Usuario o password incorrecto";
           if(user.userName === "")
               this.message="Campo nombre de usuario vacío";
           if(user.password === "")
               this.message="Campo contraseña vacío";
           funcionCallback(this.message, users[0]);
           this.message=null;
        });
    },

};