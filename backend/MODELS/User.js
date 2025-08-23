const { DataTypes } = require("sequelize");
const { sql } = require("../connect");

const User = sql.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100), // Optional length constraint
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150), // Optional length constraint
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(128), // Assuming hex output from pbkdf2
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING(32), // Assuming hex salt
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: false, // Enables createdAt and updatedAt
  }
);

module.exports = User;
