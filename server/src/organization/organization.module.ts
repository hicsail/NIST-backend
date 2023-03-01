import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './organization.model';
import {OrganizationPipe} from './organization.pipe';
import { OrganizationService } from './organization.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
  ],
  providers: [OrganizationService, OrganizationPipe],
  exports: [OrganizationService]
})
export class OrganizationModule {}
