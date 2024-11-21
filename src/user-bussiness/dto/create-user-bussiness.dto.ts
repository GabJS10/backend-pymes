import { User_bussiness } from "@prisma/client";

export type CreateUserBussinessDto = Omit<User_bussiness,'id' | 'created_at' | 'updated_at' > 