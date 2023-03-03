import { Controller, All, Req, Request, Get, Put, Post } from '@nestjs/common';
import { S3ProxyService } from './s3-proxy.service';

@Controller('/s3')
export class S3ProxyController {
  constructor(private readonly s3Proxy: S3ProxyService) {}

  // Handle all requests to /s3/*
  @All('*')
  async get(@Req() req: Request) {
    try {
      const result = await this.s3Proxy.makeAWSRequest(req);
      console.log(result);
      console.log(req.method);
      return result.data;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
