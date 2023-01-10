import { PrismaClient } from "@prisma/client";
import { createYoga } from "graphql-yoga";
import type { NextApiRequest, NextApiResponse } from "next";
import { schema } from "../../backend/schema";
import { Context, prisma } from "../../backend/context";

export default createYoga<
  {
    req: NextApiRequest;
    res: NextApiResponse;
    prisma: PrismaClient;
  },
  Context
>({
  graphqlEndpoint: "/api/graphql",
  schema,
  context: ({ req, res }) => ({ req, res, prisma }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};
