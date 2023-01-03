import { IsOptional } from "class-validator";

export class CreateMessageDto {
    text: string;
    @IsOptional()
    authorId: string;
    @IsOptional()
    roomId: string;
}

export class UpdateMessageDto{
    _id: string;
    text: string;
    @IsOptional()
    authorId: string;
    @IsOptional()
    roomId: string;
}
