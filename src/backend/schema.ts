import { makeSchema } from "nexus";
import * as allTypes from "./schema/index";
import { join } from "path";

export const schema = makeSchema({
  types: [allTypes],
  contextType: {
    module: join(process.cwd(), "src", "backend", "context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
  outputs: {
    typegen: join(
      process.cwd(),
      "src",
      "backend",
      "generated",
      "exus-typegen.ts"
    ),
    schema: join(
      process.cwd(),
      "src",
      "backend",
      "generated",
      "schema.graphql"
    ),
  },
});
