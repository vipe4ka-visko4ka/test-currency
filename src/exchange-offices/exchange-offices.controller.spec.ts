import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeOfficesController } from './exchange-offices.controller';

describe('ExchangeOfficesController', () => {
  let controller: ExchangeOfficesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeOfficesController],
    }).compile();

    controller = module.get<ExchangeOfficesController>(ExchangeOfficesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
