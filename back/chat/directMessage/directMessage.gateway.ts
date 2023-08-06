import { ConnectedSocket, MessageBody, SubscribeMessage,
		 WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { DirectMessageService } from "./directMessage.service";
import { DirectMessageDto } from "./directMessage.dto";
import { PrismaService } from "prisma_module/prisma.service";
import { BaseGateway } from "chat/base.gateway";

@WebSocketGateway({cors: {origin: "*"}})
export class DirectMessageGateway extends BaseGateway
{
	constructor(private directMessageService: DirectMessageService, private prisma: PrismaService)
	{
		super();
	}

	@SubscribeMessage('privateMessage')
	async handlePrivateMessage(@MessageBody() data: DirectMessageDto, @ConnectedSocket() client: Socket)
	{
		const newMessage = await this.directMessageService.create(data);
		const receiverSocketId = this.userSocketMap.get(data.receiverId);

		if (receiverSocketId)
			this.server.to(receiverSocketId).emit('privateMessage', newMessage);

		this.server.to(data.receiverId.toString()).emit('privateMessage', newMessage);
		client.emit('privateMessage', newMessage);
	}

	@SubscribeMessage('getConversation')
	async handleGetConversation(@MessageBody() data: {senderId: number, receiverId: number}, @ConnectedSocket() client: Socket)
	{		
		const messages = await this.directMessageService.getConversation(data.senderId, data.receiverId);
		client.emit('conversation', messages);
	}
}
