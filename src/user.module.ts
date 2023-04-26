import { AuthModule } from '@backend-sw-development-team4/nestjs-authorization';
import { Module } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { UserReservationModule } from './reservation/interface/reservation.user.module';

@Module({
    imports: [
        AuthModule.forKeys({
            user: readFileSync(resolve(__dirname, '../public.user.key'), {
                encoding: 'utf-8',
            }),
        }),
        UserReservationModule,
    ],
})
export class UserModule {}
