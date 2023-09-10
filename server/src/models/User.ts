import prisma from '../config/prisma';
import { User } from '@prisma/client';

import UserData from '../interfaces/UserData';
import UserModelError from '../errors/models/UserModel';

export const createUser = async (userData: UserData): Promise<User> => {
  try {
    const newUser = await prisma.user.create({
      data: userData,
    });

    return newUser;
  } catch (error) {
    throw new UserModelError('Cannot create user');
  }
};