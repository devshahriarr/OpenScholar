import { prisma } from "../src/lib/db";

async function main() {
  const papers = await prisma.paper.findMany({
    select: {
      id: true,
      status: true,
      isDeleted: true,
      versions: {
        select: { title: true },
        take: 1
      }
    }
  });

  console.log("Database Stats:");
  console.log("Total Papers:", papers.length);
  
  const statusCounts = papers.reduce((acc: any, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  
  console.log("Status Counts:", statusCounts);
  
  console.log("\nPaper List:");
  papers.forEach(p => {
    console.log(`- [${p.status}] ${p.versions[0]?.title || 'Untitled'} (ID: ${p.id}, Deleted: ${p.isDeleted})`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
