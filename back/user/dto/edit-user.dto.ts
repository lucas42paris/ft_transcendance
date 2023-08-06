import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class EditUserDto {

	@IsString()
	@IsOptional()
	name?: string;

	@IsArray()
	@IsOptional()
	friends?: string[];
	
	@IsNumber()
	@IsOptional()
	wins?: number;
	
	@IsNumber()
	@IsOptional()
	losses?: number;
	
	@IsNumber()
	@IsOptional()
	ladder_level?: number;

	@IsBoolean()
	@IsOptional()
	connected?: boolean;

	@IsBoolean()
	@IsOptional()
	tfa?: boolean;

	@IsNumber()
	@IsOptional()
	exp?: number;

	@IsNumber()
	@IsOptional()
	ladder?: number;

	@IsBoolean()
	@IsOptional()
	playing?: boolean;
	
}
