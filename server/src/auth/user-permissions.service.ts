import { Injectable, RequestMethod } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Organization } from '../organization/organization.model';
import { PermissionChange } from './dtos/permission-change.dto';
import { ResourceRequest, } from './dtos/resource.dto';
import { UserPermissions, UserPermissionsDocument } from './user-permissions.model';

@Injectable()
export class UserPermissionsService {
  constructor(@InjectModel(UserPermissions.name) private permsModel: Model<UserPermissionsDocument>) {}

  /** Get all user permissions for the given user */
  async getUserPermissions(user: string): Promise<UserPermissions[]> {
    return this.permsModel.find({ user: user });
  }

  /** Get all user permissions for the given organization */
  async getUserPermissionsForOrganization(organization: Organization): Promise<UserPermissions[]> {
    return this.permsModel.find({ org: organization._id });
  }

  async find(id: mongoose.Types.ObjectId): Promise<UserPermissions | null> {
    return this.permsModel.findById(id).exec();
  }

  async updatePermissions(perms: UserPermissions, change: PermissionChange): Promise<UserPermissions> {
    const newPermissions = {
      _id: perms._id,
      user: perms.user,
      org: perms.org,
      read: change.read != null ? change.read : perms.read,
      write: change.write != null ? change.write : perms.write,
      delete: change.delete != null ? change.delete : perms.delete,
      admin: change.admin != null ? change.admin : perms.admin
    };

    return this.permsModel.findByIdAndUpdate(perms._id, newPermissions, { new: true }).exec();
  }

  /**
   * Checks to see if the user has access to the given resource based on
   * the request method.
   *
   * NOTE: The request methods and the cooresponding actions were retrieved
   * from the Swift API docs:
   * https://docs.openstack.org/api-ref/object-store/
   */
  async isAllowed(_user: string, request: ResourceRequest): Promise<boolean> {
    // Account level access requests
    if (request.bucket == null) {
      return this.accountLevelPermissions(_user, request)
    }

    // Bucket level access requests
    if (request.object == null) {
      return this.bucketLevelPermissions(_user, request)
    }

    // Object level access requests
    if (request.bucket != null && request.object != null) {
      return this.objectLevelPermissions(_user, request);
    }

    // Unknown request, block access and report error
    // TODO: Log this error
    return false;
  }

  private async accountLevelPermissions(_user: string, request: ResourceRequest): Promise<boolean> {
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

    // Unknown account request, block access
    return false;
  }

  private async bucketLevelPermissions(_user: string, request: ResourceRequest): Promise<boolean> {
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

    // Unknown bucket request, block access
    return false;
  }

  private async objectLevelPermissions(_user: string, request: ResourceRequest): Promise<boolean> {
    const bucket = request.bucket;

    // Get the user permissions for this bucket
    const userPermissions = await this.permsModel.findOne({ user: _user, bucket: bucket });
    if (!userPermissions) {
      return false;
    }

    if (request.method == RequestMethod.GET || request.method == RequestMethod.HEAD) {
      return userPermissions.read;
    }

    if (request.method == RequestMethod.PUT || request.method == RequestMethod.POST) {
      return userPermissions.write;
    }

    if (request.method == RequestMethod.DELETE) {
      return userPermissions.delete;
    }

    // Unknown object request, block access
    return false;
  }
}
