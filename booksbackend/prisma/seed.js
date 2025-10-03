import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --- Seed User ---
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      passwordHash,
      role: "admin",
    },
  });

  // --- Seed Authors (20) ---
  const authors = [];
  for (let i = 1; i <= 20; i++) {
    const author = await prisma.author.create({
      data: {
        name: `Author ${i}`,
        bio: `Bio for author ${i}`,
      },
    });
    authors.push(author);
  }

  // --- Seed Publishers (15) ---
  const publishers = [];
  for (let i = 1; i <= 15; i++) {
    const publisher = await prisma.publisher.create({
      data: {
        name: `Publisher ${i}`,
        address: `Address ${i}`,
      },
    });
    publishers.push(publisher);
  }

  // --- Seed Books (30) ---
  for (let i = 1; i <= 30; i++) {
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    const randomPublisher =
      publishers[Math.floor(Math.random() * publishers.length)];

    await prisma.book.create({
      data: {
        title: `Book ${i}`,
        description: `Description for book ${i}`,
        publishedYear: 1990 + Math.floor(Math.random() * 35), // tahun random 1990-2024
        authorId: randomAuthor.id,
        publisherId: randomPublisher.id,
      },
    });
  }

  console.log("✅ Seeding done!");
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
