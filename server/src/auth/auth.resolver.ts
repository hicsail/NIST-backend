import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
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
}
