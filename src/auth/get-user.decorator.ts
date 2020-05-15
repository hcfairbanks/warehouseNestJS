import { createParamDecorator } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator((data, req): User => {
  const cookies = JSON.stringify(req.header('Cookie'));
  return req.user;
});
