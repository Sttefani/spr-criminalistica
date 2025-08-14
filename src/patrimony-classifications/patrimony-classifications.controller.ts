import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatrimonyClassificationsService } from './patrimony-classifications.service';
import { CreatePatrimonyClassificationDto } from './dto/create-patrimony-classification.dto';
import { UpdatePatrimonyClassificationDto } from './dto/update-patrimony-classification.dto';

@Controller('patrimony-classifications')
export class PatrimonyClassificationsController {
  constructor(private readonly patrimonyClassificationsService: PatrimonyClassificationsService) {}

  @Post()
  create(@Body() createPatrimonyClassificationDto: CreatePatrimonyClassificationDto) {
    return this.patrimonyClassificationsService.create(createPatrimonyClassificationDto);
  }

  @Get()
  findAll() {
    return this.patrimonyClassificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patrimonyClassificationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatrimonyClassificationDto: UpdatePatrimonyClassificationDto) {
    return this.patrimonyClassificationsService.update(+id, updatePatrimonyClassificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patrimonyClassificationsService.remove(+id);
  }
}
