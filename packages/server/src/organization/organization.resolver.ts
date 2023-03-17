import { Resolver, Query, ResolveReference } from '@nestjs/graphql';
import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';
import mongoose from 'mongoose';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly orgService: OrganizationService) {}

  @Query(() => [Organization])
  async getOriganizations(): Promise<Organization[]> {
    return this.orgService.findAll();
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; _id: string }): Promise<Organization> {
    try {
      const result = this.orgService.find(new mongoose.Types.ObjectId(reference._id));
      if (result) {
        return result;
      }
    } catch (e: any) {}

    throw new BadRequestException(`Organization not found with id: ${reference._id}`);
  }
}
