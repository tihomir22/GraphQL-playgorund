import { GraphQLServer, PubSub } from "graphql-yoga";
import * as inputs from "./inputs.graphql";
import * as mutations from "./mutation.graphql";
import * as query from "./query.graphql";
import * as subscriptions from "./subscriptions.graphql";
import db from "./db.js";
import * as enums from "./enums.graphql";
import Query from "./resolvers/Query";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";
import User from "./resolvers/User";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: [enums, inputs, mutations, query, subscriptions],
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment,
    Subscription,
  },
  context: {
    db,
    pubsub,
  },
});

server.start(() => {
  console.log("The server is up");
});
