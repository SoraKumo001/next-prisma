import { PrismaSelect } from "@paljs/plugins";
import { list, nonNull, objectType, queryField } from "nexus";
import { Message } from "nexus-prisma";
import { UserType } from "./user";

export const MessageType = objectType({
  name: "Message",
  definition(t) {
    Object.entries(Message).forEach(([key, value]) => {
      if (!key.startsWith("$")) t.field(value);
    });
    t.nonNull.field("user", {
      type: UserType,
      resolve: (_parent, {}, { prisma }, info) => {
        const select = new PrismaSelect(info).value;
        return prisma.message
          .findUnique({
            where: { id: _parent.id! },
          })
          .user<{}>({ ...select });
      },
    });
  },
});

export const Messages = queryField("messages", {
  type: nonNull(list("Message")),
  resolve: (_parent, {}, { prisma }, info) => {
    const select = new PrismaSelect(info).value.select;
    return prisma.message.findMany<{}>({
      select: { ...select, id: true },
    });
  },
});
