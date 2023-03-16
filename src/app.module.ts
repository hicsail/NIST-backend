import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { OrganizationModule } from './organization/organization.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { PermsModule } from './perms/perms.module';

@Module({
  imports: [
    AuthModule,
    PermsModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
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
    OrganizationModule
  ]
})
export class AppModule {}
