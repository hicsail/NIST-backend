import { Injectable, RequestMethod } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { OrganizationService } from '../organization/organization.service';
import { Organization } from '../organization/organization.model';
import { PermissionChange } from './dtos/permission-change.dto';
import { ResourceRequest } from './dtos/resource.dto';
import { UserPermissions, UserPermissionsDocument } from './models/user-permissions.model';
import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { ConfigService } from '@nestjs/config';
import {SignedRequest} from './models/signed-request.model';

@Injectable()
export class UserPermissionsService {
  private readonly signer: SignatureV4;

  constructor(
    @InjectModel(UserPermissions.name) private permsModel: Model<UserPermissionsDocument>,
    private readonly orgService: OrganizationService,
    configService: ConfigService
  ) {
    this.signer = new SignatureV4({
      credentials: {
        accessKeyId: configService.getOrThrow('s3.access_key_id'),
        secretAccessKey: configService.getOrThrow('s3.access_key_secret')
      },
      region: configService.getOrThrow('s3.region'),
      service: 's3',
      sha256: Sha256
    });
  }

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

  /** Check to see if a user can change permissions for a given organization */
  async canChangePermissions(user: string, org: Organization | mongoose.Types.ObjectId) {
    let id = '';
    if (org instanceof mongoose.Types.ObjectId) {
      id = org.toString();
    } else {
      id = org._id.toString();
    }

    const userPermissions = await this.permsModel.findOne({ user: user, org: id });
    if (!userPermissions) {
      return false;
    }

    return userPermissions.admin;
  }

  /**
   * Determine if the user can perform the given request. If the user can,
   * a AWS signature and SHA256 hash of the body are returned.
   */
  async getSignedRequest(user: string, request: ResourceRequest): Promise<SignedRequest> {
    const isAllowed = await this.isAllowed(user, request);
    if (!isAllowed) {
      return { authorized: false, signature: undefined, hash: undefined };
    }

    // Make and sign the HttpRequest
    const rawRequest = new HttpRequest({
      ...request.request
    });
    const signedHttpRequest = await this.signer.sign(rawRequest);

    // Return to the user the signature and SHA256 hash of the body
    // to apply to their request
    return {
      authorized: true,
      signature: signedHttpRequest.headers.authorization,
      hash: signedHttpRequest.headers['x-amz-content-sha256']
    };
  }

  /**
   * Check to see if the user as access to perform the given action on the
   * given resource.
   */
  private async isAllowed(user: string, request: ResourceRequest): Promise<boolean> {
    // Account level access requests
    if (request.bucket == null) {
      return this.accountLevelPermissions(user, request);
    }

    // Bucket level access requests
    if (request.object == null) {
      return this.bucketLevelPermissions(user, request);
    }

    // Object level access requests
    if (request.bucket != null && request.object != null) {
      return this.objectLevelPermissions(user, request);
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

  private async objectLevelPermissions(user: string, request: ResourceRequest): Promise<boolean> {
    const bucket = request.bucket;

    // Get the user permissions for this bucket
    const org = await this.orgService.findByBucket(bucket);
    if (!org) {
      throw new Error(`Could not find organization for bucket: ${bucket}`);
    }
    const userPermissions = await this.permsModel.findOne({ user: user, org: org._id });
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
