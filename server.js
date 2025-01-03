const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
const { ruruHTML } = require("ruru/server");

class Calculator {
  constructor(left) {
    this.left = left;
  }

  add({ right }) {
    return this.left + right;
  }
  sub({ right }) {
    return this.left - right;
  }
}

const schema = buildSchema(`
  type Query {
    dummy: String!
    format(in_: String!): String!
    getCalculator(left: Int!): Calculator!
  }
  type Calculator {
    add(right: Int!): Int!
    sub(right: Int!): Int!
  }`);

const rootValue = {
  dummy() {
    return "this is dummy response!";
  },
  format({ in_ }) {
    return in_.trim();
  },
  getCalculator({ left }) {
    return new Calculator(left);
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
