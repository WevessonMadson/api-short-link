import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShareInvitationDto } from './dto/share/create-share-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollaborationService {
    constructor(private readonly prisma: PrismaService) { };

    private async validateEmails(emails: string[]) {
        const users = await this.prisma.user.findMany({
            where: {
                email: {
                    in: emails
                }
            },
            select: { id: true, email: true },
        });

        const foundEmails = users.map(user => user.email);
        const invalidEmails = emails.filter(username => !foundEmails.includes(username));

        if (invalidEmails.length > 0) throw new BadRequestException({
            message: "Alguns usuários não foram encontrados",
            invalidEmails,
        });

        return users;
    };
    
    private async validateSelfShare(email: string, emails: string[]) {
        if (emails.includes(email)) {
            throw new BadRequestException(
                "Você não pode compartilhar links com você mesmo."
            );
        }
    };

    async share(user: { userId: number, email: string } , dto: CreateShareInvitationDto) {
        await this.validateSelfShare(user.email, dto.emails);
        
        const users = await this.validateEmails(dto.emails);

        return {
            success: true,
        };
    };
}
