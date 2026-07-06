import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShareInvitationDto } from './dto/share/create-share-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollaborationService {
    constructor(private readonly prisma: PrismaService) { };

    private async validateEmails(usernames: string[]) {
        const users = await this.prisma.user.findMany({
            where: {
                email: {
                    in: usernames
                }
            },
            select: { id: true, email: true },
        });

        const foundEmails = users.map(user => user.email);
        const invalidEmails = usernames.filter(username => !foundEmails.includes(username));

        if (invalidEmails.length > 0) throw new BadRequestException({
            message: "Alguns usuários não foram encontrados",
            invalidEmails,
        });

        return users;
    };

    async share(userId: number, dto: CreateShareInvitationDto) {
        const users = await this.validateEmails(dto.emails);

        return {
            success: true,
        };
    }
}
