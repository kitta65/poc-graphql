const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    dummy: String
  }
`);

const rootValue = {
  dummy() {
    return "this is dummy response!";
  },
};

const app = express();

app.all("/api", createHandler({ schema, rootValue }));

const port = 8888;
app.listen(port);
console.log(`http://localhost:${port}`);
