import prisma from '../config/prisma';
import { User } from '@prisma/client';

import UserData from '../interfaces/UserData';

export default class UserService {
  public async createUser(data: UserData): Promise<User> {
    try {
      const newUser = await prisma.user.create({
        data
      });

      return newUser;
    } catch (e) {
      throw new Error();
    }
  }
}