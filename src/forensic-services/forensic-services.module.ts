import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. IMPORTE
import { ForensicServicesService } from './forensic-services.service';
import { ForensicServicesController } from './forensic-services.controller';
import { ForensicService } from './entities/forensic-service.entity'; // 2. IMPORTE

@Module({
  imports: [TypeOrmModule.forFeature([ForensicService])], // 3. ADICIONE ESTA LINHA
  controllers: [ForensicServicesController],
  providers: [ForensicServicesService],
})
export class ForensicServicesModule {}