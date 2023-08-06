import { Injectable } from "@nestjs/common";
import { Channel, ChatType, ChanMessage, User, ChannelToUser, UserBlock} from "@prisma/client";
import { PrismaService } from "prisma_module/prisma.service";
import { ChannelMessageDto, CreateChannelDto } from "./channels.dto";
import * as argon from 'argon2';



@Injectable()
export class ChannelsService
{
    constructor(private prisma: PrismaService) {}

    async createChannel(createChannelDto: CreateChannelDto): Promise<Channel | string> {
        const { name, userId, ispassword, password } = createChannelDto;
        const existingChannel = await this.prisma.channel.findFirst({
            where: {
              name: name,
            },
          });
      
          if (existingChannel) {
            return `Le channel ${name} existe déjà.`;
          }
        
        const hash = await argon.hash(password);
        const newChannel = await this.prisma.channel.create({
            data: {
                name,
                ispassword,
                password: hash,
                owner: {
                    connect: {
                        id: userId,
                    }
                }
            },
        });
        console.log("service createchannel");
        return newChannel;
    }
    
    async setNewPassword(ChannelId: string, password: string) {   
        if (password === null) {
            await this.prisma.channel.update({
                where: {
                    id: Number(ChannelId),
                },
                data: {
                    ispassword: false,
                    password: null,
                },
            });
            return ;
        }
        
        const hash = await argon.hash(password);
        await this.prisma.channel.update({
            where: {
                id: Number(ChannelId),
            },
            data: {
                ispassword: true,
                password: hash,
            },
        });
    }

    async checkPassword(hashedPassword: string, password: string): Promise<boolean> {
        try {
            const correctPassword = await argon.verify(hashedPassword, password);
            return correctPassword;
        } catch (err) {
            console.error(err);
            return false;
        }
      }
      

    async AdminPrivilegeChannel(channelId: string, userId: number) {
        let channeltoUser = await this.prisma.channelToUser.findUnique({
            where: {
                userId_channelId: {
                userId: userId,
                channelId: Number(channelId),
                },
            },
        });
    
        if (channeltoUser) {
          // Si l'enregistrement existe, supprimez-le
          await this.prisma.channelToUser.update({
            where: {
              userId_channelId: {
                userId: userId,
                channelId: Number(channelId),
              },
            },
            data: {
                isAdmin: !channeltoUser.isAdmin,
            }
          });
        } else {
          // Si l'enregistrement n'existe pas, créez-le
         channeltoUser = await this.prisma.channelToUser.create({
            data: {
              userId: userId,
              channelId: Number(channelId),
              isAdmin: true,
            },
          });
        }
        return channeltoUser;
    }

    async MutedChannel(channelId: string, userId: number) {
        let channeltoUser = await this.prisma.channelToUser.findUnique({
            where: {
                userId_channelId: {
                userId: userId,
                channelId: Number(channelId),
                },
            },
        });
    
        if (channeltoUser) {
          // Si l'enregistrement existe, supprimez-le
          await this.prisma.channelToUser.update({
            where: {
              userId_channelId: {
                userId: userId,
                channelId: Number(channelId),
              },
            },
            data: {
                muted: !channeltoUser.muted,
            }
          });
        } else {
          // Si l'enregistrement n'existe pas, créez-le
         channeltoUser = await this.prisma.channelToUser.create({
            data: {
              userId: userId,
              channelId: Number(channelId),
              muted: true,
            },
          });
        }
        return channeltoUser;
    }

    async BannedChannel(channelId: string, userId: number) {
        let channeltoUser = await this.prisma.channelToUser.findUnique({
            where: {
                userId_channelId: {
                userId: userId,
                channelId: Number(channelId),
                },
            },
        });
    
        if (channeltoUser) {
          // Si l'enregistrement existe, supprimez-le
          await this.prisma.channelToUser.update({
            where: {
              userId_channelId: {
                userId: userId,
                channelId: Number(channelId),
              },
            },
            data: {
                banned: !channeltoUser.banned,
            }
          });
        } else {
          // Si l'enregistrement n'existe pas, créez-le
         channeltoUser = await this.prisma.channelToUser.create({
            data: {
                userId: userId,
                channelId: Number(channelId),
                banned: true,
            },
          });
        }
        return channeltoUser;
    }

    async addUserToChannel(channelId: string, userId: number, password: string){
        try {
            const channel = await this.prisma.channel.findUnique({
                where: { id: Number(channelId) },
                include: { users: true },
            });

            const userChannel = await this.prisma.channelToUser.findUnique({
                where: {
                    userId_channelId: {
                        userId: userId,
                        channelId: Number(channelId),
                    },
                },
            });

            if (userChannel && userChannel.banned) {
                return 'banned';
            }
            if (channel && channel.ispassword) {
                const correctPassword = await this.checkPassword(channel.password, password);
                if (correctPassword === false) {
                    throw new Error("Invalid password");
                  }
            }
            if (channel && channel.users.some(user => user.id === userId)) {
                return;
            }

            await this.prisma.channel.update({
                where: { id: Number(channelId) },
                data: {
                    users: {
                        connect: {
                            id: userId
                        }
                    },
                }
            });
        } catch(error) {
            console.log("Error while updating channel: ", error);
            throw error;
        }
    }


    async removeUserFromChannel(channelId: string, userId: number){
        try {
            const channel = await this.prisma.channel.findUnique({
                where: { id: Number(channelId) },
                include: { 
                    users: true,
                    admins: true,
                },
            });
    
            if (channel && !channel.users.some(user => user.id === userId)) {
                return;
            }
    
            await this.prisma.channel.update({
                where: { id: Number(channelId) },
                data: {
                    users: {
                        disconnect: {
                            id: userId,
                        }
                    },
                }
            });

            const channelToUserRecord = await this.prisma.channelToUser.findUnique({
                where: {
                    userId_channelId: {
                      userId: userId,
                      channelId: Number(channelId),
                    },
                  },
                });

            if (!channelToUserRecord)
                return;
            
            const deleted = await this.prisma.channelToUser.update({
                where: {
                    userId_channelId: {
                    userId: userId,
                    channelId: Number(channelId),
                    },
                },
                data: {
                    isAdmin: false,
                }
            });
            return deleted;
        } catch(error) {
            console.log("Error while updating channel: ", error);
            throw error;
        }
    }
    

    async getAllChannels(): Promise<Channel[]> {
        return this.prisma.channel.findMany();
    }

    async getRelationFromChannel(channelId: string): Promise<{userId: number; channelId: number; isAdmin: boolean; muted: boolean; banned: boolean }[]> {
        const channel = await this.prisma.channel.findUnique({
            where: { id: Number(channelId) },
            include: { 
                admins: {
                    select: {
                        userId: true,
                        channelId: true,
                        isAdmin: true,
                        muted: true,
                        banned: true,
                    },
                }
            },
        });
    
        if (!channel) {
            throw new Error(`Channel with id ${channelId} does not exist`);
        }
    
        return channel.admins as {userId: number; channelId: number; isAdmin: boolean; muted: boolean; banned: boolean }[];
    }
    
      
    async getUsersFromChannel(channelId: string): Promise<{id: number; name: string; administratedChannels: ChannelToUser[]; ownedChannels: Channel[];}[]> {
        const channel = await this.prisma.channel.findUnique({
            where: { id: Number(channelId) },
            include: { 
                users: {
                    select: {
                        id: true,
                        name: true,
                        administratedChannels: true,
                        ownedChannels: true,
                    }
                } 
            },
        });
    
        if (!channel) {
            throw new Error(`Channel with id ${channelId} does not exist`);
        }
    
        return channel.users as {id: number; name: string; administratedChannels: ChannelToUser[]; ownedChannels: Channel[]}[];
    }
    

    async getBlockedIds(userId: number): Promise<number[]> {
        const userBlocks: UserBlock[] = await this.prisma.userBlock.findMany({
          where: {
            OR: [
              {
                userId: userId,
              },
              {
                blockedId: userId,
              },
            ],
        },
        select: {
          userId: true,
          blockedId: true,
        },
        });
      
        const blockedIds: number[] = [];
      
        userBlocks.forEach((userBlock: UserBlock) => {
          if (userBlock.userId === Number(userId)) {
            blockedIds.push(userBlock.blockedId);
          } else {
            blockedIds.push(userBlock.userId);
          }
        });
      
        return blockedIds;
      }
      

    async create(data: ChannelMessageDto): Promise<ChanMessage | null> {
        console.log('Creating channel message with data:', data);
        try
        {

            const userChannel = await this.prisma.channelToUser.findUnique({
                where: {
                    userId_channelId: {
                        userId: data.senderId,
                        channelId: Number(data.channelId),
                    },
                },
            });



            if (userChannel && (userChannel.muted || userChannel.banned)) {
                return null;
            }

            const createdMessage = await this.prisma.chanMessage.create(
            {
                data:
                {
                    senderId: data.senderId,
                    channelId: data.channelId,
                    content: data.message,
                },
                include: { sender: true },
            });

            return (createdMessage);
        }
        catch (error)
        {
            console.error('Error while creating channel message:', error);
            throw error;
        }
    }

    async isBlocked(userId: number, blockedId: number): Promise<boolean> {
        const blockedUser = await this.prisma.userBlock.findFirst({
            where: {
                userId,
                blockedId,
            },
        });
        return !!blockedUser;
    }

    async getRoomMessages(channelId: string): Promise<ChanMessage[]> {
        try {    
            const messages = await this.prisma.chanMessage.findMany({
                where: { channelId: Number(channelId) },
                orderBy: { createdAt: 'asc' },
                include: { sender: true },
            });
            return messages;
        }
        catch (error)
        {
            console.error('Error while creating channel message:', error);
            throw error;
        }
    }
}
