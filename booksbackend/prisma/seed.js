import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --- Seed User ---
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      passwordHash,
      role: "admin",
    },
  });

  // --- Seed Authors ---
  const author1 = await prisma.author.create({
    data: {
      name: "J.K. Rowling",
      bio: "Author of the Harry Potter series",
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: "George R.R. Martin",
      bio: "Author of A Song of Ice and Fire",
    },
  });

  // --- Seed Publishers ---
  const publisher1 = await prisma.publisher.create({
    data: {
      name: "Bloomsbury",
      address: "London, UK",
    },
  });

  const publisher2 = await prisma.publisher.create({
    data: {
      name: "Bantam Books",
      address: "New York, USA",
    },
  });

  // --- Seed Books ---
  await prisma.book.create({
    data: {
      title: "Harry Potter and the Philosopher's Stone",
      description: "First book in the Harry Potter series",
      publishedYear: 1997,
      authorId: author1.id,
      publisherId: publisher1.id,
    },
  });

  await prisma.book.create({
    data: {
      title: "A Game of Thrones",
      description: "First book in A Song of Ice and Fire",
      publishedYear: 1996,
      authorId: author2.id,
      publisherId: publisher2.id,
    },
  });

  console.log("Seeding done!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
