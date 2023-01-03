import { IsOptional } from "class-validator";

export class CreateRoomDto {
    members: string[];
    @IsOptional()
    name: string;
}

export class UpdateRoomDto{
    _id: string
    members: string[];
    @IsOptional()
    name: string;
}
