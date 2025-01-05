import { graphql } from "./codegen/gql";
import type { TypedDocumentString } from "./codegen/graphql";
const query = graphql(`
  query Format($in_: String!) {
    format(in_: $in_)
  }
`);

function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const data = fetch("http://localhost:8888/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((r) => r.json())
    .then((data) => console.log(data));
}

execute(query, {in_:  "  a string which contains many white spaces  " });
