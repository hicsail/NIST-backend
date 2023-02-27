import { Injectable, RequestMethod } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResourceRequest, } from './dtos/resource.dto';
import { UserPermissions, UserPermissionsDocument } from './user-permissions.model';

@Injectable()
export class UserPermissionsService {
  constructor(@InjectModel(UserPermissions.name) private permsModel: Model<UserPermissionsDocument>) {}

  async accountLevelPermissions(_user: string, request: ResourceRequest): Promise<boolean> {
    // Can list all buckets in the account
    if (request.method == RequestMethod.GET) {
      return true;
    }

    // Cannot modify account metadata
    if (request.method == RequestMethod.POST) {
      return false;
    }

    // Cannot delete an account
    if (request.method == RequestMethod.DELETE) {
      return false;
    }
  }

  async bucketLevelPermissions(_user: string, request: ResourceRequest): Promise<boolean> {
    // Can list all objects in the bucket
    if (request.method == RequestMethod.GET) {
      return true;
    }

    // Cannot create a bucket
    // TODO: Limit this to the root level account
    if (request.method == RequestMethod.PUT) {
      return false;
    }

    // Cannot modify bucket metadata
    if (request.method == RequestMethod.POST) {
      return false;
    }

    // Cannot delete a bucket
    // TODO: Limit this to the root level account
    if (request.method == RequestMethod.DELETE) {
      return false;
    }

    return true;
  }

  async isAllowed(_user: string, request: ResourceRequest): Promise<boolean> {
    // Account level access requests
    if (request.bucket == null) {
      return this.accountLevelPermissions(_user, request)
    }

    // Bucket level access requests
    if (request.object == null) {
      return this.bucketLevelPermissions(_user, request)
    }


    return true;
  }
}
