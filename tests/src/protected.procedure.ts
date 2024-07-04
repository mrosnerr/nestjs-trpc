import { TRPCProcedure } from 'nestjs-trpc';
import { TRPCError } from '@trpc/server';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from './user.service';

interface Context {
  auth : {
    user?: string;
  }
}

@Injectable()
export class ProtectedProcedure implements TRPCProcedure<Context> {

  constructor(@Inject(UserService) private readonly userService: UserService) {}

  use = ((opts) => {
    const { ctx, next } = opts;

    console.log(this.userService.test())
    if (ctx.auth?.user == null) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({
      ctx: {
        user: opts.ctx.auth.user,
      },
    });
  }) satisfies TRPCProcedure<Context>["use"]
}

export type ProtectedProcedureContext = {
  ctx: {
    user: string;
  };
};