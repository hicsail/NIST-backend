import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLClient } from 'graphql-request';
import {getSdk} from './graphql/sdk';

@Injectable()
export class PermsService {
  constructor(configService: ConfigService) {
    const graphqlClient = new GraphQLClient(configService.getOrThrow('cargo.uri'));
    const sdk = getSdk(graphqlClient);
  }
}
