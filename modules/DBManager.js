/**
 * @description Database module manager
 * @module modules/DBManager
 * @type {{mongo: null, app: null, insertTeam: module.exports.insertTeam, init: module.exports.init, insertPlayer: module.exports.insertPlayer, modifyMatch: module.exports.modifyMatch, deleteTeam: module.exports.deleteTeam, resetDB: module.exports.resetDB, insertCoach: module.exports.insertCoach, insertEvent: module.exports.insertEvent, getTeams: module.exports.getTeams, getEvents: module.exports.getEvents, insertUser: module.exports.insertUser, recordMatch: module.exports.recordMatch, getUsers: module.exports.getUsers, getMatches: module.exports.getMatches, getCoaches: module.exports.getCoaches, getRecords: module.exports.getRecords, getPlayers: module.exports.getPlayers, insertMatch: module.exports.insertMatch}}
 */
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
                var records=db.collection('records');
                users.remove({});
                teams.remove({});
                coaches.remove({});
                players.remove({});
                matches.remove({});
                events.remove({});
                records.remove({});
            }
        });
    },

    //Users management

    /**
     * Get users by a given criteria
     * @param {JSON} criterion for filtering
     * @param {function} funcionCallback
     */
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

    /**
     * Insert an user
     * @param {JSON} user to insert
     * @param {function} funcionCallback
     */
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

    /**
     * Get teams by a given criteria
     * @param {JSON} criterion for filtering
     * @param {function} funcionCallback
     */
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

    /**
     * Insert a team
     * @param {JSON} team to insert
     * @param {function} funcionCallback
     */
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

    /**
     * Get coaches by a given criteria
     * @param {JSON} criterion for filtering
     * @param {function} funcionCallback
     */
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

    /**
     * Insert a coach
     * @param {JSON} coach to insert
     * @param {function} funcionCallback
     */
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

    /**
     * Get players by a given criteria
     * @param {JSON} criterion for filtering
     * @param {function} funcionCallback
     */
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

    /**
     * Insert a player
     * @param {JSON} player to insert
     * @param {function} funcionCallback
     */
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

    /**
     * Delete a team by a given criteria
     * @param {JSON} criterion for filtering
     * @param {function} funcionCallback
     */
    deleteTeam : function(criterion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('teams');
                collection.remove(criterion, function (err, result) {
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

    //Matches management

    /**
     * Get matches by a given criteria
     * @param {JSON} criterion for filtering
     * @param {function} funcionCallback
     */
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

    /**
     * Insert a match
     * @param {JSON} match to insert
     * @param {function} funcionCallback
     */
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

    /**
     * Modify a match
     * @param {JSON} criterion to find the match
     * @param {JSON} match to modify
     * @param {function} funcionCallback
     */
    modifyMatch : function(criterion, match, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('matches');
                collection.update(criterion, match, function(err, result) {
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

    /**
     * Insert summary of a player in a match
     * @param {JSON} record summary to insert
     * @param {function} funcionCallback
     */
    recordMatch : function(record, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('records');
                collection.insert(record, function(err, result) {
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

    //API: Gestión de eventos

    /**
     * Insert an event from a match
     * @param {JSON} event to insert
     * @param {function} funcionCallback
     */
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
                        funcionCallback(result.ops[0]);
                    }
                    db.close();
                });
            }
        });
    },

    /**
     * Get events by a given criteria
     * @param {JSON} criterion for filtering
     * @param {function} funcionCallback
     */
    getEvents : function(criterion,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('events');
                collection.find(criterion).toArray(function(err, events) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(events);
                    }
                    db.close();
                });
            }
        });
    },

    /**
     * Get summary of a player from a match
     * @param {JSON} criterion for filtering
     * @param {function} funcionCallback
     */
    getRecords : function(criterion,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('records');
                collection.find(criterion).toArray(function(err, events) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(events);
                    }
                    db.close();
                });
            }
        });
    },

};