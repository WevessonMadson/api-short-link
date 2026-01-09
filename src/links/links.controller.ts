import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  create(@Body() dto: CreateLinkDto) {
    return this.linksService.create(dto);
  }

  @Get()
  findAll() {
    return this.linksService.findAll();
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
  update(@Param('id') id: number, @Body('originalUrl') url: string) {
    return this.linksService.update(id, url);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.linksService.remove(id);
  }
}
