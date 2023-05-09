import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user/:userId/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Param('userId') userId: string,@Body() createPostDto: CreatePostDto) {
    return this.postService.create(userId,createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('userId') userId: string,@Param('id') id: string) {
    return this.postService.like(userId,id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  dislike(@Param('userId') userId: string,@Param('id') id: string) {
    return this.postService.dislike(userId,id);
  }

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.postService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Param('userId') userId: string,@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(userId,+id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  remove(@Param('userId') userId: string,@Param('id') id: string) {
    return this.postService.remove(userId,id);
  }
}
