import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLClient } from 'graphql-request';
import { getSdk, Sdk } from './graphql/sdk';

/** Wrapper around the generated GraphQL SDK with switching of auth token */
@Injectable()
export class PermsService {
  private readonly sdk: Sdk;
  private readonly gqlClient: GraphQLClient;

  constructor(configService: ConfigService) {
    this.gqlClient = new GraphQLClient(configService.getOrThrow('cargo.uri'));
    this.sdk = getSdk(this.gqlClient);
  }
}
