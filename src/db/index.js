require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { generate } = require('shortid');

const db = {};
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

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
    //const model = sequelize['import'](path.join(__dirname, './models', file));
    const model = require(path.join(__dirname, './models', file))(
      sequelize,
      Sequelize
    );
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

db.createShortUrl = (url) => {
  const { longUrl } = url;
  const regex = new RegExp('^(http|https)://', 'i');

  const shortUrl = generateShortUrl();

  if (longUrl) {
    if (!regex.test(longUrl)) {
      longUrl = 'https://' + longUrl;
    }
    //create input in database
    // return short url
  } else {
    return new Error('missing or incorrect url');
  }
};

module.exports = db;
