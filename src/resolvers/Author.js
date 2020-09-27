const Author = {
  books: (parent, args, { prisma }, info) => {
    return prisma.authors
      .findOne({
        where: {
          id: parent.id,
        },
      })
      .books()
  },
  register_by: (parent, args, { prisma }, info) => {
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
