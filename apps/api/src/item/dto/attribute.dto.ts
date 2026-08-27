import { IsNotEmpty, IsString } from 'class-validator';

export class AttributeDto {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsString()
  value!: string;
}
