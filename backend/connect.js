require('dotenv').config();

const path = require('path');
const fs = require('fs/promises');
const { pathToFileURL } = require('url');
const { Sequelize } = require('sequelize');

const sql = new Sequelize(
  process.env.DB_NAME,     // database
  process.env.DB_USER,     // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

// Auto-load all tables in MODELS
async function loadModels() {
  const modelsPath = path.join(__dirname, 'MODELS');
  const files = await fs.readdir(modelsPath);

  for (const file of files) {
    if (file.endsWith('.js')) {
      await import(pathToFileURL(path.join(modelsPath, file)).href);
    }
  }
}

// Function to authenticate and connect
async function connectToDatabase() {
  try {
    await loadModels();

    await sql.authenticate();
    await sql.sync();

    console.log(`Connected to the ${process.env.DB_NAME} database successfully.`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

module.exports = {
    sql,
    connectToDatabase
};
