import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Organization, OrganizationDocument } from './organization.model';

@Injectable()
export class OrganizationService {
  constructor(@InjectModel(Organization.name) private orgModel: Model<OrganizationDocument>) {}

  findAll(): Promise<Organization[]> {
    return this.orgModel.find().exec();
  }

  find(id: mongoose.Types.ObjectId): Promise<Organization | null> {
    return this.orgModel.findById(id).exec();
  }

  findByBucket(bucket: string): Promise<Organization | null> {
    return this.orgModel.findOne({ bucket }).exec();
  }
}
