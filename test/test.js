var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    Sequelize = require('sequelize');


describe('Routes', function() {

  var url = 'http://localhost:3000';
  request = request(url);

  before(function(done) {
    var sequelize = new Sequelize('bunyip', '', '', {
      dialect: 'sqlite',
      storage: 'db.sqlite',
      logging: false
    });

    var User = require('../models/user')(sequelize);
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
      request.get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err)
          throw err;
        res.body.name.should.equal('Bunyip API');
        res.body.version.should.equal('1.0.0');
        res.body.status.should.equal('OK');
        done();
      });
    });
  });

  describe('v1 api', function() {
    it('tells if wrong auth details are used', function(done) {
      request.post('/v1/upload')
      .set('username', 'test')
      .set('api_key', 'abc')
      .set('wait', true)
      //.attach('image', '/Users/sankha/Pictures/DSC_0080.jpg')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        res.body.error.should.equal('Invalid username/api_key.');
        done();
      });
    });
  });
});
