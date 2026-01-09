import { IsNotEmpty, IsOptional, IsUrl, IsString } from 'class-validator';

export class CreateLinkDto {
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string;

  @IsOptional()
  @IsString()
  shortCode?: string;
}
