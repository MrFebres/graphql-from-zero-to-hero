const Author = {
  books: (parent, args, { db }, info) => {
    return db.books.filter(book => book.writted_by === parent.id);
  },
  register_by: (parent, args, { db }, info) => {
    return db.users.find(user => user.id === parent.register_by);
  },
};

export default Author;
