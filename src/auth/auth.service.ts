import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { usuario: dto.usuario },
    });

    if (!user) {
      throw new UnauthorizedException("Credenciais invalidas.");
    }

    const ok = await compare(dto.senha, user.senha_hash);
    if (!ok) {
      throw new UnauthorizedException("Credenciais invalidas.");
    }

    const payload = { sub: user.id_usuario, usuario: user.usuario };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
