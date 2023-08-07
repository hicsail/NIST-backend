import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { File } from './file.model';
import { CreateFileInput } from './file.dto';

@Resolver()
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Query(() => File)
  async getFileByFileId(@Args('fileId') fileId: string) {
    return this.fileService.findByFileId(fileId);
  }

  @Mutation(() => File)
  async addFile(@Args('input') input: CreateFileInput) {
    return this.fileService.create(input);
  }

  @Mutation(() => File)
  async deleteFile(@Args('fileId') fileId: string) {
    return this.fileService.removeFile(fileId);
  }
}
