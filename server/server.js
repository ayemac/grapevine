const express = require('express');
const GraphHTTP = require('express-graphql');
const Schema  = require('./schema');
var cors = require('cors');


// Start
var app = express();

// Config
app.use(
    '*',
    cors({
      origin: 'http://localhost:3000',
    }),
  );

// GraphQl

app.use('/graphql', GraphHTTP({
    schema: Schema,
    pretty: true,
    graphiql: true
  }));

app.listen(4000, () => {
    console.log(`Express GraphQL Server Now Running On localhost:4000/graphql`);
  });
