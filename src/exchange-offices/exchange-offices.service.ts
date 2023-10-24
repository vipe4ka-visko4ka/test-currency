import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';

import { PrismaService } from '../prisma/prisma.service';
import { FileParserService } from '../file-parser/file-parser.service';
import { topOfficesByTopCountriesQuery } from './exchange-offices.query';

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

  public async getTopOfficesByTopCountries() {
    const queryResult = await this.prismaService.$queryRaw<any[]>(
      topOfficesByTopCountriesQuery,
    );

    const groupedByCountry = _.groupBy(queryResult, 'country_name');

    const formatted = Object.entries(groupedByCountry).map(([key, value]) => {
      const countryProfit = value[0].country_profit;

      return {
        countryName: key,
        countryProfit,
        topExchangeOffices: value,
      };
    });

    return formatted;
  }
}
