import { GraphQLServer } from "graphql-yoga";
import * as inputs from "./inputs.graphql";
import * as mutations from "./mutation.graphql";
import * as query from "./query.graphql";
import db from "./db.js";
import Query from "./resolvers/Query";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";
import User from "./resolvers/User";
import Mutation from "./resolvers/Mutation";

const server = new GraphQLServer({
  typeDefs: [inputs,mutations,query],
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment,
  },
  context: {
    db,
  },
});


server.start(() => {
  console.log("The server is up");
});
