import { BadRequestException, Injectable } from "@nestjs/common";
import { parse } from "csv-parse/sync";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ListContratosQuery } from "./dto/list-contratos.query";

type ParsedRow = {
  nome: string;
  email: string;
  plano: string;
  valor: string;
  status: string;
  data_inicio: string;
};

@Injectable()
export class ContratosService {
  constructor(private readonly prisma: PrismaService) {}

  async processUpload(file: Express.Multer.File) {
    let records: ParsedRow[];

    try {
      records = parse(file.buffer.toString("utf-8"), {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (error) {
      throw new BadRequestException("CSV invalido.");
    }

    if (records.length === 0) {
      throw new BadRequestException("CSV sem linhas de dados.");
    }

    if (records.length > 100) {
      throw new BadRequestException("CSV excede o limite de 100 linhas.");
    }

    const errors: string[] = [];
    const data: Prisma.ContratoCreateManyInput[] = records.map((row, index) => {
      const line = index + 2;
      const nome = row.nome?.trim();
      const email = row.email?.trim();
      const plano = normalizePlano(row.plano);
      const status = normalizeStatus(row.status);
      const valor = Number(String(row.valor).replace(",", "."));
      const dataInicio = new Date(row.data_inicio);

      if (!nome) {
        errors.push(`Linha ${line}: nome vazio.`);
      }
      if (!email) {
        errors.push(`Linha ${line}: email vazio.`);
      }
      if (!plano) {
        errors.push(`Linha ${line}: plano invalido.`);
      }
      if (!status) {
        errors.push(`Linha ${line}: status invalido.`);
      }
      if (!Number.isFinite(valor)) {
        errors.push(`Linha ${line}: valor invalido.`);
      }
      if (Number.isFinite(valor) && valor < 0) {
        errors.push(`Linha ${line}: valor negativo.`);
      }
      if (!row.data_inicio || Number.isNaN(dataInicio.getTime())) {
        errors.push(`Linha ${line}: data_inicio invalida.`);
      }

      return {
        nome_cliente: nome ?? "",
        email_cliente: email ?? "",
        tipo_plano: plano ?? "BASICO",
        status: status ?? "ATIVO",
        valor_mensal: new Prisma.Decimal(Number.isFinite(valor) ? valor : 0),
        data_inicio: Number.isNaN(dataInicio.getTime())
          ? new Date()
          : dataInicio,
      };
    });

    if (errors.length > 0) {
      throw new BadRequestException({
        message: "Erros de validacao no CSV.",
        errors,
      });
    }

    const result = await this.prisma.contrato.createMany({ data });
    return { inserted: result.count };
  }

  async listContratos(query: ListContratosQuery) {
    const where: Prisma.ContratoWhereInput = {};

    if (query.id_contrato) {
      where.id_contrato = query.id_contrato;
    }
    if (query.nome_cliente) {
      where.nome_cliente = { contains: query.nome_cliente, mode: "insensitive" };
    }
    if (query.email_cliente) {
      where.email_cliente = { contains: query.email_cliente, mode: "insensitive" };
    }
    if (query.tipo_plano) {
      const plano = normalizePlano(query.tipo_plano);
      if (!plano) {
        throw new BadRequestException("tipo_plano invalido.");
      }
      where.tipo_plano = plano;
    }
    if (query.status) {
      const status = normalizeStatus(query.status);
      if (!status) {
        throw new BadRequestException("status invalido.");
      }
      where.status = status;
    }
    if (query.valor_mensal !== undefined) {
      const valor = Number(String(query.valor_mensal).replace(",", "."));
      if (!Number.isFinite(valor)) {
        throw new BadRequestException("valor_mensal invalido.");
      }
      where.valor_mensal = new Prisma.Decimal(valor);
    }
    if (query.data_inicio) {
      const date = new Date(query.data_inicio);
      if (Number.isNaN(date.getTime())) {
        throw new BadRequestException("data_inicio invalida.");
      }
      where.data_inicio = date;
    }

    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.contrato.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.contrato.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}

function normalizePlano(value?: string) {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === "basico") return "BASICO";
  if (v === "pro") return "PRO";
  if (v === "enterprise") return "ENTERPRISE";
  return null;
}

function normalizeStatus(value?: string) {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === "ativo") return "ATIVO";
  if (v === "inativo") return "INATIVO";
  return null;
}
