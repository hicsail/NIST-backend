import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';


@Module({
  imports: [
    AuthModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver
    })
  ]
})
export class AppModule {}
