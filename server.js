const { graphql, buildSchema } = require("graphql");

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

graphql({
  schema,
  source: "{ dummy }",
  rootValue,
}).then((resp) => {
  console.log(resp);
});
