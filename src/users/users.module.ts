import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. IMPORTE AQUI
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity'; // A nossa entidade

@Module({
  // 2. ADICIONE A LINHA ABAIXO
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // <-- ADICIONE ESTA LINHA
})
export class UsersModule {}