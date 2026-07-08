import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { CreateShareInvitationDto } from './dto/share/create-share-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('collaboration')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) { }

  @UseGuards(JwtAuthGuard)
  @Post('share')
  share(
    @Body() dto: CreateShareInvitationDto,
    @Req() req: any
  ) {
    return this.collaborationService.share(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('invitations')
  findReceivedInvitations(@Req() req: any) {
    return this.collaborationService.findReceivedInvitations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invitations/:id/accept')
  acceptInvitation(@Param('id', ParseIntPipe) invitationId: number, @Req() req: any) {
    return this.collaborationService.acceptInvitation(req.user.userId, invitationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invitations/:id/reject')
  rejectInvitation(@Param('id', ParseIntPipe) invitationId: number, @Req() req: any) {
    return this.collaborationService.rejectInvitation(req.user.userId, invitationId);
  }
}
