var assert = require('assert');
var appjs = require("../../app.js");

var DBManager = require("../../modules/DBManager.js");
DBManager.init(appjs.app, appjs.mongo);

var userValidationManager = require("../../modules/userValidationManager.js");
userValidationManager.init(appjs.app,DBManager);

describe('Team creation', function() {
    describe('Correct sign up', function() {
        it('message should be null', function() {
            var correctUser = { userName: "correctUser", password: "1234", passwordConfirm: "1234" };
            userValidationManager.userRegister(correctUser, function(msg){
                assert.equal(msg, null);

                describe('Empty user name', function() {
                    var emptyUserName = { userName: "", password: "1234", passwordConfirm: "1234" };
                    userValidationManager.userRegister(emptyUserName, function(msg){
                        assert.equal(msg, "Campo nombre de usuario vacío");

                        describe('Existing user name', function() {
                            var existingUser = { userName: "test", password: "1234", passwordConfirm: "1234" };
                            userValidationManager.userRegister(existingUser, function(msg){
                                assert.equal(msg, "El nombre de usuario ya existe");

                                describe('Empty password', function() {
                                    var emptyPassword = { userName: "test2", password: "", passwordConfirm: "" };
                                    userValidationManager.userRegister(emptyPassword, function(msg){
                                        assert.equal(msg, "Campo contraseña vacío");

                                        describe('Password confirm different', function() {
                                            var passwordConfirmDifferent = { userName: "test2", password: "1234", passwordConfirm: "1235" };
                                            userValidationManager.userRegister(passwordConfirmDifferent, function(msg){
                                                assert.equal(msg, "Las contraseñas no coinciden");

                                                describe('Empty password confirm', function() {
                                                    var emptyPasswordConfirm = { userName: "test2", password: "1234", passwordConfirm: "" };
                                                    userValidationManager.userRegister(emptyPasswordConfirm, function(msg){
                                                        assert.equal(msg, "Las contraseñas no coinciden");

                                                        describe('Correct login', function() {
                                                            var correctLogin = { userName: "test", password: "1392542397501e1158418adae09d694ffb8ed833a3a5e8a017e15ba565d28c70" };
                                                            userValidationManager.login(correctLogin, function(msg){
                                                                assert.equal(msg, null);

                                                                describe('Empty user name login', function() {
                                                                    var emptyUserName = { userName: "", password: "test" };
                                                                    userValidationManager.login(emptyUserName, function(msg){
                                                                        assert.equal(msg, "Campo nombre de usuario vacío");

                                                                        describe('Nonexisting user name', function() {
                                                                            var nonexistingUser = { userName : "test2",
                                                                                password : "test" };
                                                                            userValidationManager.login(nonexistingUser, function(msg){
                                                                                assert.equal(msg, "Usuario o password incorrecto");

                                                                                describe('Empty password', function() {
                                                                                    var emptyPassword = { userName : "test",
                                                                                        password : "" };
                                                                                    userValidationManager.login(emptyPassword, function(msg){
                                                                                        assert.equal(msg, "Campo contraseña vacío");

                                                                                        describe('Incorrect password', function() {
                                                                                            var incorrectPassword = { userName : "test",
                                                                                                password : "1234" };
                                                                                            userValidationManager.login(incorrectPassword, function(msg){
                                                                                                assert.equal(msg, "Usuario o password incorrecto");

                                                                                                console.log("FINISH USER VALIDATION TEST");
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});