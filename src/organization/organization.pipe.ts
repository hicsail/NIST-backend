import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';
import mongoose from 'mongoose';

@Injectable()
export class OrganizationPipe implements PipeTransform<string, Promise<Organization>> {
  constructor(private readonly orgService: OrganizationService) {}

  async transform(value: string): Promise<Organization> {
    try {
      const org = await this.orgService.find(new mongoose.Types.ObjectId(value));
      if (org) {
        return org;
      }
    } catch (_e) {}

    throw new BadRequestException(`Organization ${value} does not exist`);
  }
}
