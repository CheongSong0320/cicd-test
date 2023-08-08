import { AdminTokenPayload, API_ADMIN, Auth, JwtPayload } from '@backend-sw-development-team4/nestjs-authorization';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RegisterCommunityDto } from '../application/dto/admin/registerCommunity.dto';

import { Reservation } from '@prisma/client';
import { QueryDto } from '../application/dto/admin/searchReservation.dto';
import { ReservationAdminService } from '../application/reservation.admin.service';
import { ReservationDto } from '../domain/prisma/reservation.dto';
import { RegisterCommunityBody, UpdateCommunityBody } from '../interface/community.interface';
import { GetCommunityUsageStatusDetailQuery } from '../interface/getCommunityUsageStatusDetail.dto';
import { PatchReservationBody } from '../interface/patchReservation.admin.dto';

@Controller('reservation')
export class ReservationAdminController {
    constructor(private readonly reservationService: ReservationAdminService) {}

    /**
     * 관리자가 시설을 등록합니다.
     */
    @Post('community')
    @ApiOkResponse({ type: RegisterCommunityDto })
    @Auth(API_ADMIN)
    registerCommunity(@Body() body: RegisterCommunityBody, @JwtPayload() payload: AdminTokenPayload) {
        return this.reservationService.registerCommunity(body, payload);
    }

    /**
     * 관리자가 특정 ID의 시설을 제거합니다.
     */
    @Delete('community/:id')
    @Auth(API_ADMIN)
    deleteCommunity(@Param('id') id: string, @JwtPayload() payload: AdminTokenPayload) {
        return this.reservationService.deleteCommunity(payload, +id);
    }

    /**
     * 관리자가 특정 ID의 시설을 편집합니다.
     */
    @Patch('community/:id')
    @Auth(API_ADMIN)
    updateCommunity(@Param('id') id: string, @Body() body: UpdateCommunityBody, @JwtPayload() payload: AdminTokenPayload) {
        return this.reservationService.updateCommunity(payload, +id, body);
    }

    /**
     * 관리자가 시설들의 사용 현황을 조회합니다.
     */
    @Get('community/usage-status')
    @Auth(API_ADMIN)
    getCommunityUsageStatus(@JwtPayload() payload: AdminTokenPayload, @Query('year') year?: string, @Query('month') month?: string) {
        return this.reservationService.getCommunityUsageStatus(payload, year ? +year : new Date().getFullYear(), month ? +month - 1 : new Date().getMonth());
    }

    /**
     * 관리자가 시설들의 사용 현황 세부내역을 조회합니다.
     */
    @Get('community/usage-status/detail')
    @Auth(API_ADMIN)
    getCommunityUsageStatusDetail(@JwtPayload() payload: AdminTokenPayload, @Query() query: GetCommunityUsageStatusDetailQuery) {
        return this.reservationService.getCommunityUsageStatusDetail(payload, query);
    }

    /**
     * 관리자가 시설들의 시간 제한 세부내역을 조회합니다.
     */
    @Get('community/time-limit/detail')
    @Auth(API_ADMIN)
    getTimeLimitReservationDetail(@JwtPayload() payload: AdminTokenPayload) {
        return this.reservationService.getTimeLimitReservationDetail(payload);
    }

    /**
     * 관리자가 시설 목록을 조회합니다.
     */
    @Get('community')
    @Auth(API_ADMIN)
    getCommunityClubs(@JwtPayload() payload: AdminTokenPayload) {
        return this.reservationService.getCommunityClubs(payload);
    }

    /**
     * 관리자가 특정 시설의 예약 목록을 가져옵니다.
     */
    @Get(':communityClubId')
    @Auth(API_ADMIN)
    getReservationByCommunityClub(@JwtPayload() payload: AdminTokenPayload, @Param('communityClubId') communityClubId: string): Promise<Reservation[]> {
        return this.reservationService.getReservationByCommunityClub(payload, +communityClubId);
    }

    /**
     * 관리자가 특정 ID의 예약을 승인/반려 처리합니다.
     */
    @Patch(':id')
    @Auth(API_ADMIN)
    approveReservation(@JwtPayload() payload: AdminTokenPayload, @Param('id') id: string, @Body() body: PatchReservationBody): Promise<Reservation> {
        return this.reservationService.approveReservation(payload, +id, body);
    }

    /**
     * 관리자가 특정 시설에 대한 예약 목록을 검색합니다.
     */
    @Get('community/reservation')
    @ApiOkResponse({ type: [ReservationDto] })
    @Auth(API_ADMIN)
    reservationAfterNow(@JwtPayload() payload: AdminTokenPayload, @Query() query: QueryDto): Promise<ReservationDto[]> {
        return this.reservationService.searchReservation(payload, query);
    }
}
