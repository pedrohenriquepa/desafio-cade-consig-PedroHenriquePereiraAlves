-- CreateEnum
CREATE TYPE "TipoPlano" AS ENUM ('BASICO', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "StatusContrato" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "contratos" (
    "id_contrato" TEXT NOT NULL,
    "nome_cliente" TEXT NOT NULL,
    "email_cliente" TEXT NOT NULL,
    "tipo_plano" "TipoPlano" NOT NULL,
    "valor_mensal" DECIMAL(10,2) NOT NULL,
    "status" "StatusContrato" NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id_contrato")
);
