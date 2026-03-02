require("dotenv").config();
const app = require("./src/app");
const prisma = require("./src/config/prisma");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});
