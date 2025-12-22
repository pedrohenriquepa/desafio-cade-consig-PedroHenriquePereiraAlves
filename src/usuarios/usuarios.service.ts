import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { hash } from "bcryptjs";

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async createUsuario(dto: CreateUsuarioDto) {
    const existing = await this.prisma.usuario.findUnique({
      where: { usuario: dto.usuario },
      select: { id_usuario: true },
    });

    if (existing) {
      throw new BadRequestException("Usuario ja existe.");
    }

    const senha_hash = await hash(dto.senha, 10);

    const created = await this.prisma.usuario.create({
      data: {
        usuario: dto.usuario,
        senha_hash,
      },
      select: {
        id_usuario: true,
        usuario: true,
        created_at: true,
      },
    });

    return created;
  }

  async listUsuarios() {
    return this.prisma.usuario.findMany({
      select: {
        id_usuario: true,
        usuario: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });
  }
}
