import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { FileParserService } from '../file-parser/file-parser.service';

@Injectable()
export class ExchangeOfficesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileParserService: FileParserService,
  ) {}

  public async uploadOfficesFromFile(file: string) {
    const result = this.fileParserService.parseFile(file) as any;

    const countriesCreateData: Prisma.countriesCreateManyInput[] =
      result.countries.map((country) => ({
        code: country.code,
        name: country.name,
      }));

    await this.prismaService.countries.createMany({
      data: countriesCreateData,
    });

    await this.prismaService.$transaction(
      result['exchange-offices'].map((exchangeOffice) => {
        const exchanges = (exchangeOffice.exchanges ?? []).map((exchange) => ({
          from: exchange.from,
          to: exchange.to,
          ask: exchange.ask,
          date: new Date(exchange.date),
        }));

        const rates = (exchangeOffice.rates ?? []).map((rate) => ({
          from: rate.from,
          to: rate.to,
          in: rate.in,
          out: rate.out,
          reserve: rate.reserve,
          date: new Date(rate.date),
        }));

        return this.prismaService.exchange_offices.create({
          data: {
            name: exchangeOffice.name,
            country: {
              connect: { code: exchangeOffice.country },
            },
            exchanges: {
              createMany: { data: exchanges },
            },
            rates: {
              createMany: { data: rates },
            },
          },
        });
      }),
    );
  }
}
