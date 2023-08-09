import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './file.model';
import { Model } from 'mongoose';
import { CreateFileInput } from './file.dto';
import { Comment, CommentDocument } from 'src/comment/comment.model';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) {}

  async create(createFileInput: CreateFileInput): Promise<File> {
    const createFile = new this.fileModel(createFileInput);
    return createFile.save();
  }

  findByFileId(id: string): Promise<File | null> {
    return this.fileModel.findOne({ fileId: id }).exec();
  }

  async removeFile(id: string): Promise<File | null> {
    await this.commentModel.deleteMany({ fileId: id }).exec();
    return this.fileModel.findOneAndDelete({ fileId: id }).exec();
  }
}
