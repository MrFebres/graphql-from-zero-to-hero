import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  createAuthor: (parent, { input }, { db }, info) => {
    const author = {
      id: uuidv4(),
      ...input,
    };
    db.authors.push(author);

    return author;
  },
  createBook: (parent, { input }, { db }, info) => {
    const book = {
      id: uuidv4(),
      ...input,
    };

    db.books.push(book);

    return book;
  },
  createUser: (parent, { input }, { db }, info) => {
    const isEmailTaken = db.users.some(user => user.email === input.email);
    if (isEmailTaken) throw new Error('Email taken');

    const user = {
      id: uuidv4(),
      ...input,
    };
    db.users.push(user);

    return user;
  },
  deleteBook: (parent, { id }, { db }, info) => {
    const bookExist = db.books.find(book => book.id === id);

    if (!bookExist) throw new Error('Book not found');

    db.books = db.books.reduce((arr, book) => {
      if (book.id !== id) arr.push(book);
      return arr;
    }, []);

    return { ...bookExist };
  },
  updateAuthor: (parent, { id, input }, { db }, info) => {
    const authorExist = db.authors.find(author => author.id === id);

    if (!authorExist) throw Error('Author does not exist');

    db.authors = db.authors.map(author => {
      if (author.id === id) return { ...author, ...input };
      return author;
    });

    return { ...authorExist, ...input };
  },
  updateBook: (parent, { id, input }, { db }, info) => {
    const bookExist = db.books.find(book => book.id === id);

    if (!bookExist) throw new Error('Book not found');

    db.books = db.books.map(book => {
      if (book.id === id) return { ...book, ...input };
      return book;
    });

    return { ...bookExist, ...input };
  },
  updateUser: (parent, { id, input }, { db }, info) => {
    const userExist = db.users.find(user => user.id === id);
    if (!userExist) throw new Error('User not found');

    const isEmailTaken = db.users.some(user => user.email === input.email);
    if (isEmailTaken) throw new Error('Email taken');

    db.users = db.users.map(user => {
      if (user.id === id) return { ...user, ...input };
      return user;
    });
    return { ...userExist, ...input };
  },
};

export default Mutation;
