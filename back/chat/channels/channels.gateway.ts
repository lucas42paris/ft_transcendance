import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { BaseGateway } from "chat/base.gateway";
import { PrismaService } from "prisma_module/prisma.service";
import { ChannelsService } from "./channels.service";
import { Channel, ChatType, ChanMessage, ChannelToUser } from "@prisma/client";
import { Body } from "@nestjs/common";
import { CreateChannelDto, JoinRoomDto, ChannelMessageDto } from "./channels.dto";


@WebSocketGateway({cors: {origin: "*"}})
export class ChannelsGateway extends BaseGateway
{
	@WebSocketServer()
	server: Server;
	
	constructor(private prisma: PrismaService, private channelsService: ChannelsService) {
		super();
	}

	@SubscribeMessage('createChannel')
	async handleCreateChannel(@Body() createChannelDto: CreateChannelDto): Promise<WsResponse<Channel | string>> {
		const newChannel = await this.channelsService.createChannel(createChannelDto);
		return { event: 'channelCreated', data: newChannel };
	}

	@SubscribeMessage('setPassword')
	async handleSetPassword(@Body() data: {channelId: string, password: string}): Promise<WsResponse<Channel[]>> {
		const {channelId, password} = data;
		await this.channelsService.setNewPassword(channelId, password);
		const channels = await this.channelsService.getAllChannels();
        return { event: 'channels', data: channels };
	}

	@SubscribeMessage('getChannels')
    async handleGetChannels(@ConnectedSocket() client: Socket): Promise<WsResponse<Channel[]>> {
        const channels = await this.channelsService.getAllChannels();
        return { event: 'channels', data: channels };
    }
	
	@SubscribeMessage('getChannelUsers')
	async handleGetChannelUsers(@MessageBody() data: { channelId: string }, @ConnectedSocket() client: Socket): Promise<void> {
		const { channelId } = data;
		const users = await this.channelsService.getUsersFromChannel(data.channelId);
		this.server.to(channelId.toString()).emit('newUser', users);
	}
	
	@SubscribeMessage('getChannelToUser')
	async handleGetChannelToUser(@MessageBody() data: { channelId: string }, @ConnectedSocket() client: Socket) {
		const { channelId } = data;
		const ChannelToUser = await this.channelsService.getRelationFromChannel(data.channelId);
		this.server.to(channelId.toString()).emit('channelToUser', ChannelToUser);
	}

	@SubscribeMessage('handleAdmin')
	async handleAdmin(@MessageBody() data: { userId: string, channelId: string }, @ConnectedSocket() client: Socket) {
		const { channelId, userId } = data;
		const channelToUser = await this.channelsService.AdminPrivilegeChannel(channelId, parseInt(userId));
		this.server.to(channelId.toString()).emit('isAdmin', channelToUser);
	}

	@SubscribeMessage('handleMuted')
	async handleMuted(@MessageBody() data: { userId: string, channelId: string }, @ConnectedSocket() client: Socket) {
		const { channelId, userId } = data;
		const channelToUser = await this.channelsService.MutedChannel(channelId, parseInt(userId));
		this.server.to(channelId.toString()).emit('isMuted', channelToUser);
	}

	@SubscribeMessage('handleBanned')
	async handleBanned(@MessageBody() data: { userId: string, channelId: string }, @ConnectedSocket() client: Socket) {
		const { channelId, userId } = data;
		const channelToUser = await this.channelsService.BannedChannel(channelId, parseInt(userId));
		this.server.to(channelId.toString()).emit('isBanned', channelToUser);
	}

	@SubscribeMessage('joinRoom')
	async handleJoinRoom(@MessageBody() joinRoomDto: JoinRoomDto, @ConnectedSocket() client: Socket) {
		
		try {
			const { channelId, userId, password} = joinRoomDto;
			const banned = await this.channelsService.addUserToChannel(channelId, parseInt(userId), password);
			if (banned === 'banned') {
				client.emit('userBanned', {banned: true})
				return;
			}
			client.join(channelId.toString());
			client.emit('passwordChecked', { correct: true });

		}
		catch (error) {
				client.emit('passwordChecked', {correct: false})
		}
	}

	@SubscribeMessage('leaveRoom')
	async handleLeaveRoom(@MessageBody() joinRoomDto: JoinRoomDto, @ConnectedSocket() client: Socket) {
		try {
			const { channelId, userId } = joinRoomDto;
			const deleted = await this.channelsService.removeUserFromChannel(channelId, parseInt(userId));
			const socketId = this.userSocketMap.get(Number(userId));
			if (socketId) {
				const userSocket = this.server.sockets.sockets.get(socketId)
				if (userSocket) {
					userSocket.leave(channelId.toString());
					if (deleted) {
						this.server.to(socketId).emit('delete', deleted);
						this.server.to(channelId).emit('delete', deleted);
					}
					this.server.to(socketId).emit('userKicked', userId);
					this.server.to(channelId.toString()).emit('userKicked', userId); //supprimer userId de chanUser
				}
			}
		}
		catch (error) {
			console.error('Error while handling leave channel:', error);
			client.emit('error');
		}
	}


	@SubscribeMessage('exitRoom')
	async handleexitRoom(@ConnectedSocket() client: Socket) {
		try {
			for (let room of client.rooms) {
				if (room !== client.id)
					client.leave(room);
			}
		}
		catch (error) {
			console.error('Error while handling leave channel:', error);
			client.emit('error');
		}
	}

	@SubscribeMessage('channelMessage')
	async handleChannelMessage(@MessageBody() data: ChannelMessageDto,
							  @ConnectedSocket() client: Socket)
	{	
		try {
			const newMessage = await this.channelsService.create(data);	
			if (newMessage === null)
				return;

			const excludedUsers = await this.channelsService.getBlockedIds(data.senderId);
			console.log('les userid: ', excludedUsers);
			const excludedSockets = excludedUsers.map((excludedUser) => {
				return this.userSocketMap.get(excludedUser);
			})
			
			this.server.to(data.channelId.toString()).except(excludedSockets).emit('channelMessage', newMessage);
		}
		catch (error) {
			console.error('Error while handling channel message:', error);
			client.emit('error', {message: 'There was an error sending your message.',
								 error: error.message});
		}
	}

	@SubscribeMessage('getChannelConversation')
	async handleGetConversation(@MessageBody() roomDetails: { channelId: string }, @ConnectedSocket() client: Socket): Promise<WsResponse<ChanMessage[]>> {
		const messages = await this.channelsService.getRoomMessages(roomDetails.channelId);
		return { event: 'channelConversation', data: messages };
	}

}
