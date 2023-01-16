import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export type Context = {
  res: NextApiResponse;
  req: NextApiRequest;
  prisma: PrismaClient;
  userId?: number;
};

export const prisma = new PrismaClient({
  log: [
    {
      emit: "stdout",
      level: "query",
    },
  ],
});
