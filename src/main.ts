import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. IMPORTE O VALIDATIONPIPE

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. HABILITA O CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Permite requisições apenas da sua aplicação Angular
  });

  // 3. HABILITA A VALIDAÇÃO GLOBAL DOS DTOS (BOA PRÁTICA)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();