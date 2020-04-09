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
            if(match.quartersNumber < 1)
                msg = "El número de cuartos debe ser mínimo 1";
            if(match.quartersNumber === "")
                msg = "Número de cuartos vacío";
            if(match.durationQuarter < 1)
                msg = "La duración de cada cuarto debe ser mínimo de 1 minuto";
            if(match.durationQuarter > 60)
                msg = "La duración de cada cuarto debe ser máximo de 60 minutos";
            if(match.durationQuarter === "")
                msg = "Duración de cada cuarto vacío";
            if (match.localTeam === match.visitorTeam)
                msg = "Los nombres de los equipos son iguales";
            if (match.runningTime!=="true" && match.runningTime!=="false")
                msg = "La opción de tiempo corrido no está bien seleccionada";
            if(match.timeout < 0)
                msg = "El número de tiempos muertos no puede ser negativo";
            if(match.timeout === "")
                msg = "Número de tiempos muertos vacío";
            if(match.maxPersonalFouls < 0)
                msg = "El número de máximo de faltas personales no puede ser negativo";
            if(match.maxPersonalFouls === "")
                msg = "Máximo de faltas personales vacío";
            if (teams.length === 0)
                msg = "El nombre del equipo local no existe";
            if (match.date === "")
                msg = "La fecha está vacía";
            if (match.time === "")
                msg = "La hora está vacía";
            dbManager.getTeams({teamName: match.visitorTeam}, function (teams) {
                if (teams.length === 0)
                    msg = "El nombre del equipo visitante no existe";
                dbManager.getTeams({teamCourt: match.matchCourt}, function (teams){
                    if (match.matchCourt!=="otro" && teams.length === 0)
                        msg = "El nombre del lugar no existe";
                    funcionCallback(msg);
                });
            });
        });
        this.message=null;
    },

};