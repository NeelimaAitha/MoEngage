const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('moengage', 'neelu', '1234', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = User;
