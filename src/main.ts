import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ FIX: CORS — wajib agar Android Retrofit bisa akses API
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept',
    credentials: false,
  });

  // ✅ FIX: Global prefix — semua endpoint jadi /api/auth/..., /api/villas/...
  app.setGlobalPrefix('api');

  // ✅ Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // FIX: false agar query params search tidak error
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // auto-convert string -> number di query params
      },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\n🚀 Loka Stay API → http://localhost:${port}/api`);
  console.log(`📱 Ready untuk Android Retrofit!\n`);
}
bootstrap();
