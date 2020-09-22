import { GraphQLServer } from 'graphql-yoga';
import Author from './resolvers/Author';
import Book from './resolvers/Book';
import db from './db';
import Mutation from './resolvers/Mutation';
import Query from './resolvers/Query';

const context = { db };

const resolvers = {
  Author,
  Book,
  Mutation,
  Query,
};

const server = new GraphQLServer({
  context,
  resolvers,
  typeDefs: './src/schema.graphql',
});

server.start(() => console.log('Server is running on localhost:4000'));
