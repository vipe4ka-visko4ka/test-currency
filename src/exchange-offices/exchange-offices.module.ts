import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { FileParserModule } from '../file-parser/file-parser.module';
import { ExchangeOfficesService } from './exchange-offices.service';
import { ExchangeOfficesController } from './exchange-offices.controller';

@Module({
  imports: [PrismaModule, FileParserModule],
  providers: [ExchangeOfficesService],
  controllers: [ExchangeOfficesController],
})
export class ExchangeOfficesModule {}
