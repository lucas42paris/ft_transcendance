import { Injectable } from '@nestjs/common';
import { PrismaService } from "../../prisma_module/prisma.service"
import { DirectMessageDto } from './directMessage.dto';
import { DirectMessage } from '@prisma/client';

@Injectable()
export class DirectMessageService
{
	constructor(private prisma: PrismaService) {}

	async create(data: DirectMessageDto): Promise<DirectMessage>
	{
		const blockExists = await this.prisma.userBlock.findFirst(
		{
			where:
			{
				OR:
				[
					{userId: data.senderId, blockedId: data.receiverId},
					{userId: data.receiverId, blockedId: data.senderId}
				]
			}
		});

		if (blockExists)
			throw new Error("Message cannot be sent. One user has blocked the other.");
		
		const createdMessage = await this.prisma.directMessage.create(
		{
			data:
			{
				senderId: data.senderId,
				receiverId: data.receiverId,
				content: data.content,
			},
		});

		return (createdMessage);
	}

	async getConversation(senderId: number, receiverId: number): Promise<DirectMessage[]>
	{
		const messages = await this.prisma.directMessage.findMany(
		{
			where:
			{
				OR:
				[
					{ senderId: senderId, receiverId: receiverId },
					{ senderId: receiverId, receiverId: senderId }
				]
			},
			orderBy:
			{
				createdAt: 'asc',
			}
		});

		return (messages);
	}
}
