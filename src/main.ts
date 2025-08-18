import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. IMPORTE O VALIDATIONPIPE

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. HABILITA O CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Permite requisições apenas do seu frontend Vue
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });// Permite requisições apenas da sua aplicação Angular


  // 3. HABILITA A VALIDAÇÃO GLOBAL DOS DTOS (BOA PRÁTICA)
  app.useGlobalPipes(
  new ValidationPipe({
    // Remove propriedades que não estão no DTO (segurança)
    whitelist: true,
    forbidNonWhitelisted: true,
    
    // Habilita a transformação automática de payloads para os tipos do DTO
    transform: true,
    
    // Habilita a transformação na resposta também (crucial)
    transformOptions: {
      enableImplicitConversion: true
    },
  }),
)
  await app.listen(3000);
}
bootstrap();