import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.job.count();
    console.log(`Total jobs in database: ${count}`);

    if (count > 0) {
        const firstJob = await prisma.job.findFirst();
        console.log("First job sample:", firstJob);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
