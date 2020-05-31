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
     * @param team to create
     * @param funcionCallback
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
     * @param coach to create
     * @param funcionCallback
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
     * @param player to create
     * @param funcionCallback
     */
    playerAddition : function(player,funcionCallback) {
        var dbManager = this.DBManager;
        var msg = this.message;

        this.DBManager.getPlayers({teamName:player.teamName , playerBib:parseInt(player.playerBib)}, function(players) {
            dbManager.getTeams({teamName: player.teamName} , function(teams){
                if (players.length > 0)
                    msg = "El dorsal ya existe en ese equipo";
                else if (teams.length == 0)
                    msg = "El equipo no existe";
                else if (player.playerName == "")
                    msg = "Campo nombre de jugador vacio";
                else if (player.playerBib == "")
                    msg = "Campo dorsal vacio";
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