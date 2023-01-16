import { ApolloServer } from "@apollo/server";
import { executeHTTPGraphQLRequest } from "@react-libraries/next-apollo-server";
import { NextApiHandler } from "next";
import { Context, prisma } from "./context";
import { getAuth } from "./libs/auth";
import { schema } from "./schema";

const apolloServer = new ApolloServer<Context>({
  schema,
});

apolloServer.start();

/**
 * Next.js用APIRoutesハンドラ
 */
const handler: NextApiHandler = async (req, res) => {
  const userId = getAuth(req);
  //Convert NextApiRequest to body format for GraphQL (multipart/form-data support).
  return executeHTTPGraphQLRequest({
    req,
    res,
    apolloServer,
    context: async () => ({ req, res, userId, prisma }),
  });
};

export default handler;
