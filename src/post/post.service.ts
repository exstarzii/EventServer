import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/post.dto';
import { Post, PostDocument } from 'src/schemas/post.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async create(userId, createPostDto: CreatePostDto) {
    console.log(createPostDto,userId);
    const user = await this.userModel.findById(userId);
    createPostDto.date = Date.now().toString()
    createPostDto.author = userId
    const post = await this.postModel.create(createPostDto);
    return post;
  }

  async like(userId: string, id: string) {
    try {
      const user = await this.userModel.findById(userId);
      const post = await this.postModel.findById(id);
      const myObjectId = new mongoose.Types.ObjectId(userId);
      post.likes ? post.likes.push(myObjectId) : post.likes = [myObjectId]
      post.save()
      return post;
    }
    catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async dislike(userId: string, id: string) {
    try {
      const user = await this.userModel.findById(userId);
      const post = await this.postModel.findById(id);
      const myObjectId = new mongoose.Types.ObjectId(userId);
      const indexToDelete = post.likes.indexOf(myObjectId);
      if (indexToDelete !== -1) {
        post.likes.splice(indexToDelete, 1);
      }
      post.save()
      return post;
    }
    catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async findAll(userId) {
    const post = await this.postModel.find({ author: userId })
    return post;
  }

  async findOne(id: number) {
    const post = await this.postModel.findById(id);
    //console.log(user);
    if (!post) return;
    return post;
  }

  async update(userId, id: number, updatePostDto: UpdatePostDto) {
    try {
      console.log(updatePostDto);
      const user = await this.userModel.findById(userId);
      const post = await this.postModel.findById(id);
      await post.updateOne(updatePostDto);
      return post;
    }
    catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async remove(userId, id: string) {
    try {
      const user = await this.userModel.findById(userId);
      const post = await this.postModel.findById(id);
      const res = post.delete();
      return res;
    }
    catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }
}
