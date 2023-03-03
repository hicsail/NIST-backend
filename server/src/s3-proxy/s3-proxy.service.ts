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
    // const path = req.url.replace(this.PATH_PREFIX, '/');
    const path = '/nist-dev/test.txt';
    console.log(path);


    // Convert headers to the format that the AWS SDK expects
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      headers[key] = value as string;
    }

    const httpRequest = new HttpRequest({
      method: req.method,
      protocol: 'https',
      hostname: `s3.${this.region}.amazonaws.com`,
      body: req.body,
      headers: {
        ...headers,
        host: `s3.${this.region}.amazonaws.com`,
      },
      path
    });

    const signedRequest = await this.signer.sign(httpRequest);
    console.log('here');
    const axiosHeaders = new AxiosHeaders(signedRequest.headers);
    console.log('there');
    console.log(path);
    try {
      /*
      const result = await firstValueFrom(this.http.request({
        method: req.method,
        url: `https://s3.${this.region}.amazonaws.com${path}`,
        data: req.body,
        headers: axiosHeaders,
      }));
      */

      switch(req.method) {
        case('GET'):
          return firstValueFrom(this.http.get(`https://s3.${this.region}.amazonaws.com${path}`, { headers: axiosHeaders }));
        case('PUT'):
          return firstValueFrom(this.http.put(`https://s3.${this.region}.amazonaws.com${path}`, req.body, { headers: axiosHeaders }));
        case('POST'):
          return firstValueFrom(this.http.post(`https://s3.${this.region}.amazonaws.com${path}`, req.body, { headers: axiosHeaders }));
        case('DELETE'):
          return firstValueFrom(this.http.delete(`https://s3.${this.region}.amazonaws.com${path}`, { headers: axiosHeaders }));
        default:
          throw new Error(`Unsupported method: ${req.method}`);
      }
    } catch (e) {
      // console.error(e);
    }
    throw new Error('Not implemented');
  }
}
