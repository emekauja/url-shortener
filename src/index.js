require('dotenv').config()
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');

const app = express();
const API_PORT = process.env.API_PORT || 4000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  '/graphiql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(API_PORT, console.log(`server has started on port ${API_PORT}`));
