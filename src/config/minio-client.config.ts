// Arquivo: src/config/minio-client.config.ts

import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';

export const MINIO_CLIENT = 'MINIO_CLIENT';

export const MinioClientProvider: Provider = {
  provide: MINIO_CLIENT,
  // A função de fábrica agora é assíncrona para usar 'await'
  useFactory: async (configService: ConfigService) => {
    // 1. Buscamos todas as variáveis de ambiente.
    const accessKeyId = configService.get<string>('MINIO_ACCESS_KEY');
    const secretAccessKey = configService.get<string>('MINIO_SECRET_KEY');
    const endpoint = `http://${configService.get('MINIO_ENDPOINT')}:${configService.get(
      'MINIO_PORT',
    )}`;
    const bucketName = configService.get<string>('MINIO_BUCKET');

    // 2. Adicionamos uma verificação de segurança.
    if (!accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error(
        'As configurações do MinIO (MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET) não estão definidas no ambiente.',
      );
    }

    // 3. Criamos o cliente S3.
    const s3Client = new S3Client({
      endpoint: endpoint,
      region: 'us-east-1', // Região padrão para MinIO
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: true, // Necessário para MinIO
    });

    // 4. Verificamos se o bucket existe e o criamos se necessário.
    try {
      // O comando HeadBucketCommand é a forma mais eficiente de verificar a existência.
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log(`Bucket "${bucketName}" já existe.`);
    } catch (error) {
      // Se o erro for 'NotFound', significa que o bucket não existe e podemos criá-lo.
      if (error.name === 'NotFound') {
        try {
          console.log(`Bucket "${bucketName}" não encontrado. Criando...`);
          await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
          console.log(`Bucket "${bucketName}" criado com sucesso.`);
        } catch (createError) {
          console.error(`Erro fatal ao tentar criar o bucket "${bucketName}":`, createError);
          throw createError;
        }
      } else {
        // Se for outro erro (ex: credenciais erradas), a aplicação deve parar.
        console.error('Erro inesperado ao verificar o bucket:', error);
        throw error;
      }
    }

    // 5. Retornamos o cliente S3 pronto para ser usado.
    return s3Client;
  },
  inject: [ConfigService],
};
