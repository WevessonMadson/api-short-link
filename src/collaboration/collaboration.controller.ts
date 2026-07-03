import { Body, Controller, Post } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { CreateShareInvitationDto } from './dto/share/create-share-invitation.dto';

@Controller('collaboration')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) { }

  @Post('share')
  share(
    @Body() dto: CreateShareInvitationDto
  ) {
    return this.collaborationService.share(dto);
  }
}
