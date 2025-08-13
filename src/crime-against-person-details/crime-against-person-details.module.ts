import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrimeAgainstPersonDetailsService } from './crime-against-person-details.service';
import { CrimeAgainstPersonDetailsController } from './crime-against-person-details.controller';
import { CrimeAgainstPersonDetail } from './entities/crime-against-person-detail.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity'; // 1. IMPORTE

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CrimeAgainstPersonDetail,
      GeneralOccurrence, // 2. ADICIONE AQUI
    ]),
  ],
  controllers: [CrimeAgainstPersonDetailsController],
  providers: [CrimeAgainstPersonDetailsService],
})
export class CrimeAgainstPersonDetailsModule {}
