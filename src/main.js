import { GraphQLServer, PubSub } from 'graphql-yoga'
import Author from './resolvers/Author'
import Book from './resolvers/Book'
import db from './db'
import Mutation from './resolvers/Mutation'
import Query from './resolvers/Query'
import Subscription from './resolvers/Subscription'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const pubsub = new PubSub()

const context = { db, prisma, pubsub }

const resolvers = {
  Author,
  Book,
  Mutation,
  Query,
  Subscription,
}

const server = new GraphQLServer({
  context,
  resolvers,
  typeDefs: './src/schema.graphql',
})

server.start(() => console.log('Server is running on localhost:4000'))
