import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { OrganizationModule } from './organization/organization.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JupyterhubModule } from './jupyterhub/jupyterhub.module';
import configuration from './config/configuration';
import { FileModule } from './file/file.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      autoSchemaFile: {
        federation: 2,
        path: 'schema.gql'
      },
      driver: ApolloFederationDriver
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongo.uri')
      }),
      inject: [ConfigService]
    }),
    OrganizationModule,
    FileModule,
    CommentModule,
    JupyterhubModule
  ]
})
export class AppModule {}
