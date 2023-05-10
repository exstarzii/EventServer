import {  IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsOptional()
    author: string;
    @IsNotEmpty()
    text: string;
    @IsOptional()
    image: string;
    @IsOptional()
    date: number;
}

export class UpdatePostDto {
    @IsNotEmpty()
    text: string;
    @IsOptional()
    image: string;
    @IsOptional()
    author: string;
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
