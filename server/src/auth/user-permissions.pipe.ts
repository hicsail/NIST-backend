import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserPermissions } from './models/user-permissions.model';
import { UserPermissionsService } from './user-permissions.service';
import mongoose from 'mongoose';

@Injectable()
export class UserPermissionsPipe implements PipeTransform<string, Promise<UserPermissions>> {
  constructor(private readonly userPermissionsService: UserPermissionsService) {}

  async transform(value: string): Promise<UserPermissions> {
    try {
      const perms = await this.userPermissionsService.find(new mongoose.Types.ObjectId(value));
      if (perms) {
        return perms;
      }
    } catch (_e) {}

    throw new BadRequestException(`UserPermissions ${value} does not exist`);
  }
}
