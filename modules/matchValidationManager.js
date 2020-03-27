module.exports = {

    DBManager: null,
    app: null,
    message: null,

    init: function (app, DBManager) {
        this.DBManager = DBManager;
        this.app = app;
    },

    matchCreation : function(match,funcionCallback) {
        var dbManager=this.DBManager;
        var msg=this.message;

        dbManager.getTeams({teamName: match.localTeam}, function (teams) {
            if (match.localTeam == match.visitorTeam) {
                msg = "Los nombres de los equipos son iguales";
            }
            if (teams.length == 0)
                msg = "El nombre del equipo local no existe";
            dbManager.getTeams({teamName: match.visitorTeam}, function (teams) {
                if (teams.length == 0)
                    msg = "El nombre del equipo visitante no existe";
                dbManager.getTeams({teamCourt: match.matchCourt}, function (teams){
                    if (match.matchCourt.valueOf().toString()!="otro" && teams.length == 0)
                        msg = "El nombre del lugar no existe";
                    funcionCallback(msg);
                    msg = null;
                });
            });
        });
    },

};