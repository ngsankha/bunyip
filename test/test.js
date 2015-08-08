var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    fs = require('fs'),
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
      .set('Content-Type', 'multipart/form-data')
      .field('username', 'test')
      .field('api_key', 'abc')
      .field('wait', 'true')
      .attach('image', 'test/lena.jpg')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        res.body.error.should.equal('Invalid username/api_key.');
        done();
      });
    });

    it('returns the compressed image if the wait parameter is true', function(done) {
      request.post('/v1/upload')
      .set('Content-Type', 'multipart/form-data')
      .field('username', 'test')
      .field('api_key', 'abcd')
      .field('wait', 'true')
      .attach('image', 'test/lena.jpg')
      .expect('Content-Type', /jpeg/)
      .expect(200)
      .end(function(err, res) {
        var minifiedFile = fs.createWriteStream('test/output.jpg');
        res.pipe(minifiedFile);
        fs.stat('test/lena.jpg', function(err, stat) {
          var origSize = stat.size;
          fs.stat('test/output.jpg', function(err, stat) {
            var minifiedSize = stat.size;
            minifiedSize.should.be.lessThan(origSize);
            done();
          });
        });
      });
    });
  });
});
