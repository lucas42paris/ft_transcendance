import { Channel } from "../../scenes/Chat/MainPage/MainPage";

export interface UserInfos
{
	id: number;
	name: string;
	friends: [];
	wins: number;
	losses: number;
	ladder_level: number;
	connected: boolean;
	playing: boolean;
	tfa: boolean;
	tfa_key: string;
	status: string;
	avatar_url: string;
	exp: number;
	ladders: number[];
	wons: boolean[];
	gameDates: string[];
}

export {};
