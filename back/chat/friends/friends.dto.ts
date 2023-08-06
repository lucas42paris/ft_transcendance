import { IsNotEmpty, IsNumber } from 'class-validator';

export class FriendsDto
{
	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	@IsNumber()
	friendId: number;
}
