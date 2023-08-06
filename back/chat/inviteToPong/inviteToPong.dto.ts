import { IsNotEmpty, IsNumber } from 'class-validator';

export class InviteToPongDto
{
	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	@IsNumber()
	invitedId: number;
}
