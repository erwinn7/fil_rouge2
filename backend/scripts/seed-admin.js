require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "admin@admin.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@1234";

async function main() {
    const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

    if (existing) {
        // Already exists → promote to ADMIN if needed
        if (existing.role === "ADMIN") {
            console.log(`✔  Admin already exists: ${ADMIN_EMAIL}`);
        } else {
            await prisma.user.update({
                where: { email: ADMIN_EMAIL },
                data: { role: "ADMIN" },
            });
            console.log(`✔  User promoted to ADMIN: ${ADMIN_EMAIL}`);
        }
        return;
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = await prisma.user.create({
        data: {
            email: ADMIN_EMAIL,
            password: hashed,
            role: "ADMIN",
        },
        select: { id: true, email: true, role: true },
    });

    console.log("✔  Admin created:", admin);
    console.log(`   Email    : ${ADMIN_EMAIL}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
}

main()
    .catch((e) => {
        console.error("✖  Error:", e.message);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
