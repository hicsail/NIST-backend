import { Module } from '@nestjs/common';
import { JupyterhubResolver } from './jupyterhub.resolver';
import { JupyterhubService } from './jupyterhub.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [JupyterhubResolver, JupyterhubService]
})
export class JupyterhubModule {}
