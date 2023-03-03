import { Controller, Get, Req, Request } from '@nestjs/common';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Controller('/s3')
export class S3ProxyController {
  private client: S3Client;

  constructor(configService: ConfigService) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: configService.getOrThrow('s3.access_key_id'),
        secretAccessKey: configService.getOrThrow('s3.access_key_secret'),
      },
      region: configService.getOrThrow('s3.region'),
    });
  }

  // Handle all requests to /s3/*
  @Get()
  async get(@Req() req: Request) {
    console.log(req);

    return await this.client.send(new ListBucketsCommand({}));
  }
}
