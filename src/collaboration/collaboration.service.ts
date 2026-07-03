import { Injectable } from '@nestjs/common';
import { CreateShareInvitationDto } from './dto/share/create-share-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollaborationService {
    constructor(private readonly prisma: PrismaService) { };

    share(userId: number, dto: CreateShareInvitationDto) {
        return {
            userId,
            dto
        };
    }
}
