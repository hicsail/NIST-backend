import {HttpService} from '@nestjs/axios';
import { Injectable, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {AxiosHeaders, AxiosResponse} from 'axios';
const crypto = require('crypto');
import { firstValueFrom } from 'rxjs';

@Injectable()
export class S3ProxyService {
  private readonly PATH_PREFIX = '/s3/';
  private accessKey: string;
  private accessKeySecret: string;
  private region: string;

  constructor(configService: ConfigService, private readonly http: HttpService) {
    this.accessKey = configService.getOrThrow('s3.access_key_id');
    this.accessKeySecret = configService.getOrThrow('s3.access_key_secret');
    this.region = configService.getOrThrow('s3.region');
  }

  async makeAWSRequest(req: Request): Promise<AxiosResponse> {
    const authHeader = this.getAuthenticationHeader(req);

    const resource = this.getResource(req);
    const url = `https://s3.${this.region}.amazonaws.com/${resource}`;
    const method = req.method;
    const body = req.body;

    // Setup headers
    const headers: AxiosHeaders = new AxiosHeaders();
    /*
    for (const [key, value] of Object.entries(req.headers)) {
      headers.set(key, value);
    } */
    headers['authorization'] = authHeader;

    try {
      const result = await firstValueFrom(this.http.get(url, {headers}));
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }

    return firstValueFrom(this.http.request({
      method: method,
      url: url,
    }));
  }

  private getAuthenticationHeader(req: Request): string {
    const httpVerb = req.method;
    const contentMd5 = req.headers['content-md5'];
    const contentType = req.headers['content-type'];
    const date = req.headers['x-amz-date'];
    const canonicalizedAmzHeaders = this.getCanonicalizedAmzHeaders(req);
    const canonicalizedResource = this.getCanonicalizedResource(req);
    const stringToSign = `${httpVerb}\n${contentMd5}\n${contentType}\n${date}\n${canonicalizedAmzHeaders}${canonicalizedResource}`;

    // Perform HMAC-SHA1
    let hmac = crypto.createHmac('sha1', this.accessKeySecret);
    hmac.update(stringToSign);
    const signature = hmac.digest('base64');

    return `AWS ${this.accessKey}:${signature}`;
  }

  private getCanonicalizedResource(req: Request): string {
    let resourceString = '';
    const resource = this.getResource(req);

    // Check if this is a bucket request
    const bucket = resource.split('/')[0];
    if (bucket) {
      resourceString += `/${resource}`;
    } else {
      resourceString += '/';
    }

    console.log('Resource string', resourceString);


    return resourceString;
  }

  private getCanonicalizedAmzHeaders(req: Request): string {
    return '';
  }

  private getResource(req: Request): string {
    return req.url.replace(this.PATH_PREFIX, '');
  }
}
