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
    console.log(createPostDto, userId);
    const user = await this.userModel.findById(userId);
    createPostDto.date = Date.now()
    createPostDto.author = userId;
    const post = await this.postModel.create(createPostDto)
    const postA = await this.postModel.findById(post._id).populate('author');
    // console.log(postA,post);
    return postA;
  }

  async like(postOwnerId:string,likedUserId: string, postId: string) {
    try {
      const userOwner = await this.userModel.findById(postOwnerId);
      const user = await this.userModel.findById(likedUserId);
      const post = await this.postModel.findById(postId);
      const myObjectId = new mongoose.Types.ObjectId(likedUserId);
      const indexToDelete = post.likes.indexOf(myObjectId);
      if (indexToDelete !== -1) {
        return post.populate('author');
      }
      post.likes ? post.likes.push(myObjectId) : post.likes = [myObjectId]
      await post.save()
      return post.populate('author');
    }
    catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async dislike(postOwnerId:string,likedUserId: string, postId: string) {
    try {
      const userOwner = await this.userModel.findById(postOwnerId);
      const user = await this.userModel.findById(likedUserId);
      const post = await this.postModel.findById(postId);
      const myObjectId = new mongoose.Types.ObjectId(likedUserId);
      const indexToDelete = post.likes.indexOf(myObjectId);
      if (indexToDelete !== -1) {
        post.likes.splice(indexToDelete, 1);
      }
      await post.save()
      return post.populate('author');
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
    .sort({date:"desc"})
    .populate('author')
    return post;
  }

  async findOne(id: number) {
    const post = await this.postModel.findById(id).populate('author');
    //console.log(user);
    if (!post) return;
    return post;
  }

  async update(userId, id: number, updatePostDto: UpdatePostDto) {
    try {
      console.log(updatePostDto);
      const user = await this.userModel.findById(userId);
      const post = await this.postModel.findById(id);
      updatePostDto.author = userId
      await post.updateOne(updatePostDto).populate('author');
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
      const res = await post.delete();
      return res;
    }
    catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }
  async findFriendsPosts(userId: string) {
    const user = await this.userModel.findById(userId);
    const posts = await this.postModel.find({author:{$in: user.friends}})
    .sort({date:"desc"})
    .populate('author')
    return posts;
  }
}
