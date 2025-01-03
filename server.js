const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
const { ruruHTML } = require("ruru/server");

const schema = buildSchema(`
  type Query {
    dummy: String
    format(in_: String!): String
  }`);

const rootValue = {
  dummy() {
    return "this is dummy response!";
  },
  format({ in_ }) {
    return in_.trim();
  },
};

const app = express();

app.all("/graphql", createHandler({ schema, rootValue }));
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endopoint: "/graphql" }));
});

const port = 8888;
app.listen(port);
console.log(`http://localhost:${port}`);
