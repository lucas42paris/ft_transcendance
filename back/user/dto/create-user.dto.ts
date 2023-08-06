import { IsNotEmpty, IsString } from "class-validator";

export class Create42UserDto {

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	hash: string;

	@IsString()
	@IsNotEmpty()
	oauthId: string;	
}
