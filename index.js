const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

const mongodbURI = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers
});

mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => server.listen({ port }))
  .then(res => console.log(`Server running at ${res.url}`));
