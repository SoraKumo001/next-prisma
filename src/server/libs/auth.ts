import crypto from "crypto";
import { verify } from "jsonwebtoken";
import type { NextApiRequest } from "next";
import { Context } from "../context";

export const createHash = (value: string) =>
  crypto.createHash("sha256").update(value, "utf8").digest("hex");

/**
 * authorizationヘッダからBearerトークンを取得する
 * @returns token
 */
export const getAuth = (req: NextApiRequest) => {
  const authorization = req.headers["authorization"];
  const token = authorization?.match(/^Bearer[ ]+([^ ]+)[ ]*$/i)?.[1];
  if (token) {
    const secret = process.env.JWT_SECRET ?? "";
    try {
      const jwt = verify(token, secret);
      if (
        typeof jwt === "object" &&
        "sub" in jwt &&
        typeof jwt.sub === "number"
      )
        return jwt.sub;
    } catch (e) {}
  }
  return undefined;
};

export const authorizeUser = (
  _root: unknown,
  _args: unknown,
  { userId }: Context
) => (userId ? true : new Error("auth error"));
