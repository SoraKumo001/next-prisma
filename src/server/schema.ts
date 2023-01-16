import { join } from "path";
import { fieldAuthorizePlugin, makeSchema } from "nexus";
import * as allTypes from "./schemas";
import * as NexusPrismaScalars from "nexus-prisma/scalars";

export const schema = makeSchema({
  types: [NexusPrismaScalars, allTypes],
  contextType: {
    module: join(process.cwd(), "src", "server", "context.ts"),
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
  plugins: [fieldAuthorizePlugin()],
  outputs: {
    typegen: join(process.cwd(), "src", "server", "generated", "typegen.ts"),
    schema: join(process.cwd(), "src", "server", "generated", "schema.graphql"),
  },
});
