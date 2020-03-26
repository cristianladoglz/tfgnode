module.exports = {

    mongo: null,
    app: null,

    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },

    //Users management
    getUsers : function(criterion,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('users');
                collection.find(criterion).toArray(function(err, users) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(users);
                    }
                    db.close();
                });
            }
        });
    },

    insertUser : function(user, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('users');
                collection.insert(user, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },

    //Teams management
    getTeams : function(criterion,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('teams');
                collection.find(criterion).toArray(function(err, teams) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(teams);
                    }
                    db.close();
                });
            }
        });
    },

    insertTeam : function(team, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('teams');
                collection.insert(team, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },

    insertCoach : function(coach, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('coaches');
                collection.insert(coach, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },

    getPlayers : function(criterion,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('players');
                collection.find(criterion).toArray(function(err, players) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(players);
                    }
                    db.close();
                });
            }
        });
    },

    insertPlayer : function(player, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('players');
                collection.insert(player, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },

};