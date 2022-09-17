import { User } from "@prisma/client";


export type IAuthData = Omit<User, 'id'>

export interface ITokenInterface {
    user: {
       userId: number;
    };
  }