const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
const { ruruHTML } = require("ruru/server");

let numVisitors = 0;

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
    getNumVisitors: Int!
  }
  type Calculator {
    add(right: Int!): Int!
    sub(right: Int!): Int!
  }
  type Mutation {
    incrementNumVisitors: Int!
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
  getNumVisitors() {
    return numVisitors;
  },
  incrementNumVisitors() {
    numVisitors++;
    return numVisitors;
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
