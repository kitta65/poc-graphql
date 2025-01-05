import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./common/schema.graphql",
  documents: "client/**/*.ts",
  // useful for first execution
  ignoreNoDocuments: true,
  generates: {
    "client/codegen/": {
      // https://the-guild.dev/graphql/codegen/plugins/presets/preset-client
      preset: "client",
      config: {
        documentMode: "string",
      },
    },
  },
};

export default config;
