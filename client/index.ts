import { graphql } from "./codegen/gql";
import type { TypedDocumentString } from "./codegen/graphql";
const query = graphql(`
  query Format($in_: String!) {
    format(in_: $in_)
  }
`);

async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  return fetch("http://localhost:8888/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((r) => r.json() as TResult);
}

execute(query, { in_: "  a string which contains many white spaces  " }).then(
  // result is now typed! editor will suggest `.format` property
  (result) => console.log(result.format),
);
