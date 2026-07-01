import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateLinkDto } from './dto/update-link.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateLinkDto, @Req() req) {
    const userId = req.user.userId;
    return this.linksService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    const userId = req.user.userId;
    return this.linksService.findAll(userId);
  }

  @Get(':shortCode')
  findOne(@Param('shortCode') shortCode: string) {
    return this.linksService.findByCode(shortCode);
  }

  @Post(':shortCode/click')
  increment(@Param('shortCode') shortCode: string) {
    return this.linksService.incrementClicks(shortCode);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.linksService.remove(id);
  }
}
