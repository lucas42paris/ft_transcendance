import { IsString } from "class-validator";

export class UpdateAvatarDto {

	@IsString()
	url: string;

	@IsString()
	name: string;

}
