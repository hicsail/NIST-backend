import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './file.model';
import { Model } from 'mongoose';
import { CreateFileInput } from './file.dto';

@Injectable()
export class FileService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async create(createFileInput: CreateFileInput): Promise<File> {
    const createFile = new this.fileModel(createFileInput);
    return createFile.save();
  }

  findByFileId(id: string): Promise<File | null> {
    return this.fileModel
      .findOne({ fileId: id })
      .populate({ path: 'comments', populate: { path: 'replies' } })
      .exec();
  }
}
