import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  // Garante que o UsersModule está disponível para o AuthService
  imports: [
    UsersModule,
    PassportModule,
    // Configuração Assíncrona do JWT para garantir que o ConfigModule já carregou
    JwtModule.registerAsync({
      imports: [ConfigModule], // Diz explicitamente que este módulo depende do ConfigModule
      inject: [ConfigService], // Injeta o ConfigService para que possamos usá-lo
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('Chave secreta do JWT (JWT_SECRET) não definida no arquivo .env');
        }
        return {
          secret: secret,
          signOptions: { expiresIn: '60m' }, // Token expira em 60 minutos
        };
      },
    }),
  ],
  // O AuthController usa os Guards que dependem das estratégias
  controllers: [AuthController],
  // O AuthService precisa do UsersService e do JwtService
  // A LocalStrategy precisa do AuthService
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}