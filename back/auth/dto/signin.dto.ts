import { IsNotEmpty, IsString } from "class-validator";

export class SigninDto {

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	password: string;
	
}
