/* eslint-disable prettier/prettier */

import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- IMPORTE O CONFIGMODULE
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    // PONTO CRÍTICO: Importe o ConfigModule aqui para garantir que o
    // ConfigService esteja disponível para o useFactory do JwtModule.
    ConfigModule,

    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      // Remova a importação daqui, pois já está no nível do módulo
      // imports: [ConfigModule], 
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}