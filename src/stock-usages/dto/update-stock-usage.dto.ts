import { PartialType } from '@nestjs/mapped-types';
import { CreateStockUsageDto } from './create-stock-usage.dto';

// Este DTO não será utilizado se seguirmos a prática de não editar lançamentos.
export class UpdateStockUsageDto extends PartialType(CreateStockUsageDto) {}