import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './file.model';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
  providers: [FileService, FileResolver]
})
export class FileModule {}
