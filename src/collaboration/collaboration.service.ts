import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShareInvitationDto } from './dto/share/create-share-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollaborationService {
    constructor(private readonly prisma: PrismaService) { };

    private async validateUsers(usernames: string[]) {
        const users = await this.prisma.user.findMany({
            where: {
                email: {
                    in: usernames
                }
            },
            select: { id: true, email: true },
        });

        const foundUsernames = users.map(user => user.email);
        const invalidUsernames = usernames.filter(username => !foundUsernames.includes(username));

        if (invalidUsernames.length > 0) throw new BadRequestException({
            message: "Alguns usuários não foram encontrados",
            invalidUsernames,
        });

        return users;
    };

    async share(userId: number, dto: CreateShareInvitationDto) {
        const users = await this.validateUsers(dto.usernames);

        return {
            success: true,
        };
    }
}
