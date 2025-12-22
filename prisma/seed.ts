import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const usuario = "admin";
  const senha = "admin123";
  const senha_hash = await hash(senha, 10);

  await prisma.usuario.upsert({
    where: { usuario },
    update: {},
    create: {
      usuario,
      senha_hash,
    },
  });

  // Keep output short and actionable for local use.
  console.log(`Seed ok: usuario="${usuario}" senha="${senha}"`);
}

main()
  .catch((err) => {
    console.error("Seed falhou:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
