import { Injectable } from '@nestjs/common';
import { PrismaService, ReadOnlyPrismaService } from 'src/providers/prisma.service';
import { UpdateCommunityBody } from 'src/reservation/interface/community.interface';
import { PatchReservationBody } from 'src/reservation/interface/patchReservation.admin.dto';
import { CommunityClubValidator } from '../validator/communityClub.validator';

@Injectable()
export class CommunityClubRepository {
    constructor(private prisma: PrismaService, private readOnlyPrismaService: ReadOnlyPrismaService) {}

    create(communityClubCreateInput: ReturnType<CommunityClubValidator['registerCommunityClubValidator']>) {
        return this.prisma.communityClub.create(communityClubCreateInput);
    }

    findByApartmentId(communityClubFindManyInput: ReturnType<CommunityClubValidator['findByApartmentIdValidator']>) {
        return this.readOnlyPrismaService.communityClub.findMany(communityClubFindManyInput);
    }

    findCommunityClubWithReservation(args: ReturnType<CommunityClubValidator['findCommunityClubWithReservation']>) {
        return this.readOnlyPrismaService.communityClub.findMany(args);
    }

    findUniqueOrThrow(id: number) {
        return this.readOnlyPrismaService.communityClub.findUniqueOrThrow({
            where: {
                id,
            },
            include: {
                CommunityClubPerson: true,
                CommunityClubSeat: true,
                CommunityClubTimeLimit: true,
            },
        });
    }

    findUniqueRelationType(id: number) {
        return this.readOnlyPrismaService.communityClub.findUniqueOrThrow({
            where: {
                id,
            },
            include: {
                CommunityClubPerson: true,
                CommunityClubSeat: true,
                CommunityClubTimeLimit: true,
            },
        });
    }

    getCommunityClubsAdmin(apartmentId: number) {
        return this.readOnlyPrismaService.communityClub.findMany({
            where: {
                apartmentId,
                active: true,
            },
            include: {
                CommunityClubPerson: true,
                CommunityClubSeat: true,
                CommunityClubTimeLimit: true,
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    deleteCommunity(id: number) {
        return this.prisma.communityClub.update({
            where: {
                id,
            },
            data: {
                active: false,
            },
            select: {
                id: true,
            },
        });
    }

    updateCommunity(id: number, body: UpdateCommunityBody, imageUrl?: string) {
        console.log(body);
        return this.prisma.communityClub.update({
            where: {
                id,
            },
            data: {
                ...body,
                image: imageUrl,
            },
            include: {
                CommunityClubPerson: true,
                CommunityClubSeat: true,
                CommunityClubTimeLimit: true,
            },
        });
    }

    approveReservation(id: number, { status, rejectReason }: PatchReservationBody) {
        return this.prisma.reservation.update({
            where: { id },
            data: {
                status: status,
                rejectReason: status === 'REJECTED' ? rejectReason : undefined,
                statusUpdateDate: new Date(),
            },
        });
    }

    findUniqueOrFail(id: number) {
        return this.readOnlyPrismaService.reservation.findUniqueOrThrow({
            where: {
                id,
            },
            select: {
                status: true,
            },
        });
    }

    getCommunityById(id: number) {
        return this.readOnlyPrismaService.communityClub.findUniqueOrThrow({
            where: {
                id,
            },
        });
    }

    reservationAfterNow(args: ReturnType<CommunityClubValidator['reservationAfterNowValidator']>) {
        return this.readOnlyPrismaService.communityClub.findMany(args);
    }
}
