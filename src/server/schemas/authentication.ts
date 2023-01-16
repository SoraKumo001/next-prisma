import { sign } from "jsonwebtoken";
import { mutationField, nonNull } from "nexus";
import { createHash } from "../libs/auth";
import cookie from "cookie";

/**
 * サインイン処理
 */
export const signIn = mutationField("SignIn", {
  type: "String",
  args: {
    email: nonNull("String"),
    password: nonNull("String"),
  },
  resolve: async (_parent, { email, password }, { prisma, res }) => {
    const hash = createHash(password);
    const value = await prisma.user.findFirst({
      select: { id: true, name: true, email: true },
      where: { email, hash },
    });
    if (!value) return null;
    const secret = process.env.JWT_SECRET || "";
    const claims = {
      sub: value.id,
      email: value.email,
      name: value.name,
    };
    const token = sign(claims, secret, { expiresIn: "7 days" });
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );
    return token;
  },
});

/**
 * サインアウト処理
 */
export const signOut = mutationField("SignOut", {
  type: "Boolean",
  resolve: async (_, _args, { res }) => {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      })
    );
    return true;
  },
});
