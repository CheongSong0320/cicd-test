import {
  AdminTokenPayload,
  API_ADMIN,
  Auth,
  JwtPayload,
} from '@hanwha-sbi/nestjs-authorization';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationAdminService } from '../application/reservation.admin.service';
import {
  RegisterCommunityBody,
  UpdateCommunityBody,
} from '../interface/community.interface';

@Controller('reservation')
export class ReservationAdminController {
  constructor(private readonly reservationService: ReservationAdminService) {}

  @Get()
  find() {
    return this.reservationService.helloReservation();
  }

  @Post('community')
  @Auth(API_ADMIN)
  registerCommunity(
    @Body() body: RegisterCommunityBody,
    @JwtPayload() payload: AdminTokenPayload,
  ) {
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
  getCommunityUsageStatus(@JwtPayload() payload: AdminTokenPayload) {
    return this.reservationService.getCommunityUsageStatus(payload);
  }

  @Get('community/usage-status/detail')
  @Auth(API_ADMIN)
  getCommunityUsageStatusDetail(
    @JwtPayload() payload: AdminTokenPayload,
    @Query('dong') dong: string,
    @Query('ho') ho: string,
  ) {
    return this.reservationService.getCommunityUsageStatusDetail(
      payload,
      dong,
      ho,
    );
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
  getReservationByCommunityClub(
    @JwtPayload() payload: AdminTokenPayload,
    @Param('communityClubId') communityClubId: string,
  ) {
    return this.reservationService.getReservationByCommunityClub(
      payload,
      +communityClubId,
    );
  }

  @Patch(':id/approve')
  @Auth(API_ADMIN)
  approveReservation(@Param('id') id: string) {
    return this.reservationService.approveReservation(+id);
  }
}
