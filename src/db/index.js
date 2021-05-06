require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const {
  generateId,
  generateShortUrl,
  addProtocol,
  validateUrl,
} = require('../utils');
const url = require('url');

const db = {};
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// define the sequelize ORM instance and connect it to the db
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    db: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    schema: process.env.DB_SCHEMA,
  }
);

console.log(
  `🚀 sequelize ORM connected to ${process.env.DB_DIALECT} @ ${process.env.DB_HOST}:${process.env.DB_PORT}`
);

// loading all sequelize models from the 'models' folder
fs.readdirSync(path.join(__dirname, './models'))
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const modelFile = path.join(__dirname, './models', file);
    const model = require(modelFile)(sequelize, Sequelize);
    db[model.name] = model;
  });

// define the relationships between the entities
/* db.url.belongsTo(db)*/

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const UrlModel = db.url;

/**
 * shortenUrl - adding Urls to database and shortUrl based query
 *
 * @param  {JSON} query JSON structure holding the query url arguments
 * @return {STRING} output string containing the actual shortenedUrl results, the result count and error
 */
db.shortenUrl = async (url, address) => {
  const id = generateId;
  const host = new URL(addProtocol(address)).host;
  const shortUrl = generateShortUrl(id, host);
  const UrlModel = db.url;

  if (validateUrl(url)) {
    const longUrl = addProtocol(url);
    const findUrl = await UrlModel.findOne({
      where: { longUrl },
    });

    if (findUrl) {
      return findUrl;
    }

    const urlObject = await UrlModel.create({
      longUrl,
      shortUrl,
    });

    return urlObject;
  } else {
    return new Error('missing or incorrect url');
  }
};

/**
 * incrementClickCount - increment Url clicks in database and shortUrl based query
 *
 * @param  {UUID} mutation  structure holding the mutation url arguments
 * @return {NUMBER} output number containing the actual increment results, the result click count and error
 */
db.incrementClickCounts = async (id) => {
  const url = await UrlModel.findById(id);
  if (url) {
    url.clickCount++;
    url.save();
    return url;
  } else {
    return new Error('missing or incorrect id');
  }
};

// synchronize the sequelize mode with postgres (and alters the database if needed)
//console.log('Attention : db schema recreate started...');
db.sequelize.sync({ force: true, logging: console.log });

try {
  db.sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

module.exports = db;
