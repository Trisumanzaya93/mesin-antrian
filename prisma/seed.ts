import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.displaySetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      runningText: "Selamat datang di kantor pelayanan kami!",
      content: { 'videoUrl': "/video/video.mp4" },
    },
  });
}

main()
  .then(() => {
    console.log("✅ DisplaySetting seeded");
  })
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
