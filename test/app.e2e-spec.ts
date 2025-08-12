// Arquivo: test/app.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource;

  // Damos 30 segundos para o setup do banco de dados terminar.
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideModule(TypeOrmModule.forRootAsync({ useClass: require('../src/config/typeorm.config').TypeOrmConfigService }))
    .useModule(
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
    )
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    
    connection = app.get(DataSource);
  }, 30000); // <-- AUMENTE O TIMEOUT AQUI (30 segundos)

  afterAll(async () => {
    if (connection) await connection.destroy();
    if (app) await app.close();
  }, 30000); // <-- AUMENTE O TIMEOUT AQUI TAMBÉM

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});