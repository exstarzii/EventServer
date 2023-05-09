import {  IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsOptional()
    author: string;
    @IsNotEmpty()
    text: string;
    @IsOptional()
    image: string;
    @IsOptional()
    date: string;
}

export class UpdatePostDto {
    @IsNotEmpty()
    text: string;
    @IsOptional()
    image: string;
}

export class PostDto {
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    author: string;
    @IsNotEmpty()
    text: string;
    @IsOptional()
    image: string;
}
