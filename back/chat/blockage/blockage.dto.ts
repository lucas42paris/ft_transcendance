import { IsNotEmpty, IsNumber} from 'class-validator';

export class BlockageDto
{
	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	@IsNumber()
	blockedId: number;
}