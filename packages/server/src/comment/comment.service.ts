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

  async create(createCommentInput: CreateCommentInput): Promise<Comment> {
    const newComment = new this.commentModel(createCommentInput);
    await newComment.save();

    if (createCommentInput.parentId) {
      await this.commentModel.updateOne({ _id: createCommentInput.parentId }, { $push: { replies: newComment._id } });
    } else {
      await this.fileModel.updateOne({ fileId: createCommentInput.fileId }, { $push: { comments: newComment._id } });
    }

    return newComment;
  }

  async removeComment(id: string): Promise<Comment | null> {
    await this.commentModel.deleteMany({ parentId: id }).exec();
    return this.commentModel.findByIdAndDelete(new mongoose.Types.ObjectId(id)).exec();
  }
}
