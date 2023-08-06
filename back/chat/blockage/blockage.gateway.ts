import { ConnectedSocket, MessageBody,
		 SubscribeMessage, WebSocketGateway} from "@nestjs/websockets";
import { BaseGateway } from "chat/base.gateway";
import { PrismaService } from "prisma_module/prisma.service";
import { Socket } from "socket.io";
import { BlockageDto } from "./blockage.dto";
import { BlockageService } from "./blockage.service";

@WebSocketGateway({cors: {origin: "*"}})
export class BlockageGateway extends BaseGateway
{
	constructor(private blockageService: BlockageService, private prisma: PrismaService)
	{
		super();
	}

	@SubscribeMessage('blockUser')
	async handleBlockUser(@MessageBody() data: BlockageDto, @ConnectedSocket() client: Socket)
	{
		await this.blockageService.blockUser(data);
		client.emit('userBlocked', {userId: data.userId, blockedId: data.blockedId});
	}
}
