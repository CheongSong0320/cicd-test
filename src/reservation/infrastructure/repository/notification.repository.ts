import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationRepository {
    constructor(private readonly httpService: HttpService) {}

    async notification(userId: string, content: string) {
        await firstValueFrom(
            this.httpService.post(`${process.env.APARTMENT_SERVICE_URL}/notifications`, {
                userId,
                content,
                title: '커뮤니티',
                subCategory: 'communityAlert',
                data: {
                    target: 'FacilityBookingList',
                },
            }),
        );
    }
}
