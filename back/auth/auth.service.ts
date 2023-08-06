import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma_module/prisma.service";
import { AuthDto, SigninDto, TokenInputDto } from "./dto";
import * as argon from 'argon2';
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Response } from 'express';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {

	constructor(private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,) {}
	
	async signup(dto: AuthDto) {
		const hash = await argon.hash(dto.password);
		try {
			await this.prisma.user.create({
				data: {
					name: dto.name,
					hash,
					oauthId: "not42",
					tfa_key: speakeasy.generateSecret({ length: 10 }).base32,
				},
			});
			return (null);
		}
		catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				console.error("sign UP error: ", error);
				if (error.code === 'P2002')
					throw (new ForbiddenException('Credentials taken'));
			}
			throw (error);
		}
	}

	async signin(dto: SigninDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				name: dto.name,
			},
		});
		if (!user)
			throw (new ForbiddenException('Credentials incorrect'));
		const pwdMatches = await argon.verify(user.hash, dto.password);
		if (!pwdMatches)
			throw (new ForbiddenException('Credentials incorrect'));
		return (this.signToken(user.id, user.name));
	}

	async signToken(userId: number, name: string) {
		const token = await this.jwt.signAsync({
				sub: userId,
				name,
			}, {
				expiresIn: '90m',
				secret: this.config.get('JWT_SECRET'),
		});
		const user = await this.prisma.user.findUnique({
			where: {
				name: name,
			},
		});
		return ({ access_token: token, tfa: user.tfa });
	}

	async sign42Token(user: TokenInputDto) {
		const payload = {
			sub: user.id,
			name: user.name,
		};
		const secret = this.config.get('JWT_SECRET');
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '90m',
			secret: secret,
		});
		return ({
			access_token: token,
		});
	}

	async setTokenCookie(token: string, res: Response) {
		res.cookie('access_token', token, {
			httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() + (5 *  24 * 3600 * 1000)),
		});
	}

}
