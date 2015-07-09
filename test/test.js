var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    Sequelize = require('sequelize');


describe('Routes', function() {

  var url = 'http://localhost:3000';

  before(function(done) {
    var sequelize = new Sequelize('bunyip', '', '', {
      dialect: 'sqlite',
      storage: 'db.sqlite',
      logging: false
    });

    var User = require('./models/user')(sequelize);
    User.sync().then(function() {
      User.create({
        username: 'test',
        password: 'password',
        email: 'testing@exmple.com',
        api_key: 'abcd'
      });
    }).then(done);
  });

  describe('index', function() {
    it('should return the name and version number', function(done) {
      request(url)
      .get('/')
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err)
          throw err;
        res.status.should.equal(200);
        res.body.name.should.equal('Bunyip API');
        res.body.version.should.equal('1.0.0');
        res.body.status.should.equal('OK');
        done();
      });
    });
  });
});
