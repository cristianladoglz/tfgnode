let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;


chai.use(chaiHttp);
const url= 'http://localhost:8080';


describe('get active matches',()=>{
    it('get all active matches', (done) => {
        chai.request(url)
            .get('/api/activeMatches')
            .end( function(err,res){
                expect(res.text).to.contains('"localTeam":"Sanfer","visitorTeam":"ADBA","quartersNumber":4,"durationQuarter":1,"runningTime":false,"timeOuts":2,"maxPersonalFouls":5,"date":"2020-04-10","time":"20:11","matchCourt":"Polideportivo Quirinal","tableOfficial":"","userName":"test","followers":[],"state":"active"');
                expect(res.text).not.to.contains('"localTeam":"ADBA","visitorTeam":"Barça Lassa","quartersNumber":4,"durationQuarter":10,"runningTime":false,"timeOuts":2,"maxPersonalFouls":5,"date":"2020-10-23","time":"18:00","matchCourt":"Niemeyer","tableOfficial":"","userName":"test","followers":[],"state":"created"');
                expect(res.text).not.to.contains('"localTeam":"Llaranes","visitorTeam":"Real Madrid","quartersNumber":4,"durationQuarter":1,"runningTime":false,"timeOuts":2,"maxPersonalFouls":5,"date":"2020-04-10","time":"12:30","matchCourt":"La Toba","tableOfficial":"test","userName":"test","followers":[],"state":"finished"');
                expect(res).to.have.status(200);
                done();
            });
    });
});

