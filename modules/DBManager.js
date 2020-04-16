module.exports = {

    mongo: null,
    app: null,

    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },

    resetDB : function (funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var users=db.collection('users');
                var teams=db.collection('teams');
                var coaches=db.collection('coaches');
                var players=db.collection('players');
                var matches=db.collection('matches');
                var events=db.collection('events');
                users.remove({});
                teams.remove({});
                coaches.remove({});
                players.remove({});
                matches.remove({});
                events.remove({});
            }
        });
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
    getTeams : function(criterion, funcionCallback){
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

    getCoaches : function(criterion,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('coaches');
                collection.find(criterion).toArray(function(err, coaches) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(coaches);
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

    //Matches management
    getMatches : function(criterion,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('matches');
                collection.find(criterion).toArray(function(err, matches) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(matches);
                    }
                    db.close();
                });
            }
        });
    },

    insertMatch : function(match, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('matches');
                collection.insert(match, function(err, result) {
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

    modifyMatch : function(criterion, match, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('matches');
                collection.update(criterion, {$set: match}, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },

    //API: Gestión de eventos
    insertEvent : function(event, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('events');
                collection.insert(event, function(err, result) {
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