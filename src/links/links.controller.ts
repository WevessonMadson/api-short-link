import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateLinkDto } from './dto/update-link.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateLinkDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.linksService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.userId;
    return this.linksService.findAll(userId);
  }

  @Get('/r/:shortCode')
  findOne(@Param('shortCode') shortCode: string) {
    return this.linksService.findByCode(shortCode);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: any) {
    return this.linksService.remove(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/other-user')
  updateByOtherUser(@Param('id', ParseIntPipe) idSharedLink: number, @Req() req: any, @Body() updateLinkDto: UpdateLinkDto) {
    console.log(updateLinkDto)
    return this.linksService.updateByOtherUser(req.user.userId, idSharedLink, updateLinkDto);
  }
}
