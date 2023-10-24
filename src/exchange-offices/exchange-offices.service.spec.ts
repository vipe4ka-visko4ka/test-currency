import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeOfficesService } from './exchange-offices.service';

describe('ExchangeOfficesService', () => {
  let service: ExchangeOfficesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeOfficesService],
    }).compile();

    service = module.get<ExchangeOfficesService>(ExchangeOfficesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
