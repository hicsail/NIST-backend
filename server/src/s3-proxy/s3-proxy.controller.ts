import { Controller, Get, Req, Request } from '@nestjs/common';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { S3ProxyService } from './s3-proxy.service';

@Controller('/s3')
export class S3ProxyController {
  private client: S3Client;
  private region: string;


  constructor(configService: ConfigService, private readonly s3Proxy: S3ProxyService) {
    this.region = configService.getOrThrow('s3.region');
    this.client = new S3Client({
      credentials: {
        accessKeyId: configService.getOrThrow('s3.access_key_id'),
        secretAccessKey: configService.getOrThrow('s3.access_key_secret'),
      },
      region: configService.getOrThrow('s3.region'),
    });

    this.client.config
  }

  // Handle all requests to /s3/*
  @Get()
  async get(@Req() req: Request) {
    const result = await this.s3Proxy.makeAWSRequest(req);
    console.log(result.data);
    return result;

    // Make the
    // const result = await this.client.send(new ListBucketsCommand({}));
    // console.log(result);
  }

  /** Make the AWS signature from the request */
  async makeAWSSignature(req: Request) {
    const url = `https://s3.${this.region}.amazonaws.com${req.url}`;
    const headers = req.headers;
    const method = req.method;
    const body = req.body;
  }

}
