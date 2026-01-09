import { IsNotEmpty, IsOptional, IsUrl, IsInt } from 'class-validator';

export class CreateLinkDto {
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string;

  @IsOptional()
  @IsInt()
  userId?: number;
}
