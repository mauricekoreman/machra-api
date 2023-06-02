import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

// what is being returned, will become the value of what is being 'decorated' with GetUser()

// there is a user prop in req body, but we ONLY want to return user. The rest is not used and we don't want to filter every function.
export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
