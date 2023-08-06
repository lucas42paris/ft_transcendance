import { ConnectedSocket, MessageBody, SubscribeMessage,
		 WebSocketGateway } from "@nestjs/websockets";
import { PrismaService } from "prisma_module/prisma.service";
import { Socket } from "socket.io";
import { BaseGateway } from "chat/base.gateway";
import { FriendsService } from "./friends.service";
import { FriendsDto } from "./friends.dto";

@WebSocketGateway({cors: {origin: "*"}})
export class FriendsGateway extends BaseGateway
{
	constructor(private friendsService: FriendsService, private prisma: PrismaService)
	{
		super();
	}

	@SubscribeMessage('addFriend')
	async handleAddFriend(@MessageBody() data: FriendsDto, @ConnectedSocket() client: Socket)
	{
		const newFriend = await this.friendsService.addFriend(data);
		client.emit('friendAdded', newFriend);
	}

	@SubscribeMessage('getFriends')
	async handleGetFriends(@MessageBody() data: FriendsDto, @ConnectedSocket() client: Socket)
	{
		const friends = await this.friendsService.getFriends(data);
		client.emit('friends', friends);
	}
}
