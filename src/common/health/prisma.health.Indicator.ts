import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService, ReadOnlyPrismaService } from 'src/providers/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
    constructor(private readonly prismaService: PrismaService, private readonly readOnlyPrismaService: ReadOnlyPrismaService) {
        super();
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            await this.readOnlyPrismaService.$queryRaw`SELECT 1`;
            return this.getStatus(key, true);
        } catch (e) {
            throw new HealthCheckError('Prisma check failed', e);
        }
    }
}
