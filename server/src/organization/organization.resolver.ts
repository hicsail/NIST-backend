import { Resolver, Query } from '@nestjs/graphql';
import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';

@Resolver()
export class OrganizationResolver {
  constructor(private readonly orgService: OrganizationService) {}

  @Query(() => [Organization])
  async getOriganizations(): Promise<Organization[]> {
    return this.orgService.findAll();
  }
}
