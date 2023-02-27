import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { JwtAuthGuard } from './jwt.guard';
import { ResourceRequest } from './dtos/resource.dto';
import { UserPermissionsService } from './user-permissions.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly userPermissions: UserPermissionsService) {}

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async authenticate(): Promise<boolean> {
    // Will only get here if the JWT token in the header is valid, otherwise
    // and UnauthorizedException will be thrown
    return true;
  }

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async authorize(@Args('resource') request: ResourceRequest): Promise<boolean> {
    return this.userPermissions.isAllowed('default', request);
  }
}
