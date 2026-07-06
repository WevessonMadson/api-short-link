import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
}
