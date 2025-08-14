import { Injectable } from '@nestjs/common';
import { CreatePatrimonyClassificationDto } from './dto/create-patrimony-classification.dto';
import { UpdatePatrimonyClassificationDto } from './dto/update-patrimony-classification.dto';

@Injectable()
export class PatrimonyClassificationsService {
  create(createPatrimonyClassificationDto: CreatePatrimonyClassificationDto) {
    return 'This action adds a new patrimonyClassification';
  }

  findAll() {
    return `This action returns all patrimonyClassifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patrimonyClassification`;
  }

  update(id: number, updatePatrimonyClassificationDto: UpdatePatrimonyClassificationDto) {
    return `This action updates a #${id} patrimonyClassification`;
  }

  remove(id: number) {
    return `This action removes a #${id} patrimonyClassification`;
  }
}
