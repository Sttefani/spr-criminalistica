/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    // A dependência com o AuthModule é necessária porque o UsersController
    // usa os Guards de autenticação e de perfil.
    forwardRef(() => AuthModule),

    // A importação do AuthoritiesModule foi removida.
    // O UsersModule não precisa mais saber sobre ele.
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}