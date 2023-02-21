import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { JwtAuthGuard } from './jwt.guard';

@Resolver()
export class AuthResolver {
  constructor() {}

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async authenticate(): Promise<boolean> {
    // Will only get here if the JWT token in the header is valid, otherwise
    // and UnauthorizedException will be thrown
    return true;
  }

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async authorize(@Args('resource') _resource: string): Promise<boolean> {
    // TODO: Check resource against what the user has access to
    return true;
  }
}
