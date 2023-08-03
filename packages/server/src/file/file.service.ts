import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './file.model';
import mongoose, { Model } from 'mongoose';
import { CreateFileInput } from './file.dto';

@Injectable()
export class FileService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async create(createFileInput: CreateFileInput): Promise<File> {
    const createFile = new this.fileModel(createFileInput);
    return createFile.save();
  }

  findById(id: mongoose.Types.ObjectId): Promise<File | null> {
    return this.fileModel
      .findById(id)
      .populate({ path: 'comments', populate: { path: 'replies' } })
      .exec();
  }

  findByBucketAndKey(bucket: string, key: string): Promise<File | null> {
    return this.fileModel
      .findOne({ bucket, key })
      .populate({ path: 'comments', populate: { path: 'replies' } })
      .exec();
  }
}
