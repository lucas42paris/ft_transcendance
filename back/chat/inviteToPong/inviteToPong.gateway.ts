import { ConnectedSocket, MessageBody, SubscribeMessage,
		 WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { InviteToPongService } from "./inviteToPong.service";
import { InviteToPongDto } from "./inviteToPong.dto";
import { PrismaService } from "prisma_module/prisma.service";
import { BaseGateway } from "chat/base.gateway";
import { writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';

@WebSocketGateway({cors: {origin: "*"}})
export class InviteToPongGateway extends BaseGateway
{
	constructor(private inviteToPongService: InviteToPongService, private prisma: PrismaService)
	{
		super();
	}

	@SubscribeMessage('sendPongInvitation')
	async handleSendInvitation(@MessageBody() data: InviteToPongDto, @ConnectedSocket() client: Socket)
	{
		const inviterName = (await this.prisma.user.findUnique({where: {id: data.userId},}))?.name;
		const newInvitation = await this.inviteToPongService.createInvitation(data);
		const invitedSocketId = this.userSocketMap.get(data.invitedId);

		if (invitedSocketId)
			this.server.to(invitedSocketId).emit('pongInvitationReceived', {...newInvitation, inviterName});
	}

	@SubscribeMessage('acceptPongInvitation')
	async handleAcceptInvitation(@MessageBody() data: InviteToPongDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			const updatedInvitation = await this.inviteToPongService.acceptInvitation(data.invitedId);
			const inviterSocketId = this.userSocketMap.get(updatedInvitation.userId);

			if (inviterSocketId)
				this.server.to(inviterSocketId).emit('pongInvitationAccepted', updatedInvitation.userId);
		}
		catch (error)
		{
			const logFilePath = join(__dirname, 'error.log');
			appendFileSync(logFilePath, `${new Date().toISOString()} - Error: ${error.message}\n`);
		}	
	}

	@SubscribeMessage('refusePongInvitation')
	async handleRefuseInvitation(@MessageBody() data: InviteToPongDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			const updatedInvitation = await this.inviteToPongService.refuseInvitation(data.invitedId);
		}
		catch (error)
		{
			const logFilePath = join(__dirname, 'error.log');
			appendFileSync(logFilePath, `${new Date().toISOString()} - Error: ${error.message}\n`);
		}
	}
}
