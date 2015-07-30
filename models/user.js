var Sequelize = require('sequelize');

function User(sequelize) {
  return sequelize.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    email: Sequelize.STRING,
    api_key: Sequelize.STRING
  });
}

module.exports = User;
