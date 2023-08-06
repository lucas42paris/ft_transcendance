import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateMatchDto {

	@IsNumber()
	ladder: number;

	@IsBoolean()
	won: boolean;

	@IsString()
	gameDate: string;

}
