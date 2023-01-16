import { PrismaSelect } from "@paljs/plugins";
import { list, nonNull, objectType, queryField } from "nexus";
import { File } from "nexus-prisma";
import { authorizeUser } from "../libs/auth";

export const FileType = objectType({
  name: File.$name,
  description: File.$description,
  definition(t) {
    Object.entries(File).forEach(([key, value]) => {
      if (!key.startsWith("$")) t.field(value);
    });
  },
});

export const Files = queryField("files", {
  type: nonNull(list("File")),
  authorize: authorizeUser,
  resolve: (_parent, {}, { prisma }, info) => {
    const select = new PrismaSelect(info).value.select;
    return prisma.file.findMany<{}>({
      select: { ...select, id: true },
    });
  },
});
