import { Injectable } from '@nestjs/common';
import { CreateShareInvitationDto } from './dto/share/create-share-invitation.dto';

@Injectable()
export class CollaborationService {
    share(dto: CreateShareInvitationDto) {
        return dto;
    }
}
