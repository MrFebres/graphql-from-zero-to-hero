import { getUserId } from '../utils'

const Book = {
  register_by: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.books
      .findOne({
        where: {
          id: parent.id,
        },
      })
      .users()
  },
  writted_by: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.books
      .findOne({
        where: {
          id: parent.id,
        },
      })
      .authors()
  },
}

export default Book
