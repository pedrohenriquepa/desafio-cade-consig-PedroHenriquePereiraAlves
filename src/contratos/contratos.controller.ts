import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ContratosService } from "./contratos.service";
import { ListContratosQuery } from "./dto/list-contratos.query";

@Controller("contratos")
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Arquivo CSV nao enviado.");
    }

    return this.contratosService.processUpload(file);
  }

  @Get()
  async list(@Query() query: ListContratosQuery) {
    return this.contratosService.listContratos(query);
  }
}
