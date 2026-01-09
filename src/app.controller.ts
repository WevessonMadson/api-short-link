import { Controller, Get, UseGuards, Req } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async root(@Req() req) {    
    return "API online";
  }
}
