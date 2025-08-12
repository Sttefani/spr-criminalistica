import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrafficAccidentDetailsService } from './traffic-accident-details.service';
import { CreateTrafficAccidentDetailDto } from './dto/create-traffic-accident-detail.dto';
import { UpdateTrafficAccidentDetailDto } from './dto/update-traffic-accident-detail.dto';

@Controller('traffic-accident-details')
export class TrafficAccidentDetailsController {
  constructor(private readonly trafficAccidentDetailsService: TrafficAccidentDetailsService) {}

  @Post()
  create(@Body() createTrafficAccidentDetailDto: CreateTrafficAccidentDetailDto) {
    return this.trafficAccidentDetailsService.create(createTrafficAccidentDetailDto);
  }

  @Get()
  findAll() {
    return this.trafficAccidentDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trafficAccidentDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrafficAccidentDetailDto: UpdateTrafficAccidentDetailDto) {
    return this.trafficAccidentDetailsService.update(+id, updateTrafficAccidentDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trafficAccidentDetailsService.remove(+id);
  }
}
