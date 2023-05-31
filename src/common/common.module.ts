import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { PrismaHealthIndicator } from './health/prisma.health.Indicator';
import { PrismaService } from '../providers/prisma.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
    providers: [PrismaHealthIndicator, PrismaService],
    imports: [
        TerminusModule,
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        LoggerModule.forRoot({
            pinoHttp: {
                transport: {
                    target: 'pino-pretty',
                },
            },
        }),
    ],
    controllers: [HealthController],
})
export class CommonModule {}
