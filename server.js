const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { ruruHTML } = require("ruru/server");
const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
} = require("graphql");

let numVisitors = 0;
const visitors = [];

function loggingMiddleware(req, _, next) {
  console.log(req.hostname);
  next();
}

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

const visitorInputType = new GraphQLInputObjectType({
  name: "VisitorInput",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const calculatorType = new GraphQLObjectType({
  name: "Calculator",
  fields: {
    add: {
      type: new GraphQLNonNull(GraphQLInt),
      args: {
        right: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, { right }) => parent.add({ right }),
    },
    sub: {
      type: new GraphQLNonNull(GraphQLInt),
      args: {
        right: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, { right }) => parent.sub({ right }),
    },
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    dummy: { type: new GraphQLNonNull(GraphQLString), resolve: () => "dummy!" },
    format: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        in_: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { in_ }) => {
        return in_.trim();
      },
    },
    getCalculator: {
      type: calculatorType,
      args: {
        left: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, { left }) => {
        return new Calculator(left);
      },
    },
    getNumVisitors: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: () => numVisitors,
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    incrementNumVisitors: {
      type: new GraphQLNonNull(GraphQLInt),
      args: {
        visitor: { type: visitorInputType },
      },
      resolve: (_, { visitor }) => {
        if (!visitors.includes(visitor.id)) {
          visitors.push(visitor.id);
          numVisitors++;
        }
        return numVisitors;
      },
    },
  },
});

const app = express();

app.use(loggingMiddleware);

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

app.all("/graphql", createHandler({ schema }));
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endopoint: "/graphql" }));
});

const port = 8888;
app.listen(port);
console.log(`http://localhost:${port}`);
