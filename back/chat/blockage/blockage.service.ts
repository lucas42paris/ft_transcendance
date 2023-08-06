import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma_module/prisma.service";
import { User } from "@prisma/client";
import { BlockageDto } from "chat/blockage/blockage.dto";

@Injectable()
export class BlockageService
{
	constructor(private prisma: PrismaService) {}

	async blockUser(data: BlockageDto): Promise<User>
	{
		if (data.userId === data.blockedId) 
			throw new Error("User cannot block themselves");

		const blockExists = await this.prisma.userBlock.findFirst(
		{
			where:
			{
				OR:
				[
					{userId: data.userId, blockedId: data.blockedId},
					{userId: data.blockedId, blockedId: data.userId}
				]
			}
		});

		if (blockExists)
			throw new Error("Block cannot be created. One user has already blocked the other.");

		const user = await this.prisma.user.findUnique({ where: {id: data.userId}});
		const blockedUser = await this.prisma.user.findUnique({ where: {id: data.blockedId}});

		if (!user || !blockedUser) 
			throw new Error("One or both users do not exist");

		const existingBlock = await this.prisma.userBlock.findUnique(
		{
			where: {userId_blockedId: {userId: data.userId, blockedId: data.blockedId}},
		});

		if (existingBlock)
			throw new Error("User has already been blocked");

		const newBlock = await this.prisma.userBlock.create(
		{
			data:
			{
				userId: data.userId,
				blockedId: data.blockedId
			}
		});

		return (newBlock);
	}
}
