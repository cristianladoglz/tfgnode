let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;


chai.use(chaiHttp);
const url= 'http://localhost:8080';

var jsonParse;
var eventParse;

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