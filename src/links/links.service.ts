import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { randomBytes } from 'crypto';
import { UpdateLinkDto } from './dto/update-link.dto';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  private generateShortCode(length = 6) {
    return randomBytes(length).toString('base64url').substring(0, length);
  }

  async create(dto: CreateLinkDto, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('Usuário não encotrado');

    const shortCode = dto.shortCode || this.generateShortCode();

    const link = await this.prisma.link.findUnique({ where: { shortCode } });
    if (link) throw new ConflictException('esse código personalizado já é usado');

    return this.prisma.link.create({
      data: {
        originalUrl: dto.originalUrl,
        shortCode,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCode(shortCode: string) {
    const link = await this.prisma.link.findUnique({
      where: { shortCode },
    });
    if (!link) throw new NotFoundException('Link not found');
    return link;
  }

  async incrementClicks(shortCode: string) {
    const link = await this.prisma.link.update({
      where: { shortCode },
      data: { clicks: { increment: 1 } },
    });
    return link;
  }

  async update(id: number, updateLinkDto: UpdateLinkDto) {
    return this.prisma.link.update({
      where: { id },
      data: updateLinkDto,
    });
  }

  async remove(id: number) {
    return this.prisma.link.delete({ where: { id } });
  }
}
