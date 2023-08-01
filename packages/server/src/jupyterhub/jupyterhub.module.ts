import { Module } from '@nestjs/common';
import { JupyterhubResolver } from './jupyterhub.resolver';
import { JupyterhubService } from './jupyterhub.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JupyterHubUser, JupyterHubUserSchema } from './jupyterhub-user.model';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: JupyterHubUser.name, schema: JupyterHubUserSchema }])],
  providers: [JupyterhubResolver, JupyterhubService]
})
export class JupyterhubModule {}
