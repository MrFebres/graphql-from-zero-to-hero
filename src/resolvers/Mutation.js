import {
  generateToken,
  getUserId,
  hashPassword,
  validatePassword,
} from '../utils'

const Mutation = {
  createAuthor: async (
    parent,
    { input },
    { prisma, pubsub, request },
    info
  ) => {
    const { register_by, ...rest } = input
    const userId = getUserId(request)

    const newAuthor = await prisma.authors.create({
      data: {
        ...rest,
        users: {
          connect: {
            id: Number(register_by),
          },
        },
      },
    })

    pubsub.publish('author', {
      author: {
        mutation: 'CREATED',
        data: newAuthor,
      },
    })

    return newAuthor
  },
  createBook: async (parent, { input }, { prisma, pubsub, request }, info) => {
    const { register_by, writted_by, ...rest } = input
    const userId = getUserId(request)

    const newBook = await prisma.books.create({
      data: {
        ...rest,
        authors: {
          connect: {
            id: Number(writted_by),
          },
        },
        users: {
          connect: {
            id: Number(register_by),
          },
        },
      },
    })

    pubsub.publish(`book - ${newBook.writted_by}`, {
      book: {
        mutation: 'CREATED',
        data: newBook,
      },
    })

    return newBook
  },
  deleteBook: async (parent, { id }, { prisma, pubsub, request }, info) => {
    const userId = getUserId(request)

    const deletedBook = await prisma.books.delete({
      where: {
        id,
      },
    })

    pubsub.publish(`book ${deletedBook.writted_by}`, {
      book: {
        mutation: 'DELETED',
        data: deletedBook,
      },
    })

    return deletedBook
  },
  login: async (parent, { input }, { prisma }, info) => {
    const user = await prisma.users.findOne({
      where: {
        email: input.email,
      },
    })

    const isValid = await validatePassword(input.password, user.password)

    if (!isValid) throw new Error('Invalid Password')

    return { user, token: generateToken(user.id) }
  },
  signUp: async (parent, { input }, { prisma }, info) => {
    const password = await hashPassword(input.password)

    const user = await prisma.users.create({
      data: {
        ...input,
        password,
      },
    })

    return { user, token: generateToken(user.id) }
  },
  updateAuthor: async (
    parent,
    { id, input },
    { prisma, pubsub, request },
    info
  ) => {
    const { register_by, ...rest } = input
    const userId = getUserId(request)

    if (register_by)
      rest.users = {
        connect: {
          id: Number(register_by),
        },
      }

    const authorUpdated = await prisma.authors.update({
      where: {
        id: Number(id),
      },
      data: { ...rest },
    })

    pubsub.publish('author', {
      author: {
        mutation: 'UPDATED',
        data: authorUpdated,
      },
    })

    return authorUpdated
  },
  updateBook: async (
    parent,
    { id, input },
    { prisma, pubsub, request },
    info
  ) => {
    const { register_by, writted_by, ...rest } = input
    const userId = getUserId(request)

    if (register_by)
      rest.users = {
        connect: {
          id: Number(register_by),
        },
      }

    if (writted_by)
      rest.authors = {
        connect: {
          id: Number(writted_by),
        },
      }

    const updatedBook = await prisma.books.update({
      where: { id: Number(id) },
      data: { ...rest },
    })

    pubsub.publish(`book ${updatedBook.writted_by}`, {
      book: {
        mutation: 'UPDATED',
        data: updatedBook,
      },
    })

    return updatedBook
  },
  updateUser: async (parent, { id, input }, { prisma }, info) => {
    const { password } = input

    if (password) input.password = await hashPassword(input.password)

    return prisma.users.update({
      where: { id: Number(id) },
      data: {
        ...input,
      },
    })
  },
}

export default Mutation
