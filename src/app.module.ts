/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './config/typeorm.config';

// NOVO: 1. Importar o SeedModule para que a aplicação saiba que ele existe.
import { SeedModule } from './common/seeds/seed.module'; // ⚠️ Verifique se este é o caminho correto para o seu SeedModule!

// Importação de TODOS os seus módulos de negócio
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthoritiesModule } from './authorities/authorities.module';
import { CitiesModule } from './cities/cities.module';
import { RequestingUnitsModule } from './requesting-units/requesting-units.module';
import { ForensicServicesModule } from './forensic-services/forensic-services.module';
import { OccurrenceClassificationsModule } from './occurrence-classifications/occurrence-classifications.module';
import { ProceduresModule } from './procedures/procedures.module';
import { ExamTypesModule } from './exam-types/exam-types.module';
import { PreliminaryDrugTestsModule } from './preliminary-drug-tests/preliminary-drug-tests.module';
import { DefinitiveDrugTestsModule } from './definitive-drug-tests/definitive-drug-tests.module';
import { GeneralOccurrencesModule } from './general-occurrences/general-occurrences.module';
import { RequestedExamsModule } from './requested-exams/requested-exams.module';
import { TrafficAccidentDetailsModule } from './traffic-accident-details/traffic-accident-details.module';
import { PropertyCrimeDetailsModule } from './property-crime-details/property-crime-details.module';
import { CrimeAgainstPersonDetailsModule } from './crime-against-person-details/crime-against-person-details.module';
import { GeneticComparisonDetailsModule } from './genetic-comparison-details/genetic-comparison-details.module';
import { ComputerForensicsDetailsModule } from './computer-forensics-details/computer-forensics-details.module';
import { BiologyForensicsDetailsModule } from './biology-forensics-details/biology-forensics-details.module';
import { BallisticsDetailsModule } from './ballistics-details/ballistics-details.module';
import { DocumentoscopyDetailsModule } from './documentoscopy-details/documentoscopy-details.module';
import { VehicleIdentificationDetailsModule } from './vehicle-identification-details/vehicle-identification-details.module';
import { EnvironmentalCrimeDetailsModule } from './environmental-crime-details/environmental-crime-details.module';
import { ChemistryForensicsDetailsModule } from './chemistry-forensics-details/chemistry-forensics-details.module';
import { LocationsModule } from './locations/locations.module';
import { PatrimonyItemsModule } from './patrimony-items/patrimony-items.module';
import { PatrimonyMovementsModule } from './patrimony-movements/patrimony-movements.module';
import { PatrimonyClassificationsModule } from './patrimony-classifications/patrimony-classifications.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { FuelingsModule } from './fuelings/fuelings.module';
import { MaintenancesModule } from './maintenances/maintenances.module';
import { MalfunctionReportsModule } from './malfunction-reports/malfunction-reports.module';
import { StockItemsModule } from './stock-items/stock-items.module';
import { StockEntriesModule } from './stock-entries/stock-entries.module';
import { StockUsagesModule } from './stock-usages/stock-usages.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    // --- Módulos de Infraestrutura ---
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    EventEmitterModule.forRoot(),

    
    SeedModule,

    // --- Módulos de Negócio ---
    UsersModule,
    AuthModule,
    AuthoritiesModule,
    CitiesModule,
    RequestingUnitsModule,
    ForensicServicesModule,
    OccurrenceClassificationsModule,
    ProceduresModule,
    ExamTypesModule,
    PreliminaryDrugTestsModule,
    DefinitiveDrugTestsModule,
    GeneralOccurrencesModule,
    RequestedExamsModule,
    TrafficAccidentDetailsModule,
    PropertyCrimeDetailsModule,
    CrimeAgainstPersonDetailsModule,
    GeneticComparisonDetailsModule,
    ComputerForensicsDetailsModule,
    BiologyForensicsDetailsModule,
    BallisticsDetailsModule,
    DocumentoscopyDetailsModule,
    VehicleIdentificationDetailsModule,
    EnvironmentalCrimeDetailsModule,
    ChemistryForensicsDetailsModule,
    LocationsModule,
    PatrimonyItemsModule,
    PatrimonyMovementsModule,
    PatrimonyClassificationsModule,
    VehiclesModule,
    FuelingsModule,
    MaintenancesModule,
    MalfunctionReportsModule,
    StockItemsModule,
    StockEntriesModule,
    StockUsagesModule,
    ProvidersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}