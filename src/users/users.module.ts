/* eslint-disable prettier/prettier */

import { Module, forwardRef } from '@nestjs/common'; // <-- Importe forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { AuthModule } from 'src/auth/auth.module'; // <-- Importe o AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // ==========================================================
    // USA forwardRef PARA QUEBRAR A DEPENDÊNCIA CIRCULAR
    // ==========================================================
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  // ==========================================================
  // EXPORTA o UsersService para que o AuthModule possa usá-lo
  // ==========================================================
  exports: [UsersService],
})
export class UsersModule {}