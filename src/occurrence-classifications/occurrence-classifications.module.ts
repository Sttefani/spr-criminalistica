import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OccurrenceClassificationsService } from 'src/occurrence-classifications/occurrence-classifications.service';
import { OccurrenceClassification } from './entities/occurrence-classification.entity';
import { OccurrenceClassificationsController } from './occurrence-classifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OccurrenceClassification])], // Apenas uma entidade
  controllers: [OccurrenceClassificationsController], // Apenas um controller
  providers: [OccurrenceClassificationsService], // Apenas um serviço
})
export class OccurrenceClassificationsModule {}