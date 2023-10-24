import {
  Controller,
  Get,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ExchangeOfficesService } from './exchange-offices.service';

@Controller('exchange-offices')
export class ExchangeOfficesController {
  constructor(
    private readonly exchangeOfficesService: ExchangeOfficesService,
  ) {}

  @Post('upload')
  @HttpCode(204)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadOfficesFromFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.exchangeOfficesService.uploadOfficesFromFile(
      file.buffer.toString(),
    );
  }

  @Get('top')
  public getTopOfficesByTopCountries() {
    return this.exchangeOfficesService.getTopOfficesByTopCountries();
  }
}
