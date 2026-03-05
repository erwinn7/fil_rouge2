require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
    "Vêtements",
    "Chaussures",
    "Électronique",
    "Accessoires",
    "Sport & Fitness",
    "Maison & Déco",
    "Beauté & Santé",
    "Jouets & Jeux",
    "Livres",
    "Alimentation",
];

async function main() {
    console.log("Seeding categories...\n");
    let created = 0;
    let skipped = 0;

    for (const name of CATEGORIES) {
        const existing = await prisma.category.findUnique({ where: { name } });
        if (existing) {
            console.log(`  Already exists: ${name}`);
            skipped++;
        } else {
            await prisma.category.create({ data: { name } });
            console.log(` Created: ${name}`);
            created++;
        }
    }

    console.log(`\nDone! ${created} created, ${skipped} already existed.`);
}

main()
    .catch((e) => {
        console.error("Error:", e.message);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
