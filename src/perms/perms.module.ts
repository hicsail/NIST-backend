import { Module } from '@nestjs/common';
import { PermsService } from './perms.service';

@Module({
  providers: [PermsService]
})
export class PermsModule {}
