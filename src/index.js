require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');
const db = require('./db');
//const redirect = require('./handlers');

const app = express();
const API_PORT = process.env.API_PORT || 4000;

/* const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}; */
app.use(cors());
//app.use(redirect);

/* app.use(express.json());
app.use(express.urlencoded({ extended: false })); */

app.use(
  '/graphiql',
  graphqlHTTP({
    schema,
    graphiql: true,
    context: { db },
  })
);

//makes api path '/graphiql' the default route
app.get('/', (req, res) => {
  res.redirect('/graphiql');
  res.end();
});

// synchronize the sequelize mode with postgres (and alters the database if needed)
//console.log('Attention : db schema recreate started...');
db.sequelize
  .sync({ force: true, logging: console.log })
/*   .then(() =>
    db.url.create({
      id: '975496e9-022d-485f-9bc4-818e19952789',
      longUrl:
        'https://sequelize.org/v4/manual/tutorial/models-definition.html',
      shortUrl: 'u1TfhK',
      clickCount: 0,
    })
  )
  .then((test) => {
    console.log(test.toJSON());
  }); */

try {
  db.sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.listen(API_PORT, console.log(`server has started on port ${API_PORT}`));
