import { SharePermission } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateSharePermissionDto {
    @IsEnum(SharePermission)
    readonly permission: SharePermission;
}