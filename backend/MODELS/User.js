const { DataTypes } = require('sequelize');
const { sql } = require('../connect');

const User = sql.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING, // DataTypes.STRING(225)
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  password_hash: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING, 
    allowNull: false,
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
