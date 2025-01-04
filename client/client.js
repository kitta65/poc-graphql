const in_ = "  string which has may unnecessary spaces  ";
const query = `
  query format($in_: String!) {
    format(in_: $in_)
  }
`;

fetch("http://localhost:8888/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    query,
    variables: { in_ },
  }),
})
  .then((r) => r.json())
  .then((data) => console.log("data returned:", data));
