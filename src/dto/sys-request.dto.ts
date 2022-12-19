import { IsString, IsInt, IsNotEmpty } from 'class-validator';
export class SysRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsInt()
  designer_id: number;
}
