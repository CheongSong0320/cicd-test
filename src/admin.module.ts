import { AuthModule } from '@backend-sw-development-team4/nestjs-authorization';
import { Module } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { AdminReservationModule } from './reservation/interface/reservation.admin.module';

@Module({
    imports: [
        AuthModule.forKeys({
            admin: readFileSync(resolve(__dirname, '../public.admin.key'), {
                encoding: 'utf-8',
            }),
        }),
        AdminReservationModule,
    ],
})
export class AdminModule {}
