import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
{
	private _chat: any;

	public get chat(): any
	{
		return this._chat;
	}

	public set chat(value: any)
	{
		this._chat = value;
	}

	private _userBlock: any;

	public get userBlock(): any
	{
		return this._userBlock;
	}

	public set userBlock(value: any)
	{
		this._userBlock = value;
	}

	private _userChat: any;

	public get userChat(): any
	{
		return this._userChat;
	}

	public set userChat(value: any)
	{
		this._userChat = value;
	}

	constructor(config: ConfigService)
	{
		super(
		{
			datasources:
			{
				db:
				{
					url: config.get('DATABASE_URL'),
				},
			},
		});
	}

	cleanDb()
	{
		return (this.$transaction(
		[
			// this.matchHistory.deleteMany(),
			this.user.deleteMany(),
		]));
	}
}
