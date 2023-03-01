import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Query, Args, ResolveField, Parent, ID } from '@nestjs/graphql';
import { JwtAuthGuard } from './jwt.guard';
import { ResourceRequest } from './dtos/resource.dto';
import { UserPermissionsService } from './user-permissions.service';
import { UserContext } from './user.decorator';
import { UserPermissions } from './user-permissions.model';
import { Organization } from '../organization/organization.model';
import { OrganizationService } from '../organization/organization.service';
import { OrganizationPipe } from '../organization/organization.pipe';
import { UserPermissionsPipe } from './user-permissions.pipe';
import { PermissionChange } from './dtos/permission-change.dto';

@Resolver(() => UserPermissions)
export class AuthResolver {
  constructor(private readonly userPermissions: UserPermissionsService, private readonly orgService: OrganizationService) {}

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async authenticate(): Promise<boolean> {
    // Will only get here if the JWT token in the header is valid, otherwise
    // and UnauthorizedException will be thrown
    return true;
  }

  // TODO: When integrating with auth service, solidfy the user object
  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async authorize(@UserContext() user: any, @Args('resource') request: ResourceRequest): Promise<boolean> {
    return this.userPermissions.isAllowed(user.sub, request);
  }

  @Query(() => [UserPermissions])
  @UseGuards(JwtAuthGuard)
  async getUserPermissions(@UserContext() user: any): Promise<UserPermissions[]> {
    return this.userPermissions.getUserPermissions(user.sub);
  }

  @Mutation(() => UserPermissions)
  @UseGuards(JwtAuthGuard)
  async updatePermissions(@UserContext() user: any,
                          @Args('permission', { type: () => ID, description: 'ID of the UserPermission to be changed' }, UserPermissionsPipe) perms: UserPermissions,
                          @Args('change') change: PermissionChange): Promise<UserPermissions> {
    const requestIsAdmin = await this.userPermissions.canChangePermissions(user.sub, perms.org);
    if (!requestIsAdmin) {
      throw new UnauthorizedException('User not authorized to access organization permissions');
    }
    return this.userPermissions.updatePermissions(perms, change);
  }


  // TODO: Add guard to make sure the user is an admin for the given organization
  @Query(() => [UserPermissions])
  @UseGuards(JwtAuthGuard)
  async getUserPermissionsPerOrganization(@UserContext() user: any, @Args('organization', { type: () => ID }, OrganizationPipe) org: Organization): Promise<UserPermissions[]> {
    const requestIsAdmin = await this.userPermissions.canChangePermissions(user.sub, org);
    if (!requestIsAdmin) {
      throw new UnauthorizedException('User not authorized to access organization permissions');
    }
    return this.userPermissions.getUserPermissionsForOrganization(org);
  }

  @ResolveField(() => Organization)
  async org(@Parent() perms: UserPermissions): Promise<Organization> {
    const org = await this.orgService.find(perms.org);
    if (!org) {
      throw new BadRequestException(`Organization ${perms.org} does not exist`);
    }
    return org;
  }
}

