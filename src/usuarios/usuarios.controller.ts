import { Body, Controller, Get, Post } from "@nestjs/common";
import { Public } from "../auth/public.decorator";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UsuariosService } from "./usuarios.service";

@Controller("usuarios")
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.createUsuario(dto);
  }

  @Get()
  list() {
    return this.usuariosService.listUsuarios();
  }
}
