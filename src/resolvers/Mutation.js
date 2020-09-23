import { v4 as uuidv4 } from 'uuid'

const Mutation = {
  createAuthor: (parent, { input }, { db, pubsub }, info) => {
    const author = {
      id: uuidv4(),
      ...input,
    }
    db.authors.push(author)

    pubsub.publish('author', {
      author: {
        mutation: 'CREATED',
        data: author,
      },
    })
    return author
  },
  createBook: (parent, { input }, { db, pubsub }, info) => {
    const isAuthorExist = db.authors.some(
      author => author.id === input.writted_by
    )

    if (!isAuthorExist) throw new Error('Author does not exist')

    const book = {
      id: uuidv4(),
      ...input,
    }

    db.books.push(book)

    pubsub.publish(`book - ${book.writted_by}`, {
      book: {
        mutation: 'CREATED',
        data: book,
      },
    })
    return book
  },
  createUser: (parent, { input }, { db }, info) => {
    const isEmailTaken = db.users.some(user => user.email === input.email)
    if (isEmailTaken) throw new Error('Email taken')

    const user = {
      id: uuidv4(),
      ...input,
    }
    db.users.push(user)

    return user
  },
  deleteBook: (parent, { id }, { db, pubsub }, info) => {
    const bookExist = db.books.find(book => book.id === id)

    if (!bookExist) throw new Error('Book not found')

    db.books = db.books.reduce((arr, book) => {
      if (book.id !== id) arr.push(book)
      return arr
    }, [])

    pubsub.publish(`book ${book.writted_by}`, {
      book: {
        mutation: 'DELETED',
        data: bookExist,
      },
    })
    return bookExist
  },
  updateAuthor: (parent, { id, input }, { db, pubsub }, info) => {
    const authorExist = db.authors.find(author => author.id === id)

    if (!authorExist) throw Error('Author does not exist')

    db.authors = db.authors.map(author => {
      if (author.id === id) return { ...author, ...input }
      return author
    })

    pubsub.publish('author', {
      author: {
        mutation: 'UPDATED',
        data: { ...authorExist, ...input },
      },
    })
    return { ...authorExist, ...input }
  },
  updateBook: (parent, { id, input }, { db, pubsub }, info) => {
    const bookExist = db.books.find(book => book.id === id)
    if (!bookExist) throw new Error('Book not found')

    const authorExist = db.authors.some(
      author => author.id === input.writted_by
    )
    if (input.writted_by && !authorExist) throw Error('Author does not exist')

    db.books = db.books.map(book => {
      if (book.id === id) return { ...book, ...input }
      return book
    })

    const updatedBook = { ...bookExist, ...input }

    pubsub.publish(`book ${updatedBook.writted_by}`, {
      book: {
        mutation: 'UPDATED',
        data: updatedBook,
      },
    })

    return updatedBook
  },
  updateUser: (parent, { id, input }, { db }, info) => {
    const userExist = db.users.find(user => user.id === id)
    if (!userExist) throw new Error('User not found')

    const isEmailTaken = db.users.some(user => user.email === input.email)
    if (isEmailTaken) throw new Error('Email taken')

    db.users = db.users.map(user => {
      if (user.id === id) return { ...user, ...input }
      return user
    })
    return { ...userExist, ...input }
  },
}

export default Mutation
