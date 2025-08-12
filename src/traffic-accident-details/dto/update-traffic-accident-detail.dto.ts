import { PartialType } from '@nestjs/mapped-types';
import { CreateTrafficAccidentDetailDto } from './create-traffic-accident-detail.dto';

export class UpdateTrafficAccidentDetailDto extends PartialType(CreateTrafficAccidentDetailDto) {}
