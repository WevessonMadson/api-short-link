import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShareInvitationDto } from './dto/share/create-share-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ShareInvitation, ShareInvitationLink, ShareInvitationStatus, SharePermission } from '@prisma/client';
import { permission } from 'process';

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
    }

    private async validateSelfShare(email: string, emails: string[]) {
        if (emails.includes(email)) {
            throw new BadRequestException(
                "Você não pode compartilhar links com você mesmo."
            );
        }
    }

    private async validateLinks(userId: number, linkIds: number[]) {
        const foundIds = await this.prisma.link.findMany({
            where: {
                id: { in: linkIds },
                userId,
            },
            select: { id: true },
        });

        if (foundIds.length < linkIds.length) throw new BadRequestException("Um ou mais links são inválidos ou não pertencem a você.");

        return foundIds;
    }

    private async createInvitationWithLinks(ownerId: number, receiverId: number, linkIds: number[], permission: SharePermission) {
        await this.prisma.$transaction(async (tx) => {
            const invitation = await tx.shareInvitation.create({
                data: {
                    ownerId,
                    receiverId,
                    permission,
                },
            });

            await tx.shareInvitationLink.createMany({
                data: linkIds.map(linkId => ({
                    invitationId: invitation.id,
                    linkId,
                })),
            });
        });
    }

    private async validatePendingInvitations(ownerId: number, receiverIds: number[]) {
        const pendingInvitation = await this.prisma.shareInvitation.findFirst({
            where: {
                receiverId: { in: receiverIds },
                ownerId,
                status: ShareInvitationStatus.PENDING
            },
            select: { id: true },
        });

        if (pendingInvitation) throw new BadRequestException("Destinatário ainda tem convite pendente.");
    }

    private async validateSharedLinks(receiverIds: number[], linkIds: number[]) {
        const sharedLink = await this.prisma.sharedLink.findFirst({
            where: {
                receiverId: {
                    in: receiverIds,
                },
                linkId: {
                    in: linkIds,
                },
            },
            select: {
                id: true,
            },
        });

        if (sharedLink) throw new BadRequestException("Um ou mais links já estão compartilhados com um dos destinatários.");
    }

    private async findPendingInvitationForReceiver(receiverId: number, invitationId: number) {
        const invitation = await this.prisma.shareInvitation.findFirst({
            where: {
                receiverId,
                status: ShareInvitationStatus.PENDING,
                id: invitationId,
            },
            include: {
                items: true,
            },
        });

        if (!invitation) throw new NotFoundException("Convite não encontrado.");

        return invitation;
    }

    private async findPendingInvitationForOwner(ownerId: number, invitationId: number) {
        const invitation = await this.prisma.shareInvitation.findFirst({
            where: {
                ownerId,
                status: ShareInvitationStatus.PENDING,
                id: invitationId,
            },
            include: {
                items: true,
            },
        });

        if (!invitation) throw new NotFoundException("Convite não encontrado.");

        return invitation;
    }

    private async acceptInvitationTransaction(invitation: ShareInvitation & { items: ShareInvitationLink[] }) {
        await this.prisma.$transaction(async (tx) => {
            await tx.sharedLink.createMany({
                data: invitation.items.map((item) => ({
                    invitationId: invitation.id,
                    linkId: item.linkId,
                    receiverId: invitation.receiverId,
                    permission: invitation.permission,
                })),
            });

            await tx.shareInvitation.update({
                where: {
                    id: invitation.id,
                },
                data: {
                    status: ShareInvitationStatus.ACCEPTED,
                    acceptedAt: new Date(),
                },
            });
        });
    }

    async share(user: { userId: number, email: string }, dto: CreateShareInvitationDto) {
        await this.validateSelfShare(user.email, dto.emails);

        const users = await this.validateEmails(dto.emails);

        const foundLinks = await this.validateLinks(user.userId, dto.linkIds);

        await this.validatePendingInvitations(user.userId, users.map(user => user.id));

        await this.validateSharedLinks(users.map(user => user.id), dto.linkIds);

        for (const userFound of users) {
            await this.createInvitationWithLinks(user.userId, userFound.id, dto.linkIds, dto.permission);
        }

        return {
            success: true,
            users,
            foundLinks
        };
    };

    async findReceivedInvitations(userId: number) {
        const invitations = await this.prisma.shareInvitation.findMany({
            where: {
                receiverId: userId,
                status: ShareInvitationStatus.PENDING,
            },
            select: {
                id: true,
                status: true,
                createdAt: true,

                receiver: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },

                _count: {
                    select: {
                        items: true
                    }
                }
            }
        });

        return invitations.map(({ _count, receiver, ...invitation }) => ({
            ...invitation,
            user: receiver,
            linksCount: _count.items,
        }));
    }

    async acceptInvitation(userId: number, invitationId: number) {
        const invitation = await this.findPendingInvitationForReceiver(userId, invitationId);

        await this.acceptInvitationTransaction(invitation);

        return { success: true };
    }

    async rejectInvitation(userId: number, invitationId: number) {
        const invitation = await this.findPendingInvitationForReceiver(userId, invitationId);

        await this.prisma.shareInvitation.update({
            where: {
                id: invitationId
            },

            data: {
                status: ShareInvitationStatus.REJECTED,
                rejectedAt: new Date(),
            }
        });

        return { sucess: true }

    }

    async findSentInvitations(userId: number) {
        const invitations = await this.prisma.shareInvitation.findMany({
            where: {
                ownerId: userId,
                status: ShareInvitationStatus.PENDING,
            },
            select: {
                id: true,
                status: true,
                createdAt: true,

                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },

                _count: {
                    select: {
                        items: true
                    }
                }
            }
        });

        return invitations.map(({ _count, owner, ...invitation }) => ({
            ...invitation,
            user: owner,
            linksCount: _count.items,
        }));
    }

    async cancelInvitation(userId: number, invitationId: number) {
        const invitation = await this.findPendingInvitationForOwner(userId, invitationId);

        await this.prisma.shareInvitation.update({
            where: {
                id: invitation.id
            },

            data: {
                status: ShareInvitationStatus.CANCELLED,
                cancelledAt: new Date(),
            }
        });

        return { success: true }
    }

    async findSharedForMe(userId: number) {
        return await this.prisma.sharedLink.findMany({
            where: {
                receiverId: userId,
            },

            select: {
                id: true,
                permission: true,
                createdAt: true,

                link: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            }
        });
    }
    
    async findSharedByMe(userId: number) {
        return await this.prisma.sharedLink.findMany({
            where: {
                link: {
                    userId
                }
            },

            select: {
                id: true,
                permission: true,
                createdAt: true,

                receiver: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                link: {
                    select: {
                        id: true,
                        originalUrl: true,
                        shortCode: true,
                        clicks: true,
                        createdAt: true,
                    },
                },
            }
        });
    }
}
