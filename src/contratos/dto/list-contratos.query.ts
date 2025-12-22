import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

export class ListContratosQuery {
  @IsOptional()
  @IsString()
  id_contrato?: string;

  @IsOptional()
  @IsString()
  nome_cliente?: string;

  @IsOptional()
  @IsString()
  email_cliente?: string;

  @IsOptional()
  @IsString()
  tipo_plano?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  data_inicio?: string;

  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value))
  valor_mensal?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
