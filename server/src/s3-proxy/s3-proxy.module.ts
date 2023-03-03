import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3ProxyController } from './s3-proxy.controller';

@Module({
  imports: [ConfigModule],
  controllers: [S3ProxyController]
})
export class S3ProxyModule {}
