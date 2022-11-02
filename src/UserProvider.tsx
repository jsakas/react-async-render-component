import React, { createContext, useContext } from 'react';
import { faker } from '@faker-js/faker';

export type User = {
  userId: string;
  username: string;
  email: string;
  avatar: string;
  birthdate: Date;
  registeredAt: Date;
};

export function createRandomUser(): User {
  return {
    userId: faker.datatype.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
}

export type UserContextValue = {
  user?: User;
};

export const UserContext = createContext<UserContextValue>({});

export function useUserContext(): UserContextValue {
  const context = useContext(UserContext);

  return context;
}

type UserProviderProps = {
  children?: React.ReactNode;
};

const mockUser = createRandomUser();

export function UserProvider({ children }: UserProviderProps): JSX.Element {
  const value = {
    user: mockUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
