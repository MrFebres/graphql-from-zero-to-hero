const Query = {
  // Los resolvers originalmente reciben 4 paramentros parent, argumentos, contexto, información
  // parent, si existiera algun tipo que estuviera implicito en la query, lo pudieramos obtener directamente del padre.
  // Queries declaradas como root no tienen un parent xq ya se encuentran en la raíz principal.
  // argumentos, inputs del cliente o específicaciones que provienen del cliente.
  // contexto, ámbito u entorno que posee en el graphQL y poder acceder desde cualquier resolver.
  // Información,
  author: (parent, { id }, { db }, info) => {
    if (!id) return db.authors;

    return db.authors.filter(author => author.id === id);
  },
  book: (parent, { id }, { db }, info) => {
    if (!id) return db.books;

    return db.books.filter(book => book.id === id);
  },
  hello: (parent, args, ctx, info) => {
    const { name } = args;
    return `Hello ${name || 'World'}`;
  },
  user: (parent, { id }, { db }, info) => {
    if (!id) return db.users;
    return db.users.filter(user => user.id === id);
  },
};

export default Query;
