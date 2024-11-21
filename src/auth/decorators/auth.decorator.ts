import { applyDecorators } from "@nestjs/common";
import { Role } from "../../common/enum/Roles.enum";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth.guard";
import { RolesGuard } from "../roles/roles.guard";
import { Roles } from "./roles.decorator";
export function Auth(roles: Role[]) {
    return applyDecorators(Roles(...roles),UseGuards(AuthGuard, RolesGuard));
  }