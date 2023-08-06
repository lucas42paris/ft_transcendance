import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateChannelDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;

    userId: number;

    @IsBoolean()
    ispassword: boolean = false;

    @IsString()
    password?: string;
}

export class JoinRoomDto {
    @IsNotEmpty()
    @IsString()
    channelId: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    password?: string;
}
  
export class ChannelMessageDto {
    senderId: number;
    channelId: number;

    @IsNotEmpty()
    @IsString()
    message: string;
}
