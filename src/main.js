import { GraphQLServer } from 'graphql-yoga';
import Author from './resolvers/Author';
import Book from './resolvers/Book';
import db from './db';
import Query from './resolvers/Query.js';

const context = { db };

const resolvers = {
  Author,
  Book,
  Query,
};

const server = new GraphQLServer({
  context,
  resolvers,
  typeDefs: './src/schema.graphql',
});

server.start(() => console.log('Server is running on localhost:4000'));
