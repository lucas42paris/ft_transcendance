import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma_module/prisma.service';
// import { MatchHistory } from '@prisma/client';
import { CreateMatchDto } from './dto';
import { User } from '@prisma/client';


@Injectable()
export class MatchHistoryService {

	constructor(private prisma: PrismaService) {}

	async create(dto: CreateMatchDto, user: User) {
		const existingData = await this.prisma.user.findUniqueOrThrow({
			where: { id: user.id },
			select: { gameDates: true, ladders: true, wons: true },
		});
		const updatedData = {
			gameDates: [...existingData.gameDates, dto.gameDate],
			ladders: [...existingData.ladders, dto.ladder],
			wons: [...existingData.wons, dto.won],
		};
		await this.prisma.user.update({
			where: { id: user.id },
			data: updatedData,
		});
	}
}
