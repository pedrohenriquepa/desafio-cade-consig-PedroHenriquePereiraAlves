import { IsString, MinLength } from "class-validator";

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3)
  usuario: string;

  @IsString()
  @MinLength(6)
  senha: string;
}
