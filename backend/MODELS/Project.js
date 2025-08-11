const { DataTypes } = require('sequelize');
const { sql } = require('../connect');

const Project = sql.define('Project', {
    project_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    project_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    project_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    project_image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'projects',
    timestamps: false
});

module.exports = Project;
