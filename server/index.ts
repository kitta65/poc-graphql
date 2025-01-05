import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import {
  nonNull,
  makeSchema,
  objectType,
  extendType,
  inputObjectType,
  intArg,
  stringArg,
} from "nexus";
import { join } from "path";

let numVisitors = 0;
const visitors = [];

function loggingMiddleware(req, _, next) {
  console.log(req.hostname);
  next();
}

class Calculator {
  left: number;

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

const app = express();
app.use(loggingMiddleware);

// dummy response
const DummyQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.string("dummy", {
      resolve: () => "dummy!",
    });
  },
});

// format string
const FormatQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.string("format", {
      args: { in_: nonNull(stringArg()) },
      resolve: (_, { in_ }) => in_.trim(),
    });
  },
});

// calculator
const CalculatorQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getCalculator", {
      type: "Calculator",
      args: { left: nonNull(intArg()) },
      resolve: (_, { left }) => new Calculator(left),
    });
  },
});

const CalculatorType = objectType({
  name: "Calculator",
  definition(t) {
    t.int("left");
    t.nonNull.int("add", {
      args: { right: nonNull(intArg()) },
      resolve: (parent, { right }) => parent.left + right,
    });
    t.nonNull.int("sub", {
      args: { right: nonNull(intArg()) },
      resolve: (parent, { right }) => parent.left - right,
    });
  },
});

// visitor
const VisitorQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.int("getNumVisitors", {
      resolve: () => numVisitors,
    });
  },
});
const VisitorInput = inputObjectType({
  name: "VisitorInput",
  definition(t) {
    t.nonNull.id("id");
  },
});
const IncrementNumVisitors = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.int("incrementNumVisitors", {
      args: { visitor: nonNull("VisitorInput") },
      resolve: (_, { visitor }) => {
        if (!visitors.includes(visitor.id)) {
          visitors.push(visitor.id);
          numVisitors++;
        }
        return numVisitors;
      },
    });
  },
});

// context
const ContextQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.string("hostname", {
      resolve: (_parent, _args, ctx) => ctx.hostname || "unknown",
    });
  },
});

const schema = makeSchema({
  types: [
    DummyQuery,
    FormatQuery,
    CalculatorQuery,
    CalculatorType,
    VisitorQuery,
    VisitorInput,
    ContextQuery,
    IncrementNumVisitors,
  ],
  outputs: {
    typegen: join(__dirname, "..", "common", "nexus-typegen.ts"),
    schema: join(__dirname, "..", "common", "schema.graphql"),
  },
});

app.all(
  "/graphql",
  createHandler({
    schema,
    context: (req) => {
      return { hostname: req.raw.hostname };
    },
  }),
);
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

const port = 8888;
app.listen(port);
console.log(`http://localhost:${port}`);
