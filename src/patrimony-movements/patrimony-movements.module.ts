// ... imports
// Arquivo: src/patrimony-movements/patrimony-movements.module.ts

import { Module } from '@nestjs/common'; // <-- ADICIONE ESTA LINHA
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- ADICIONE ESTA LINHA

// ... (seus outros imports para Services, Controllers e Entidades)
import { PatrimonyMovementsService } from './patrimony-movements.service';
import { PatrimonyMovementsController } from './patrimony-movements.controller';
import { PatrimonyMovement } from './entities/patrimony-movement.entity';
import { PatrimonyItem } from 'src/patrimony-items/entities/patrimony-item.entity';
import { Location } from 'src/locations/entities/location.entity';
import { User } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatrimonyMovement,
      PatrimonyItem,
      Location,
      User,
    ]),
  ],
  controllers: [PatrimonyMovementsController],
  providers: [PatrimonyMovementsService],
})
export class PatrimonyMovementsModule {}