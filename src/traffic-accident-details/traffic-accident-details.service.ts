import { Injectable } from '@nestjs/common';
import { CreateTrafficAccidentDetailDto } from './dto/create-traffic-accident-detail.dto';
import { UpdateTrafficAccidentDetailDto } from './dto/update-traffic-accident-detail.dto';

@Injectable()
export class TrafficAccidentDetailsService {
  create(createTrafficAccidentDetailDto: CreateTrafficAccidentDetailDto) {
    return 'This action adds a new trafficAccidentDetail';
  }

  findAll() {
    return `This action returns all trafficAccidentDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trafficAccidentDetail`;
  }

  update(id: number, updateTrafficAccidentDetailDto: UpdateTrafficAccidentDetailDto) {
    return `This action updates a #${id} trafficAccidentDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} trafficAccidentDetail`;
  }
}
