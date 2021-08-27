const { PubSub } = require("graphql-subscriptions");

const { ApolloServer } = require("apollo-server");

const mongoose = require("mongoose");

const url =
  "mongodb+srv://nhathung:123@socialapp.f5uyw.mongodb.net/socialapp?retryWrites=true&w=majority";

const Post = require("./models/Post");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongo db connect");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`server is running at ${res.url}`);
  });
