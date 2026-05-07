const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const papers = await prisma.paper.findMany({
    include: {
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 1
      }
    }
  });
  console.log("Total papers:", papers.length);
  papers.forEach(p => {
    console.log(`ID: ${p.id}, Title: ${p.versions[0]?.title || 'N/A'}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
