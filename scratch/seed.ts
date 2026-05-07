import { PrismaClient, PaperStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create a user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Shahriar Hossain",
      password: "hashed_password", // In real app, this should be hashed
    },
  });

  // 2. Create a category
  const category = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Computer Science",
    },
  });

  // 3. Create a paper
  const paper = await prisma.paper.create({
    data: {
      categoryId: category.id,
      createdBy: user.id,
      status: PaperStatus.approved,
      versions: {
        create: {
          versionNumber: 1,
          title: "Deep Learning Applications in Climate Science",
          abstract: "This paper explores how deep learning models can be used to predict climate changes with high accuracy.",
          keywords: ["AI", "Climate", "Deep Learning"],
          pdfUrl: "https://example.com/paper.pdf",
          isPublished: true,
        },
      },
      metrics: {
        create: {
          views: 120,
          downloads: 45,
        }
      }
    },
  });

  console.log(`Seeded paper with ID: ${paper.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
