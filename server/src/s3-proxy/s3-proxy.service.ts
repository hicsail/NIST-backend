import { HttpService } from '@nestjs/axios';
import { Injectable, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class S3ProxyService {
  private readonly PATH_PREFIX = '/s3/';
  private accessKey: string;
  private accessKeySecret: string;
  private region: string;
  private signer: SignatureV4;

  constructor(configService: ConfigService, private readonly http: HttpService) {
    this.accessKey = configService.getOrThrow('s3.access_key_id');
    this.accessKeySecret = configService.getOrThrow('s3.access_key_secret');
    this.region = configService.getOrThrow('s3.region');

    this.signer = new SignatureV4({
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.accessKeySecret,
      },
      region: this.region,
      service: 's3',
      sha256: Sha256
    });
  }

  async makeAWSRequest(req: Request): Promise<AxiosResponse> {
    const path = req.url.replace(this.PATH_PREFIX, '');


    // Convert headers to the format that the AWS SDK expects
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      headers[key] = value as string;
    }

    const httpRequest = new HttpRequest({
      method: req.method,
      protocol: 'https',
      hostname: `s3.${this.region}.amazonaws.com`,
      headers: {
        ...headers,
        host: `s3.${this.region}.amazonaws.com`,
      },
      path
    });

    const signedRequest = await this.signer.sign(httpRequest);
    const axiosHeaders = new AxiosHeaders(signedRequest.headers);

    console.log(headers);
    try {
      const result = await firstValueFrom(this.http.get(`https://s3.${this.region}.amazonaws.com${path}`, { headers: axiosHeaders }));
      // console.log(result);
      return result;
    } catch (e) {
      // console.error(e);
    }
    throw new Error('Not implemented');
  }
}
