import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { OrganizationModule } from './organization/organization.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { S3ProxyModule } from './s3-proxy/s3-proxy.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration]
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongo.uri')
      }),
      inject: [ConfigService]
    }),
    OrganizationModule,
    S3ProxyModule
  ]
})
export class AppModule {}
