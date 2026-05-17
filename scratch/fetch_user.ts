import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users.map(u => ({ id: u.id, name: u.name, status: u.status })));
  
  if (users.length > 0) {
    const userId = users[0].id;
    console.log("Fetching profile for:", userId);
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId, status: "active" },
        include: {
          university: { select: { name: true } },
          department: { select: { name: true } },
          _count: {
            select: {
              papers: { where: { isDeleted: false, status: "approved" } },
              followers: true,
              following: true,
            }
          }
        }
      });
      console.log("Profile:", user ? "Found" : "Not Found");
    } catch (e) {
      console.error("Error:", e);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
