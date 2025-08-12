// Arquivo: test/testing.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Importe TODOS os seus módulos de negócio
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
// ... importe todos os outros
import { DocumentsModule } from '../src/documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Configuração de banco de dados explícita para TESTE
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'spr_pericia_db_test',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: true,
    }),
    // Seus módulos de negócio
    UsersModule,
    AuthModule,
    // ... todos os outros
    DocumentsModule,
  ],
})
export class TestingModule {}