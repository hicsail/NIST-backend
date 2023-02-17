import { Resolver, Query, Args } from '@nestjs/graphql';
import { Token } from './dto/token.dto';

@Resolver()
export class AuthResolver {
  @Query(() => Boolean)
  async authenticate(@Args('token') args: Token): Promise<boolean> {
    return args.token == 'key';
  }
}
