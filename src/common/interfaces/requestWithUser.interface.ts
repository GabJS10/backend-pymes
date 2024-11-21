import { Role } from "../enum/Roles.enum";

export interface RequestWithUser extends Request {
    user: {
      email: string;
      roles: Role[];
    }
  }