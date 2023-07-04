import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            log: [
                { emit: 'stdout', level: 'query' },
                { emit: 'stdout', level: 'error' },
            ],
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}

@Injectable()
export class ReadOnlyPrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            log: [
                { emit: 'stdout', level: 'query' },
                { emit: 'stdout', level: 'error' },
            ],

            datasources: {
                db: {
                    url: process.env.DATABASE_URL_REPLICA,
                },
            },
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}
