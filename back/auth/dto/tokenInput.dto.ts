import { IsNumber, IsString } from "class-validator";

export class TokenInputDto {

	@IsNumber()
	id: number;

	@IsString()
	name: string;

}
