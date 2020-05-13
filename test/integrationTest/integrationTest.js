let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;


chai.use(chaiHttp);
const url= 'http://localhost:8080';

var jsonParse;
var eventParse;
var userParse;

describe('get active matches',()=>{
    it('Get all active matches', (done) => {
        chai.request(url)
            .get('/api/activeMatches')
            .end( function(err,res){
                expect(res).to.have.status(200);
                expect(res.text).to.contains('"localTeam":"Sanfer","visitorTeam":"ADBA","quartersNumber":4,"durationQuarter":1,"runningTime":false,"timeOuts":2,"maxPersonalFouls":5,"date":"2020-04-10","time":"20:11","matchCourt":"Polideportivo Quirinal","tableOfficial":"","userName":"test","followers":[],"state":"active"');
                expect(res.text).not.to.contains('"localTeam":"ADBA","visitorTeam":"Barça Lassa","quartersNumber":4,"durationQuarter":10,"runningTime":false,"timeOuts":2,"maxPersonalFouls":5,"date":"2020-10-23","time":"18:00","matchCourt":"Niemeyer","tableOfficial":"","userName":"test","followers":[],"state":"created"');
                expect(res.text).not.to.contains('"localTeam":"Llaranes","visitorTeam":"Real Madrid","quartersNumber":4,"durationQuarter":1,"runningTime":false,"timeOuts":2,"maxPersonalFouls":5,"date":"2020-04-10","time":"12:30","matchCourt":"La Toba","tableOfficial":"test","userName":"test","followers":[],"state":"finished"');
                done();
            });
    });
});

describe('get team players', ()=>{
   it('Non existing team', (done) => {
      chai.request(url)
          .get('/api/players/test1234')
          .end(function(err, res){
             expect(res).to.have.status(200);
             expect(res.text).to.equals('{"players":[]}');
             done();
          });
   });

   it('Existing team with no players', (done) => {
       chai.request(url)
           .get('/api/players/test2')
           .end(function(err, res){
               expect(res).to.have.status(200);
               expect(res.text).to.equals('{"players":[]}');
               done();
           });
   });

    it('Existing team with players', (done) => {
        chai.request(url)
            .get('/api/players/test')
            .end(function(err, res){
                expect(res).to.have.status(200);
                expect(res.text).to.contains('"teamName":"test","playerName":"Test","playerBib":0');
                done();
            });
    });
});

describe('get team coaches', ()=>{
    it('Non existing team', (done) => {
        chai.request(url)
            .get('/api/coaches/test1234')
            .end(function(err, res){
                expect(res).to.have.status(200);
                expect(res.text).to.equals('{"coaches":[]}');
                done();
            });
    });

    it('Existing team with no coaches', (done) => {
        chai.request(url)
            .get('/api/coaches/test2')
            .end(function(err, res){
                expect(res).to.have.status(200);
                expect(res.text).to.equals('{"coaches":[]}');
                done();
            });
    });

    it('Existing team with coaches', (done) => {
        chai.request(url)
            .get('/api/coaches/Sanfer')
            .end(function(err, res){
                expect(res).to.have.status(200);
                expect(res.text).to.contains('"teamName":"Sanfer","coachName":"Pablo"');
                done();
            });
    });
});

describe('start a match', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .put('/api/start/match/555555555555555555555555')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('Obtain match', (done) => {
         chai.request(url)
            .get('/api/activeMatches')
            .end(function (err, res) {
                jsonParse = JSON.parse(res.text);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .put('/api/start/match/'+jsonParse.activeMatches[0]._id)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.contains('{"mensaje":"Partido en juego"}');
                done();
            });
    });

    it('Match playing and not active', (done) => {
        chai.request(url)
            .get('/api/activeMatches')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.equals('{"activeMatches":[]}');
                done();
            });
    });

    it('Add start event', (done) => {
        chai.request(url)
           .post('/api/add/start')
           .send({matchId: jsonParse.activeMatches[0]._id})
           .end(function (err, res) {
               eventParse = JSON.parse(res.text);
               expect(res).to.have.status(200);
               expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
               expect(eventParse.eventType).to.equals('start');
               done();
           });
    });
});

describe('add stop event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/stop')
            .send({matchId: "555555555555555555555555", time: "9:59"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/stop')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.eventType).to.equals('stop');
                done();
            });
    });
});

describe('add resume event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/resume')
            .send({matchId: "555555555555555555555555", time: "9:59"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/resume')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.eventType).to.equals('resume');
                done();
            });
    });
});

describe('add add points event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/points')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555", points: "3"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/points')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555", points: "3"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerId).to.equals("");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.points).to.equals(3);
                expect(eventParse.eventType).to.equals('addPoints');
                done();
            });
    });
});

describe('add sub points event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/sub/points')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555", points: "-1"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/sub/points')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555", points: "-1"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerId).to.equals("");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.points).to.equals(-1);
                expect(eventParse.eventType).to.equals('subPoints');
                done();
            });
    });
});

describe('add add personal foul event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/personalFoul')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/personalFoul')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerId).to.equals("");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('addPersonalFoul');
                done();
            });
    });
});

describe('add sub personal foul event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/sub/personalFoul')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/sub/personalFoul')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerId).to.equals("");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('subPersonalFoul');
                done();
            });
    });
});

describe('add time out event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/timeout')
            .send({matchId: "555555555555555555555555", time: "9:59", teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/timeout')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('timeout');
                done();
            });
    });
});

describe('add over and back event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/overAndBack')
            .send({matchId: "555555555555555555555555", time: "9:59", teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/overAndBack')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('overAndBack');
                done();
            });
    });
});

describe('add shot clock event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/shotClock')
            .send({matchId: "555555555555555555555555", time: "9:59", teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/shotClock')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('shotClock');
                done();
            });
    });
});

describe('add eight seconds event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/eightSeconds')
            .send({matchId: "555555555555555555555555", time: "9:59", teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/eightSeconds')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('eightSeconds');
                done();
            });
    });
});

describe('add travelling event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/travelling')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/travelling')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerId).to.equals("");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('travelling');
                done();
            });
    });
});

describe('add double event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/double')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/double')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerId).to.equals("");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('double');
                done();
            });
    });
});

describe('add foot event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/foot')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/foot')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerId).to.equals("");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('foot');
                done();
            });
    });
});

describe('add five seconds event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/fiveSeconds')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/fiveSeconds')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerId).to.equals("");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('fiveSeconds');
                done();
            });
    });
});

describe('add three seconds event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/threeSeconds')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/threeSeconds')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerId).to.equals("");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('threeSeconds');
                done();
            });
    });
});

describe('add unsportmanlike event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/unsportmanlike')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/unsportmanlike')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerId).to.equals("");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('unsportmanlike');
                done();
            });
    });
});

describe('add technical foul event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/technicalFoul')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/technicalFoul')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerId).to.equals("");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('technicalFoul');
                done();
            });
    });
});

describe('add finish quarter event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/finishQuarter')
            .send({matchId: "555555555555555555555555", quarter: 1})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/finishQuarter')
            .send({matchId: jsonParse.activeMatches[0]._id, quarter: 1})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.quarter).to.equals(1);
                expect(eventParse.eventType).to.equals('finishQuarter');
                done();
            });
    });
});

describe('add start quarter event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/startQuarter')
            .send({matchId: "555555555555555555555555", quarter: 2})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/startQuarter')
            .send({matchId: jsonParse.activeMatches[0]._id, quarter: 2})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.quarter).to.equals(2);
                expect(eventParse.eventType).to.equals('startQuarter');
                done();
            });
    });
});

describe('add substitution event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/substitution')
            .send({matchId: "555555555555555555555555", time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, substitutorId: "", substitutorName: "Adrián", substitutorBib: 15,
                teamId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/substitution')
            .send({matchId: jsonParse.activeMatches[0]._id, time: "9:59", playerId: "", playerName: "Cristian",
                playerBib: 23, substitutorId: "", substitutorName: "Adrián", substitutorBib: 15,
                teamId: "555555555555555555555555"})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.time).to.equals("9:59");
                expect(eventParse.playerName).to.equals("Cristian");
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.substitutorName).to.equals("Adrián");
                expect(eventParse.substitutorBib).to.equals(15);
                expect(eventParse.teamId).to.equals("555555555555555555555555");
                expect(eventParse.eventType).to.equals('substitution');
                done();
            });
    });
});

describe('add finish event', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .post('/api/add/finish')
            .send({matchId: "555555555555555555555555"})
            .end(function (err, res) {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .post('/api/add/finish')
            .send({matchId: jsonParse.activeMatches[0]._id})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.eventType).to.equals('finish');
                done();
            });
    });
});

describe('finish a match', ()=> {
    it('Non existing match', (done) => {
        chai.request(url)
            .put('/api/finish/match/555555555555555555555555')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('Existing match', (done) => {
        chai.request(url)
            .put('/api/finish/match/'+jsonParse.activeMatches[0]._id)
            .send({localPoints: 2, visitorPoints: 0})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.contains('{"mensaje":"Partido finalizado"}');
                done();
            });
    });

    it('Match finished and not active', (done) => {
        chai.request(url)
            .get('/api/activeMatches')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.equals('{"activeMatches":[]}');
                done();
            });
    });

    it('Match finished and not playing', (done) => {
        chai.request(url)
            .get('/api/allMatchesVisible')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.contains('"localTeam":"Sanfer","visitorTeam":"ADBA","quartersNumber":4,"durationQuarter":1,"runningTime":false,"timeOuts":2,"maxPersonalFouls":5,"date":"2020-04-10","time":"20:11","matchCourt":"Polideportivo Quirinal","tableOfficial":"","userName":"test","followers":[],"state":"finished"');
                done();
            });
    });

    it('Record match summary', (done) => {
        chai.request(url)
            .post('/api/record/match/'+jsonParse.activeMatches[0]._id)
            .send({playerId: "", playerName: "Cristian", playerBib: 23, teamId: "555555555555555555555555",
                points: 2, personalFouls: 2, technicalFouls: 1, unsportmanlikeFouls: 1})
            .end(function (err, res) {
                eventParse = JSON.parse(res.text);
                expect(res).to.have.status(200);
                expect(eventParse.matchId).to.equals(jsonParse.activeMatches[0]._id);
                expect(eventParse.playerName).to.equals('Cristian');
                expect(eventParse.playerBib).to.equals(23);
                expect(eventParse.points).to.equals(2);
                expect(eventParse.personalFouls).to.equals(2);
                expect(eventParse.technicalFouls).to.equals(1);
                expect(eventParse.unsportmanlikeFouls).to.equals(1);
                done();
            });
    });
});

describe('get match events', ()=> {
    it('All events from this test', (done) => {
        chai.request(url)
            .get('/api/events/'+jsonParse.activeMatches[0]._id)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.contains('"eventType":"start"');
                expect(res.text).to.contains('"time":"9:59","eventType":"stop"');
                expect(res.text).to.contains('"time":"9:59","eventType":"resume"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"teamId":"555555555555555555555555","points":3,"eventType":"addPoints"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"teamId":"555555555555555555555555","points":-1,"eventType":"subPoints"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"teamId":"555555555555555555555555","eventType":"addPersonalFoul"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"teamId":"555555555555555555555555","eventType":"subPersonalFoul"');
                expect(res.text).to.contains('"time":"9:59","teamId":"555555555555555555555555","eventType":"timeout"');
                expect(res.text).to.contains('"time":"9:59","teamId":"555555555555555555555555","eventType":"overAndBack"');
                expect(res.text).to.contains('"time":"9:59","teamId":"555555555555555555555555","eventType":"shotClock"');
                expect(res.text).to.contains('"time":"9:59","teamId":"555555555555555555555555","eventType":"eightSeconds"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"teamId":"555555555555555555555555","eventType":"travelling"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"teamId":"555555555555555555555555","eventType":"double"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"teamId":"555555555555555555555555","eventType":"foot"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"teamId":"555555555555555555555555","eventType":"fiveSeconds"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"teamId":"555555555555555555555555","eventType":"threeSeconds"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"teamId":"555555555555555555555555","eventType":"unsportmanlike"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"teamId":"555555555555555555555555","eventType":"technicalFoul"');
                expect(res.text).to.contains('"quarter":1,"eventType":"finishQuarter"');
                expect(res.text).to.contains('"quarter":2,"eventType":"startQuarter"');
                expect(res.text).to.contains('"time":"9:59","playerId":"","playerName":"Cristian","playerBib":23,"substitutorId":"","substitutorName":"Adrián","substitutorBib":15,"teamId":"555555555555555555555555","eventType":"substitution"');
                expect(res.text).to.contains('"eventType":"finish"');
                done();
            });
    });
});

describe('users', ()=> {
    it('Get all users', (done) => {
        chai.request(url)
            .get('/api/users')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.contains('"userName":"test","password":"1392542397501e1158418adae09d694ffb8ed833a3a5e8a017e15ba565d28c70"}]');
                done();
            });
    });

    it('Add user', (done) => {
        chai.request(url)
            .post('/api/add/user')
            .send({userName: "test2", password: "test2"})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                userParse = JSON.parse(res.text);
                expect(res.text).to.contains('{"userName":"test2","password":"c9bb0e1832405224ea8e8aa4181ec0ca9630c05be52855cdba52fe81cf3fad75"');
                done();
            });
    });

    it('Get existing user', (done) => {
        chai.request(url)
            .post('/api/user')
            .send({userName: "test", password: "test"})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.contains('"userName":"test"');
                done();
            });
    });

    it('Get non existing user', (done) => {
        chai.request(url)
            .post('/api/user')
            .send({userName: "1234", password: "1234"})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.contains('"user":[]');
                done();
            });
    });
});

describe('followers', ()=> {
    it('Add follower', (done) => {
        chai.request(url)
            .put('/api/add/follower/'+jsonParse.activeMatches[0]._id)
            .send({userName: "test2"})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.equals('{"mensaje":"Seguidor añadido"}');
                done();
            });
    });

    it('Get followers from a match', (done) => {
        chai.request(url)
            .get('/api/allMatchesVisible')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.contains('"localTeam":"Sanfer","visitorTeam":"ADBA","quartersNumber":4,"durationQuarter":1,"runningTime":false,"timeOuts":2,"maxPersonalFouls":5,"date":"2020-04-10","time":"20:11","matchCourt":"Polideportivo Quirinal","tableOfficial":"","userName":"test","followers":[test2],"state":"finished"');
                done();
            });
    });

    it('Remove follower', (done) => {
        chai.request(url)
            .put('/api/remove/follower/'+jsonParse.activeMatches[0]._id)
            .send({userName: "test2"})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.equals('{"mensaje":"Seguidor eliminado"}');
                done();
            });
    });

    it('Get followers from a match', (done) => {
        chai.request(url)
            .get('/api/allMatchesVisible')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.text).to.contains('"localTeam":"Sanfer","visitorTeam":"ADBA","quartersNumber":4,"durationQuarter":1,"runningTime":false,"timeOuts":2,"maxPersonalFouls":5,"date":"2020-04-10","time":"20:11","matchCourt":"Polideportivo Quirinal","tableOfficial":"","userName":"test","followers":[],"state":"finished"');
                done();
            });
    });
});