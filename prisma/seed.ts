import { createHash } from "../src/server/libs/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const transfer = async () => {
  return prisma.$transaction(async (prisma) => {
    //ユーザー作成
    const upsertUsers = Array(10)
      .fill(0)
      .map((_, index) => ({
        name: `hoge${index}`,
        email: `hoge${index}@example.com`,
        hash: createHash("a"),
      }))
      .map((user) =>
        prisma.user.upsert({
          create: user,
          update: user,
          where: {
            email: user.email,
          },
        })
      );
    const users = await Promise.all(upsertUsers);
    //メッセージ作成
    await prisma.message.deleteMany();
    const createMessages = users.map((user, index) => ({
      message: `message${index}`,
      userId: user.id,
    }));
    await prisma.message.createMany({ data: createMessages });
  });
};

transfer().finally(async () => {
  prisma.$disconnect();
});
