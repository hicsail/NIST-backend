import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { File } from './file.model';
import mongoose from 'mongoose';
import { CreateFileInput } from './file.dto';

@Resolver()
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Query(() => File)
  async getFileById(@Args('id') id: string) {
    return this.fileService.findById(new mongoose.Types.ObjectId(id));
  }

  @Query(() => File)
  async getFileByBucketAndKey(@Args('bucket') bucket: string, @Args('key') key: string) {
    return this.fileService.findByBucketAndKey(bucket, key);
  }

  @Mutation(() => File)
  async addFile(@Args('input') input: CreateFileInput) {
    return this.fileService.create(input);
  }
}
