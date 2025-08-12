import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. IMPORTE O TYPEORMMODULE
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { City } from 'src/cities/entities/city.entity'; // 2. IMPORTE A ENTIDADE CITY

@Module({
  imports: [TypeOrmModule.forFeature([City])], // 3. ADICIONE ESTA LINHA
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}