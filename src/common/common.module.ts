import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { PrismaHealthIndicator } from './health/prisma.health.Indicator';
import { PrismaService } from '../providers/prisma.service';

@Module({
    providers: [PrismaHealthIndicator, PrismaService],
    imports: [
        TerminusModule,
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
    ],
    controllers: [HealthController],
})
export class CommonModule {}
