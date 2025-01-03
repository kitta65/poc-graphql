const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
const { ruruHtml, ruruHTML } = require("ruru/server");

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

app.all("/graphql", createHandler({ schema, rootValue }));
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endopoint: "/graphql" }));
});

const port = 8888;
app.listen(port);
console.log(`http://localhost:${port}`);
