import { API_USER, Auth, JwtPayload, Resident, UserTokenPayload } from '@backend-sw-development-team4/nestjs-authorization';
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

    /**
     * 사용자가 시설별 예약을 조회합니다.
     */
    @Get()
    @Auth(API_USER)
    @Resident()
    findReservationByCommunity(@JwtPayload() payload: UserTokenPayload) {
        console.log(payload);
        return this.reservationService.findReservationByCommunity(payload.id);
    }

    /**
     * 사용자가 검색을 통하여 오늘 내의 예약 목록을 조회합니다.
     */
    @Get('search')
    @Auth(API_USER)
    @Resident()
    @ApiResponse({ type: [TodayReservationRespone] })
    getTodayReservation(@JwtPayload() payload: UserTokenPayload, @Query() query: GetReservationQuery) {
        return this.reservationService.getTodayReservation(payload.id, query);
    }

    /**
     * 사용자가 검색을 통하여 자신의 예약 내역 목록을 조회합니다.
     */
    @Get('history')
    @Auth(API_USER)
    @Resident()
    getHistoryByQueryType(@JwtPayload() payload: UserTokenPayload, @Query() query: GetReservationHistoryQuery) {
        return this.reservationService.getHistoryByQueryType(payload.id, query);
    }

    /**
     * 사용자가 시설 목록을 조회합니다.
     */
    @Get('/community')
    @Auth(API_USER)
    @Resident()
    getCommunityClub(@JwtPayload() payload: UserTokenPayload) {
        return this.reservationService.getCommunityClub(payload?.apartment?.id ?? 1);
    }

    /**
     * 사용자가 자신의 특정 예약을 제거합니다.
     */
    @Delete(':id')
    @Auth(API_USER)
    @Resident()
    deleteReservation(@JwtPayload() payload: UserTokenPayload, @Param('id') id: string) {
        return this.reservationService.deleteReservation(+id);
    }

    /**
     * 사용자가 자신의 특정 예약을 업데이트합니다.
     */
    @Patch(':id')
    @Auth(API_USER)
    @Resident()
    updateReservation(@JwtPayload() payload: UserTokenPayload, @Param('id') id: number, @Body() body: MakeReservationBody) {
        return this.reservationService.updateReservation(+id, body);
    }

    /**
     * 사용자가 특정 시설의 예약 가능한 날짜를 조회합니다.
     */
    @Get('community/:id/reservation-available/dates')
    @Auth(API_USER)
    @Resident()
    getAvailableDate(@Param() param: GetAvailableDateParam, @Query() query: GetAvailableDateQuery) {
        return this.reservationService.getAvailableDate(+param.id, query);
    }

    /**
     * 사용자가 특정 시설의 예약 가능한 시간 현황을 조회합니다.
     */
    @Get('community/:id/reservation-available/slots')
    @Auth(API_USER)
    @Resident()
    getAvailableSlot(@Param() param: GetAvailableDateParam, @Query() query: GetAvailableSlotQuery) {
        return this.reservationService.getAvailableSlot(+param.id, query);
    }

    /**
     * 사용자가 특정 시설의 예약 가능한 좌석 현황을 조회합니다.
     */
    @Get('community/:id/reservation-available/seats')
    @Auth(API_USER)
    @Resident()
    getAvailableSeat(@Param() param: GetAvailableDateParam, @Query() query: GetAvailableSeatQuery) {
        return this.reservationService.getAvailableSeat(+param.id, query);
    }

    /**
     * 사용자가 특정 시설에 대한 예약을 등록합니다.
     */
    @Post('community/:id')
    @Auth(API_USER)
    @Resident()
    registerReservation(@Param('id') id: string, @Body() body: RegisterReservationBody, @JwtPayload() payload: UserTokenPayload) {
        return this.reservationService.registerReservation(+id, body, payload);
    }

    /**
     * 사용자가 특정 시설에 대한 정보를 조회합니다.
     */
    @Get('community/:id')
    @Auth(API_USER)
    @Resident()
    getCommunityById(@Param('id') id: string) {
        return this.reservationService.getCommunityById(+id);
    }

    /**
     * 사용자가 특정 예약을 조회합니다.
     */
    @Get(':id')
    @Auth(API_USER)
    @Resident()
    findUniqueReservation(@Param('id') id: string) {
        return this.reservationService.findUniqueReservation(+id);
    }
}
