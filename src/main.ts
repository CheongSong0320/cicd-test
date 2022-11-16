import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import { AdminModule } from './admin.module';
import { UserModule } from './user.module';
import { InternalModule } from './internal.module';

async function bootstrap() {
  console.log('!!!');
  await bootstrapAdmin();
  await bootstrapUser();
  await bootstrapInternal();
}

async function bootstrapAdmin() {
  const app = await NestFactory.create(AdminModule, {});
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const options = new DocumentBuilder()
    .setTitle('Apartment Service - Admin')
    .setVersion('1.0')
    .setDescription('The apartment service api documentation for admin')
    .addBearerAuth()
    .addServer(process.env.ADMIN_BASE_PATH || '/')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.ADMIN_HTTP_PORT ?? 3000);
}

async function bootstrapUser() {
  const app = await NestFactory.create(UserModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const options = new DocumentBuilder()
    .setTitle('Apartment Service - User')
    .setVersion('1.0')
    .setDescription('The apartment service api documentation for admin')
    .addBearerAuth()
    .addServer(process.env.USER_BASE_PATH || '/')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.USER_HTTP_PORT ?? 3001);
}

async function bootstrapInternal() {
  const app = await NestFactory.create(InternalModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const options = new DocumentBuilder()
    .setTitle('Apartment Service - Internal')
    .setVersion('1.0')
    .setDescription('The apartment service api documentation for admin')
    .addBearerAuth()
    .addServer(process.env.INTERNAL_BASE_PATH || '/')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.INTERNAL_HTTP_PORT ?? 3002);
}

bootstrap().then(() => {
  console.log('Server Start!');
});
