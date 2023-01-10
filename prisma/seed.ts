import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "hoge1",
    email: "hoge1@example.com",
  },
  {
    name: "hoge2",
    email: "hoge2@example.com",
  },
  {
    name: "hoge3",
    email: "hoge3@example.com",
  },
];

const transfer = async () => {
  const users = [];
  for (const u of userData) {
    const user = prisma.user.upsert({
      create: u,
      update: u,
      where: {
        email: u.email,
      },
    });
    users.push(user);
  }
  const users2 = await prisma.$transaction(users);

  const messages = [];
  for (const i in users) {
    const message = prisma.message.create({
      data: { message: `message${i}`, userId: users2[i].id },
    });
    messages.push(message);
  }
  await prisma.$transaction(messages);
};

const main = async () => {
  console.log(`Start seeding ...`);

  await transfer();

  console.log(`Seeding finished.`);
};

// 処理開始
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
