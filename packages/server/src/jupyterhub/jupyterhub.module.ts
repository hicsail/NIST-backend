import { Module } from '@nestjs/common';
import { JupyterhubResolver } from './jupyterhub.resolver';
import { JupyterhubService } from './jupyterhub.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JupyterhubResolver, JupyterhubService]
})
export class JupyterhubModule {}
