import { Module } from '@nestjs/common';

import { ExchangeOfficesModule } from './exchange-offices/exchange-offices.module';

@Module({
  imports: [ExchangeOfficesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
