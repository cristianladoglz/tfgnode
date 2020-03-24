module.exports = {

    DBManager: null,
    app: null,
    message: null,

    init: function (app, DBManager) {
        this.DBManager = DBManager;
        this.app = app;
    },

    teamCreation : function(team,funcionCallback) {
        this.DBManager.getTeams({teamName:team.teamName , teamCourt:team.teamCourt}, function(teams) {
            if (teams.length > 0)
                this.message="El nombre de equipo ya existe";
            if (team.teamName === "")
                this.message="Campo nombre de equipo vacio";
            if(team.teamCourt==="")
                this.message="Campo cancha vacio";
            funcionCallback(this.message);
            this.message=null;
        });
    },

    playerAddition : function(player,funcionCallback) {
        this.DBManager.getPlayers({teamName:player.teamName , playerBib:player.playerBib}, function(players) {
            if (players.length > 0)
                this.message="El dorsal ya existe en ese equipo";
            if (player.playerName === "")
                this.message="Campo jugador vacio";
            if (player.teamName === "")
                this.message="Campo equipo vacio";
            funcionCallback(this.message);
            this.message=null;
        });
    },

};