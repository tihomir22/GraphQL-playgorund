const Query = {
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  posts(parent, args, { db }, info) {
    return db.posts.filter((entry) => {
      if (args.query) {
        return entry.title.toLowerCase().includes(args.query.toLowerCase());
      }
      return true;
    });
  },
  users(parent, args, { db }, info) {
    return db.users;
  },
  add(parent, args, { db }, info) {
    return args.numbers.reduce((prev, current) => {
      prev = prev + current;
      return prev;
    }, 0);
  },
  greeting(parent, args, ctx, info) {
    return `Hola ${args.name}`;
  },
  grades(parent, args, ctx, info) {
    return [99, 80, 93];
  },
  me() {
    return {
      id: 123,
      name: "Suave",
      email: "suave@gmail.com",
      age: 123,
    };
  },
  post() {
    return {
      id: 456,
      title: "Dembow",
      body: "Suavisimo",
      published: true,
    };
  },
};
export default Query;