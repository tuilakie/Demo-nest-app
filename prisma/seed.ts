import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: 'example3@gmail.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Wick',
      address: '1234 Main St',
    },
  });
  console.log({ user });

  const post1 = await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Hello World',
      content: 'This is my first post!',
      published: true,
    },
  });
  console.log({ post1 });

  const post2 = await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Hello World 2',
      content: 'This is my second post!',
      published: true,
    },
  });
  console.log({ post2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
