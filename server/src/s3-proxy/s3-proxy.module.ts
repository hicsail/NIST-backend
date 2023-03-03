import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3ProxyController } from './s3-proxy.controller';
import { S3ProxyService } from './s3-proxy.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [S3ProxyController],
  providers: [S3ProxyService]
})
export class S3ProxyModule {}
