import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { CreateShareInvitationDto } from './dto/share/create-share-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SharePermission } from '@prisma/client';
import { UpdateSharePermissionDto } from './dto/share/update-share-permission.dto';

@UseGuards(JwtAuthGuard)
@Controller('collaboration')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) { }

  @Post('share')
  share(
    @Body() dto: CreateShareInvitationDto,
    @Req() req: any
  ) {
    return this.collaborationService.share(req.user, dto);
  }

  @Get('invitations/received')
  findReceivedInvitations(@Req() req: any) {
    return this.collaborationService.findReceivedInvitations(req.user.userId);
  }

  @Post('invitations/:id/accept')
  acceptInvitation(@Param('id', ParseIntPipe) invitationId: number, @Req() req: any) {
    return this.collaborationService.acceptInvitation(req.user.userId, invitationId);
  }

  @Post('invitations/:id/reject')
  rejectInvitation(@Param('id', ParseIntPipe) invitationId: number, @Req() req: any) {
    return this.collaborationService.rejectInvitation(req.user.userId, invitationId);
  }

  @Get('invitations/sent')
  findSentInvitations(@Req() req: any) {
    return this.collaborationService.findSentInvitations(req.user.userId);
  }

  @Post('invitations/:id/cancel')
  cancelInvitation(@Param('id', ParseIntPipe) invitationId: number, @Req() req: any) {
    return this.collaborationService.cancelInvitation(req.user.userId, invitationId);
  }

  @Get('shared-links-for-me')
  findSharedForMe(@Req() req: any) {
    return this.collaborationService.findSharedForMe(req.user.userId);
  }

  @Get('shared-links-by-me')
  findSharedByMe(@Req() req: any) {
    return this.collaborationService.findSharedByMe(req.user.userId);
  }

  @Put('shared-links/:id/permission')
  updatePermissionSharedLink(
    @Param('id', ParseIntPipe) sharedLinkId: number, 
    @Body() dto: UpdateSharePermissionDto, 
    @Req() req: any) {
      return this.collaborationService.updatePermissionSharedLink(sharedLinkId, dto.permission, req.user.userId);
  }

  @Delete('shared-links/:id')
  removeSharedAccess(
    @Param('id', ParseIntPipe) sharedLinkId: number,
    @Req() req: any
  ) {
    return this.collaborationService.removeSharedAccess(sharedLinkId, req.user.userId);
  }
}
