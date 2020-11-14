/**
 * @description Team validator
 * @module modules/teamValidationManager
 * @type {{app: null, teamCreation: module.exports.teamCreation, init: module.exports.init, DBManager: null, playerAddition: module.exports.playerAddition, message: null, coachAddition: module.exports.coachAddition}}
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
     * Validation for creating a team
     * @param {JSON} team to create
     * @param {function} funcionCallback
     */
    teamCreation : function(team,funcionCallback) {
        this.DBManager.getTeams({teamName:team.teamName}, function(teams) {
            if (teams.length > 0)
                this.message="El nombre de equipo ya existe";
            if (team.teamName === "")
                this.message="Campo nombre de equipo vacio";
            if(team.teamCourt==="")
                this.message="Campo cancha vacio";
            funcionCallback(this.message);
        });
        this.message=null;
    },

    /**
     * Validation for creating a coach
     * @param {JSON} coach to create
     * @param {function} funcionCallback
     */
    coachAddition : function(coach,funcionCallback) {
        this.DBManager.getTeams({teamName : coach.teamName}, function(teams) {
            if (teams.length === 0)
                this.message = "El equipo no existe";
            else if (coach.coachName === "")
                this.message = "Campo nombre de entrenador vacio";
            else
                this.message = null;
            funcionCallback(this.message);
        });
        this.message=null;
    },

    /**
     * Validation for creating a player
     * @param {JSON} player to create
     * @param {function} funcionCallback
     */
    playerAddition : function(player,funcionCallback) {
        var dbManager = this.DBManager;
        var msg = this.message;

        this.DBManager.getPlayers({teamName:player.teamName , playerBib:parseInt(player.playerBib)}, function(players) {
            dbManager.getTeams({teamName: player.teamName} , function(teams){
                if (players.length > 0 && player.playerBib!=="")
                    msg = "El dorsal ya existe en ese equipo";
                else if (teams.length == 0)
                    msg = "El equipo no existe";
                else if (player.playerName == "")
                    msg = "Campo nombre de jugador vacio";
                else if (player.playerBib < 0)
                    msg = "Dorsal negativo";
                else if (player.playerBib > 99)
                    msg = "Dorsal mayor que 99";
                else
                    msg = null;
                funcionCallback(msg);
            });
        });
        this.message=null;
    },

};