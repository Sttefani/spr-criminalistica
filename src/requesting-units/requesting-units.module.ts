import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importe
import { RequestingUnitsService } from './requesting-units.service';
import { RequestingUnitsController } from './requesting-units.controller';
import { RequestingUnit } from './entities/requesting-unit.entity'; // Importe

@Module({
  imports: [TypeOrmModule.forFeature([RequestingUnit])], // Adicione esta linha
  controllers: [RequestingUnitsController],
  providers: [RequestingUnitsService],
})
export class RequestingUnitsModule {}