import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPermissions, UserPermissionsDocument } from './user-permissions.model';

@Injectable()
export class UserPermissionsService {
  constructor(@InjectModel(UserPermissions.name) private permsModel: Model<UserPermissionsDocument>) {}
}
