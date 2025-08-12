// Arquivo: src/config/minio-client.config.ts

import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export const MINIO_CLIENT = 'MINIO_CLIENT';

export const MinioClientProvider: Provider = {
  provide: MINIO_CLIENT,
  useFactory: (configService: ConfigService) => {
    // 1. Buscamos todas as variáveis de ambiente em constantes separadas.
    const accessKeyId = configService.get<string>('MINIO_ACCESS_KEY');
    const secretAccessKey = configService.get<string>('MINIO_SECRET_KEY');
    const endpoint = `http://${configService.get('MINIO_ENDPOINT')}:${configService.get('MINIO_PORT')}`;

    // 2. Adicionamos uma verificação de segurança.
    // Se alguma das chaves não for encontrada, a aplicação para com um erro claro.
    if (!accessKeyId || !secretAccessKey) {
      throw new Error('As credenciais do MinIO (MINIO_ACCESS_KEY, MINIO_SECRET_KEY) não estão definidas no ambiente.');
    }

    // 3. Agora, criamos o cliente S3 com a certeza de que as credenciais são strings.
    return new S3Client({
      endpoint: endpoint,
      region: 'us-east-1', // Região padrão para MinIO
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: true, // Necessário para MinIO
    });
  },
  inject: [ConfigService],
};