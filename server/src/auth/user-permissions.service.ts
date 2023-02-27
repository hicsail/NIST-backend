import { Injectable, RequestMethod } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResourceRequest, } from './dtos/resource.dto';
import { UserPermissions, UserPermissionsDocument } from './user-permissions.model';

@Injectable()
export class UserPermissionsService {
  constructor(@InjectModel(UserPermissions.name) private permsModel: Model<UserPermissionsDocument>) {}

  async isAllowed(_user: string, request: ResourceRequest): Promise<boolean> {
    // Everyone can list buckets
    if (request.method == RequestMethod.GET && request.bucket == null) {
      return true;
    }
    return true;
  }
}
