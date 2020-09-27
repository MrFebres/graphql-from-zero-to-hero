import { getUserId } from '../utils'

const Author = {
  books: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.authors
      .findOne({
        where: {
          id: parent.id,
        },
      })
      .books()
  },
  register_by: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.authors
      .findOne({
        where: {
          id: parent.id,
        },
      })
      .users()
  },
}

export default Author
