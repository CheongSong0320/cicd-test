import { AdminTokenPayload, API_ADMIN, Auth, JwtPayload } from '@backend-sw-development-team4/nestjs-authorization';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RegisterCommunityDto } from '../application/dto/admin/registerCommunity.dto';

import { QueryDto } from '../application/dto/admin/searchReservation.dto';
import { ReservationAdminService } from '../application/reservation.admin.service';
import { ReservationDto } from '../domain/prisma/reservation.dto';
import { RegisterCommunityBody, UpdateCommunityBody } from '../interface/community.interface';
import { GetCommunityUsageStatusDetailQuery } from '../interface/getCommunityUsageStatusDetail.dto';
import { PatchReservationBody } from '../interface/patchReservation.admin.dto';

@Controller('reservation')
export class ReservationAdminController {
    constructor(private readonly reservationService: ReservationAdminService) {}

    @Post('community')
    @ApiOkResponse({ type: RegisterCommunityDto })
    @Auth(API_ADMIN)
    registerCommunity(@Body() body: RegisterCommunityBody, @JwtPayload() payload: AdminTokenPayload) {
        return this.reservationService.registerCommunity(body, payload);
    }

    @Delete('community/:id')
    @Auth(API_ADMIN)
    deleteCommunity(@Param('id') id: string) {
        return this.reservationService.deleteCommunity(+id);
    }

    @Patch('community/:id')
    @Auth(API_ADMIN)
    updateCommunity(@Param('id') id: string, @Body() body: UpdateCommunityBody) {
        return this.reservationService.updateCommunity(+id, body);
    }

    @Get('community/usage-status')
    @Auth(API_ADMIN)
    getCommunityUsageStatus(@JwtPayload() payload: AdminTokenPayload, @Query('year') year?: string, @Query('month') month?: string) {
        return this.reservationService.getCommunityUsageStatus(payload, year ? +year : new Date().getFullYear(), month ? +month - 1 : new Date().getMonth());
    }

    @Get('community/usage-status/detail')
    @Auth(API_ADMIN)
    getCommunityUsageStatusDetail(@JwtPayload() payload: AdminTokenPayload, @Query() query: GetCommunityUsageStatusDetailQuery) {
        return this.reservationService.getCommunityUsageStatusDetail(payload, query);
    }

    @Get('community/time-limit/detail')
    @Auth(API_ADMIN)
    getTimeLimitReservationDetail(@JwtPayload() payload: AdminTokenPayload) {
        return this.reservationService.getTimeLimitReservationDetail(payload);
    }

    @Get('community')
    @Auth(API_ADMIN)
    getCommunityClubs(@JwtPayload() payload: AdminTokenPayload) {
        return this.reservationService.getCommunityClubs(payload);
    }

    @Get(':communityClubId')
    @Auth(API_ADMIN)
    getReservationByCommunityClub(@JwtPayload() payload: AdminTokenPayload, @Param('communityClubId') communityClubId: string) {
        return this.reservationService.getReservationByCommunityClub(payload, +communityClubId);
    }

    @Patch(':id')
    @Auth(API_ADMIN)
    approveReservation(@Param('id') id: string, @Body() body: PatchReservationBody) {
        return this.reservationService.approveReservation(+id, body);
    }

    @Get('community/reservation')
    @ApiOkResponse({ type: [ReservationDto] })
    @Auth(API_ADMIN)
    reservationAfterNow(@JwtPayload() payload: AdminTokenPayload, @Query() query: QueryDto) {
        return this.reservationService.searchReservation(payload, query);
    }
}
