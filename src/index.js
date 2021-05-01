require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');
const db = require('./db');
const redirect = require('./handlers');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.get('/:shortUrl', redirect);

app.use(
  '/graphiql',
  graphqlHTTP((request) => ({
    schema,
    graphiql: true,
    context: { db, address: request.headers.host },
  }))
);

//makes api path '/graphiql' the default route
app.get('/', (req, res) => {
  res.redirect('/graphiql');
  res.end();
});

app.listen(PORT, console.log(`server has started on port ${PORT}`));
