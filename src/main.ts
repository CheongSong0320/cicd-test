import { INestApplication, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import * as basicAuth from 'express-basic-auth';
import { AdminModule } from './admin.module';
import { InternalModule } from './internal.module';
import { UserModule } from './user.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

type SwaggerOptions = {
    title: string;
    description: string;
    version: string;
};

function buildSwagger(app: INestApplication, options: SwaggerOptions) {
    const config = new DocumentBuilder().setTitle(options.title).setDescription(options.description).setVersion(options.version).addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, config);
    return document;
}

async function appFactory(module: any, options?: NestApplicationOptions) {
    const app = await NestFactory.create(module, {
        ...options,
    });
    app.enableCors();
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
    app.useLogger(app.get(Logger));
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

    app.use(
        '*/api-docs',
        basicAuth({
            authorizeAsync: true,
            authorizer: (user, password, authorize) => authorize(null, user == process.env.SWAGGER_USER_ID && password == process.env.SWAGGER_USER_PASSWORD),
            challenge: true,
        }),
    );
    return app;
}

async function bootstrap() {
    await bootstrapAdmin();
    await bootstrapUser();
    await bootstrapInternal();
}

async function bootstrapAdmin() {
    const app = await appFactory(AdminModule, {});
    process.env.ADMIN_GLOBAL_PREFIX && app.setGlobalPrefix(process.env.ADMIN_GLOBAL_PREFIX);

    if (['develop', 'local'].includes(process.env.NODE_ENV || '')) {
        const document = buildSwagger(app, {
            title: 'Reservation Service - Admin',
            description: 'The reservation service api documentation for admin',
            version: '1.0',
        });
        SwaggerModule.setup(process.env.ADMIN_GLOBAL_PREFIX ? `${process.env.ADMIN_GLOBAL_PREFIX}/api-docs` : 'api-docs', app, document);
    }

    await app.listen(process.env.ADMIN_HTTP_PORT ?? 3000);
}

async function bootstrapUser() {
    const app = await appFactory(UserModule);
    process.env.USER_GLOBAL_PREFIX && app.setGlobalPrefix(process.env.USER_GLOBAL_PREFIX);

    if (['develop', 'local'].includes(process.env.NODE_ENV || '')) {
        const document = buildSwagger(app, {
            title: 'Reservation Service - User',
            description: 'The reservation service api documentation for admin',
            version: '1.0',
        });
        SwaggerModule.setup(process.env.USER_GLOBAL_PREFIX ? `${process.env.USER_GLOBAL_PREFIX}/api-docs` : 'api-docs', app, document);
    }

    await app.listen(process.env.USER_HTTP_PORT ?? 3001);
}

async function bootstrapInternal() {
    const app = await appFactory(InternalModule);

    if (['develop', 'local'].includes(process.env.NODE_ENV || '')) {
        const document = buildSwagger(app, {
            title: 'Reservation Service - Internal',
            description: 'The reservation service api documentation for admin',
            version: '1.0',
        });
        SwaggerModule.setup(process.env.INTERNAL_GLOBAL_PREFIX ? `${process.env.INTERNAL_GLOBAL_PREFIX}/api-docs` : 'api-docs', app, document);
    }

    await app.listen(process.env.INTERNAL_HTTP_PORT ?? 3002);
}

bootstrap().then(() => {
    console.info('Server Start!');
});
