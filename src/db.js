//Demo user data
let users = [
  {
    id: 1,
    name: "Andrew",
    email: "tihomir_alandre@gmail.com",
    age: 27,
  },
  {
    id: 2,
    name: "Sara",
    email: "sarah123oh@gmail.com",
    age: 17,
  },
];

let posts = [
  {
    id: 1,
    title: "Mira",
    body: "Mi gnso ha crecido",
    published: true,
    author: 1,
  },
];

let comments = [
  {
    id: 1,
    text: "Bueno",
    author: 1,
    post: 1,
  },
  {
    id: 2,
    text: "Bueno2",
    author: 1,
    post: 1,
  },
  {
    id: 3,
    text: "Bueno3",
    author: 1,
    post: 1,
  },
  {
    id: 4,
    text: "Bueno4",
    author: 2,
    post: 1,
  },
];

const db = {
  users,
  posts,
  comments,
};

export default db;
