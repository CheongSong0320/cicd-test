import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { PrismaHealthIndicator } from './health/prisma.health.Indicator';
import { PrismaService, ReadOnlyPrismaService } from '../providers/prisma.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
    providers: [PrismaHealthIndicator, PrismaService, ReadOnlyPrismaService],
    imports: [
        TerminusModule,
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        LoggerModule.forRoot({
            pinoHttp: {
                transport:
                    process.env.NODE_ENV == 'local'
                        ? {
                              target: 'pino-pretty',
                          }
                        : undefined,
                timestamp: () => `,"time":"${new Date().toISOString()}"`,
            },
        }),
    ],
    controllers: [HealthController],
})
export class CommonModule {}
