import { prisma } from "../../src/libs/prisma";
import { seedUser } from "./user";

async function seed() {
  await seedUser();
}

seed().then(() => {
  console.log("Seeding completed!");
  prisma.$disconnect();
});
