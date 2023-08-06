import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

export class BaseGateway
{
	protected userSocketMap = new Map<number, string>();

	@WebSocketServer()
	server: Server;

	afterInit(server: Server) {}

	handleConnection(client: Socket) {}

	handleDisconnect(client: Socket)
	{
		for (const [userId, socketId] of this.userSocketMap.entries())
		{
			if (socketId === client.id)
			{
				this.userSocketMap.delete(userId);
				break;
			}
		}
	}
	
	@SubscribeMessage('userConnected')
	async handleUserConnected(@MessageBody() userId: number,
							  @ConnectedSocket() client: Socket)
	{
		this.userSocketMap.set(userId, client.id);
	}
}
