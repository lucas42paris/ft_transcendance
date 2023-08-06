import { IsNotEmpty, IsString } from "class-validator";

export class QrcodeVerifyDto {

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	otp: string;

}
