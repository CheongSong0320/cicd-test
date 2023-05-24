import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, map, of } from 'rxjs';

@Injectable()
export class ApiService {
    private readonly logger = new Logger(ApiService.name);
    constructor(private readonly httpService: HttpService) {}

    async createAuditLog(
        apartmentId: number,
        data: {
            action: string;
            menu: string;
            issuer: string;
            content: string;
            timestamp: Date;
        },
    ): Promise<any> {
        const url = `${process.env.AUDIT_SERVICE_URL}/logs`;

        const result = await firstValueFrom(
            this.httpService
                .post(url, {
                    apartmentId,
                    ...data,
                })
                .pipe(
                    map((response: any) => response.data),
                    catchError(err => {
                        this.logger.error(`Failed to create audit logs on ${url}. ERROR: ${err}`);
                        return of(null);
                    }),
                ),
        );

        return result;
    }
}
