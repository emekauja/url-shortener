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
/* const myURL =
  url.parse('https://user:pass@sub.short.com:4000/p/a/t/h?query=string#hash'); */

// define the sequelize ORM instance and connect it to the db
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    db: process.env.DB_DATABASE,
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

    //const model = sequelize.import(path.join(__dirname, './models', file));
    const model = require(modelFile)(sequelize, Sequelize);
    db[model.name] = model;
  });

// define the relationships between the entities
/* db.user.belongsTo(db.org);
db.user.belongsToMany(db.role, { through: 'userrole' });
db.role.belongsToMany(db.user, { through: 'userrole' }); */

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.addUrl = () => {};

/**
 * getShortUrl - adding Urls to database and shortUrl based query
 *
 * @param  {JSON} query JSON structure holding the query url arguments
 * @return {STRING} output string containing the actual shortenedUrl results, the result count and error
 */
db.shortenUrl = async (url) => {
  const id = generateId;
  const host = new URL('https://shorten.url').host;
  const shortUrl = generateShortUrl(id, host);
  const UrlModel = db.url;

  if (validateUrl(url)) {
    const longUrl = addProtocol(url);
    const findUrl = await UrlModel.findOne({
      where: { longUrl },
    });

    if (findUrl) {
      return findUrl.dataValues;
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

module.exports = db;
