// Arquivo: src/traffic-accident-details/dto/update-traffic-accident-detail.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateTrafficAccidentDetailDto } from './create-traffic-accident-detail.dto';

// A classe UpdateTrafficAccidentDetailDto herda todas as propriedades e
// validadores da CreateTrafficAccidentDetailDto, mas o PartialType
// torna cada uma delas opcional.
export class UpdateTrafficAccidentDetailDto extends PartialType(
  CreateTrafficAccidentDetailDto,
) {}
