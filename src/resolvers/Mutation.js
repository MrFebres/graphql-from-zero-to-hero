const Mutation = {
  createAuthor: async (parent, { input }, { prisma, pubsub }, info) => {
    const { register_by, ...rest } = input

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
  createBook: async (parent, { input }, { prisma, pubsub }, info) => {
    const { register_by, writted_by, ...rest } = input

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
  createUser: (parent, { input }, { prisma }, info) => {
    return prisma.users.create({ data: { ...input } })
  },
  deleteBook: async (parent, { id }, { prisma, pubsub }, info) => {
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
  updateAuthor: async (parent, { id, input }, { prisma, pubsub }, info) => {
    const { register_by } = input

    if (register_by)
      input.users = {
        connect: {
          id: Number(register_by),
        },
      }

    const authorUpdated = await prisma.authors.update({
      where: {
        id: Number(id),
      },
      data: input,
    })

    pubsub.publish('author', {
      author: {
        mutation: 'UPDATED',
        data: authorUpdated,
      },
    })

    return authorUpdated
  },
  updateBook: async (parent, { id, input }, { prisma, pubsub }, info) => {
    const { register_by, writted_by } = input

    if (register_by)
      input.users = {
        connect: {
          id: Number(register_by),
        },
      }

    if (writted_by)
      input.authors = {
        connect: {
          id: Number(writted_by),
        },
      }

    const updatedBook = await prisma.books.update({
      where: { id: Number(id) },
      data: input,
    })

    pubsub.publish(`book ${updatedBook.writted_by}`, {
      book: {
        mutation: 'UPDATED',
        data: updatedBook,
      },
    })

    return updatedBook
  },
  updateUser: (parent, { id, input }, { prisma }, info) => {
    return prisma.users.update({
      where: { id },
      input,
    })
  },
}

export default Mutation
