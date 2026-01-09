import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { LinksModule } from './links/links.module';

@Module({
    imports: [PrismaModule, AuthModule, LinksModule],
    controllers: [AppController],
})
export class AppModule {}
