import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comment.model';
import mongoose, { Model } from 'mongoose';
import { CreateCommentInput } from './comment.dto';
import { File, FileDocument } from 'src/file/file.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(File.name) private fileModel: Model<FileDocument>
  ) {}

  async create(createCommentInput: CreateCommentInput, user: string): Promise<Comment> {
    const newComment = new this.commentModel({ ...createCommentInput, user });
    await newComment.save();

    if (createCommentInput.parentId) {
      await this.commentModel.updateOne({ _id: createCommentInput.parentId }, { $push: { replies: newComment._id } });
    } else {
      await this.fileModel.updateOne({ fileId: createCommentInput.fileId }, { $push: { comments: newComment._id } });
    }

    return newComment;
  }

  async findByIds(ids: mongoose.Schema.Types.ObjectId[]): Promise<Comment[]> {
    return this.commentModel.find({ _id: { $in: ids } }).exec();
  }

  async findByFileId(fileId: string): Promise<Comment[]> {
    return this.commentModel.find({ fileId }).exec();
  }

  async removeComment(id: string): Promise<boolean> {
    await this.commentModel.deleteMany({ parentId: id }).exec();
    const deleted = await this.commentModel.findByIdAndDelete(id).exec();
    return !!deleted;
  }
}
