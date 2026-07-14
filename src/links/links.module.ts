import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { CollaborationService } from '../collaboration/collaboration.service';

@Module({
  controllers: [LinksController],
  providers: [LinksService, CollaborationService],
})
export class LinksModule {}
