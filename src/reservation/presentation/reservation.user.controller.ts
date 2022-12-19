import { Body, Controller, Delete, Get, Param, Post, Query, Patch } from '@nestjs/common';
import { API_USER, Auth, JwtPayload, UserTokenPayload } from '@hanwha-sbi/nestjs-authorization';
import { ApiResponse } from '@nestjs/swagger';

import { ReservationUserService } from '../application/reservation.user.service';
import {
    GetAvailableDateParam,
    MakeReservationBody,
    GetAvailableDateQuery,
    GetAvailableSlotQuery,
    GetAvailableSeatQuery,
    GetReservationHistoryQuery,
    RegisterReservationBody,
    GetReservationQuery,
} from '../interface/reservation.interface';
import { TodayReservationRespone } from '../interface/todayReservation.dto';

@Controller('reservation')
export class ReservationUserController {
    constructor(private readonly reservationService: ReservationUserService) {}

    @Get()
    @Auth(API_USER)
    findReservationByCommunity(@JwtPayload() payload: UserTokenPayload) {
        return this.reservationService.findReservationByCommunity(payload.id);
    }

    @Get('search')
    @Auth(API_USER)
    @ApiResponse({ type: [TodayReservationRespone] })
    getTodayReservation(@JwtPayload() payload: UserTokenPayload, @Query() query: GetReservationQuery) {
        return this.reservationService.getTodayReservation(payload.id, query);
    }

    @Get('history')
    @Auth(API_USER)
    getHistoryByQueryType(@JwtPayload() payload: UserTokenPayload, @Query() query: GetReservationHistoryQuery) {
        return this.reservationService.getHistoryByQueryType(payload.id, query);
    }

    @Get('/community')
    @Auth(API_USER)
    getCommunityClub(@JwtPayload() payload: UserTokenPayload) {
        return this.reservationService.getCommunityClub(payload?.apartment?.id ?? 1);
    }

    @Delete(':id')
    @Auth(API_USER)
    deleteReservation(@JwtPayload() payload: UserTokenPayload, @Param('id') id: string) {
        return this.reservationService.deleteReservation(+id);
    }

    @Patch(':id')
    @Auth(API_USER)
    updateReservation(@JwtPayload() payload: UserTokenPayload, @Param('id') id: number, @Body() body: MakeReservationBody) {
        return this.reservationService.updateReservation(+id, body);
    }

    @Get('community/:id/reservation-available/dates')
    @Auth(API_USER)
    getAvailableDate(@Param() param: GetAvailableDateParam, @Query() query: GetAvailableDateQuery) {
        return this.reservationService.getAvailableDate(+param.id, query);
    }

    @Get('community/:id/reservation-available/slots')
    @Auth(API_USER)
    getAvailableSlot(@Param() param: GetAvailableDateParam, @Query() query: GetAvailableSlotQuery) {
        return this.reservationService.getAvailableSlot(+param.id, query);
    }

    @Get('community/:id/reservation-available/seats')
    @Auth(API_USER)
    getAvailableSeat(@Param() param: GetAvailableDateParam, @Query() query: GetAvailableSeatQuery) {
        return this.reservationService.getAvailableSeat(+param.id, query);
    }

    @Post('community/:id')
    @Auth(API_USER)
    registerReservation(@Param('id') id: string, @Body() body: RegisterReservationBody, @JwtPayload() payload: UserTokenPayload) {
        return this.reservationService.registerReservation(+id, body, payload);
    }

    @Get('community/:id')
    @Auth(API_USER)
    getCommunityById(@Param('id') id: string) {
        return this.reservationService.getCommunityById(+id);
    }

    @Get(':id')
    @Auth(API_USER)
    findUniqueReservation(@Param('id') id: string) {
        return this.reservationService.findUniqueReservation(+id);
    }
}
