import { API_USER, Auth, JwtPayload, Resident, UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ReservationUserService } from '../application/reservation.user.service';
import {
    GetAvailableDateParam,
    GetAvailableDateQuery,
    GetAvailableSeatQuery,
    GetAvailableSlotQuery,
    GetReservationHistoryQuery,
    GetReservationQuery,
    MakeReservationBody,
    RegisterReservationBody,
} from '../interface/reservation.interface';
import { TodayReservationRespone } from '../interface/todayReservation.dto';

@Controller('reservation')
export class ReservationUserController {
    constructor(private readonly reservationService: ReservationUserService) {}

    @Get()
    @Auth(API_USER)
    @Resident()
    findReservationByCommunity(@JwtPayload() payload: UserTokenPayload) {
        console.log(payload);
        return this.reservationService.findReservationByCommunity(payload.id);
    }

    @Get('search')
    @Auth(API_USER)
    @Resident()
    @ApiResponse({ type: [TodayReservationRespone] })
    getTodayReservation(@JwtPayload() payload: UserTokenPayload, @Query() query: GetReservationQuery) {
        return this.reservationService.getTodayReservation(payload.id, query);
    }

    @Get('history')
    @Auth(API_USER)
    @Resident()
    getHistoryByQueryType(@JwtPayload() payload: UserTokenPayload, @Query() query: GetReservationHistoryQuery) {
        return this.reservationService.getHistoryByQueryType(payload.id, query);
    }

    @Get('/community')
    @Auth(API_USER)
    @Resident()
    getCommunityClub(@JwtPayload() payload: UserTokenPayload) {
        return this.reservationService.getCommunityClub(payload?.apartment?.id ?? 1);
    }

    @Delete(':id')
    @Auth(API_USER)
    @Resident()
    deleteReservation(@JwtPayload() payload: UserTokenPayload, @Param('id') id: string) {
        return this.reservationService.deleteReservation(+id);
    }

    @Patch(':id')
    @Auth(API_USER)
    @Resident()
    updateReservation(@JwtPayload() payload: UserTokenPayload, @Param('id') id: number, @Body() body: MakeReservationBody) {
        return this.reservationService.updateReservation(+id, body);
    }

    @Get('community/:id/reservation-available/dates')
    @Auth(API_USER)
    @Resident()
    getAvailableDate(@Param() param: GetAvailableDateParam, @Query() query: GetAvailableDateQuery) {
        return this.reservationService.getAvailableDate(+param.id, query);
    }

    @Get('community/:id/reservation-available/slots')
    @Auth(API_USER)
    @Resident()
    getAvailableSlot(@Param() param: GetAvailableDateParam, @Query() query: GetAvailableSlotQuery) {
        return this.reservationService.getAvailableSlot(+param.id, query);
    }

    @Get('community/:id/reservation-available/seats')
    @Auth(API_USER)
    @Resident()
    getAvailableSeat(@Param() param: GetAvailableDateParam, @Query() query: GetAvailableSeatQuery) {
        return this.reservationService.getAvailableSeat(+param.id, query);
    }

    @Post('community/:id')
    @Auth(API_USER)
    @Resident()
    registerReservation(@Param('id') id: string, @Body() body: RegisterReservationBody, @JwtPayload() payload: UserTokenPayload) {
        return this.reservationService.registerReservation(+id, body, payload);
    }

    @Get('community/:id')
    @Auth(API_USER)
    @Resident()
    getCommunityById(@Param('id') id: string) {
        return this.reservationService.getCommunityById(+id);
    }

    @Get(':id')
    @Auth(API_USER)
    @Resident()
    findUniqueReservation(@Param('id') id: string) {
        return this.reservationService.findUniqueReservation(+id);
    }
}
