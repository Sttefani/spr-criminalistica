import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. IMPORTE
import { ProceduresService } from './procedures.service';
import { ProceduresController } from './procedures.controller';
import { Procedure } from './entities/procedure.entity'; // 2. IMPORTE

@Module({
  imports: [TypeOrmModule.forFeature([Procedure])], // 3. ADICIONE ESTA LINHA
  controllers: [ProceduresController],
  providers: [ProceduresService],
})
export class ProceduresModule {}