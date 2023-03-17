import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloGatewayDriver,
      useFactory: async (configSerivce: ConfigService) => ({
        autoSchemaFile: {
          path: 'schema.gql',
          federation: 2
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [{ name: 'nist', url: configSerivce.getOrThrow('nist.uri') }]
          })
        }
      })
    })
  ]
})
export class AppModule {}
