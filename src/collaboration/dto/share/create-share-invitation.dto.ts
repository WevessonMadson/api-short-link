import { SharePermission } from "@prisma/client";
import { ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsInt, IsString } from "class-validator";

export class CreateShareInvitationDto {
    @IsArray()
    @ArrayUnique()
    @ArrayMinSize(1)
    @IsString({ each: true })
    readonly usernames: string[];

    @IsArray()
    @ArrayUnique()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    readonly linkIds: number[];

    @IsEnum(SharePermission)
    readonly permission: SharePermission;
}