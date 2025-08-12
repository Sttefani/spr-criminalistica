// Arquivo: src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './config/typeorm.config'; // Importa nossa nova classe de config

// Importação de TODOS os seus módulos de negócio
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CitiesModule } from './cities/cities.module';
import { RequestingUnitsModule } from './requesting-units/requesting-units.module';
import { ForensicServicesModule } from './forensic-services/forensic-services.module';
import { OccurrenceClassificationsModule } from './occurrence-classifications/occurrence-classifications.module';
import { ProceduresModule } from './procedures/procedures.module';
import { ExamTypesModule } from './exam-types/exam-types.module';
import { PreliminaryDrugTestsModule } from './preliminary-drug-tests/preliminary-drug-tests.module';
import { AuthoritiesModule } from './authorities/authorities.module';
import { DocumentsModule } from './documents/documents.module';
import { DefinitiveDrugTestsModule } from './definitive-drug-tests/definitive-drug-tests.module';
import { GeneralOccurrencesModule } from './general-occurrences/general-occurrences.module';
import { RequestedExamsModule } from './requested-exams/requested-exams.module';
import { TrafficAccidentDetailsModule } from './traffic-accident-details/traffic-accident-details.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Configuração do TypeORM usando nossa classe dedicada
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    
    // Lista completa de todos os módulos que a aplicação usa
    UsersModule,
    AuthModule,
    CitiesModule,
    RequestingUnitsModule,
    ForensicServicesModule,
    OccurrenceClassificationsModule,
    ProceduresModule,
    ExamTypesModule,
    PreliminaryDrugTestsModule,
    AuthoritiesModule,
    DocumentsModule,
    DefinitiveDrugTestsModule,
    GeneralOccurrencesModule,
    RequestedExamsModule,
    TrafficAccidentDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}