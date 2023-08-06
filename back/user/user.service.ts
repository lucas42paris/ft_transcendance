import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma_module/prisma.service';
import { EditUserDto, Create42UserDto} from './dto';
import * as speakeasy from 'speakeasy';

@Injectable()
export class UserService {

	constructor(private prisma: PrismaService) {}

	findAll() {
		return this.prisma.user.findMany();
	}

	async findOneById(id: string)
	{
		if (!isNaN(Number(id)))
		{
			const idNumber = Number(id)

			return await this.prisma.user.findUniqueOrThrow(
			{
				where:
				{
					id: idNumber
				}
			})
		}

		else
			throw new Error(`Invalid ID value: ${id}`)
	}

	async findOneByName(name: string) {
		return (await this.prisma.user.findFirst({
			where: {
				name: name,
			}
		}));
	}

	async editUser(userId: number, dto: EditUserDto) {
		let user;
		if (dto.name != '') {
			user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					name: dto.name,
				},
			});
		}
		if (dto.connected !== undefined) {
			user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					connected: dto.connected,
				},
			});
		}
		if (dto.tfa !== undefined) {
			user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					tfa: dto.tfa,
				},
			});
		}
		if (dto.wins !== undefined) {
			user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					wins: dto.wins,
				},
			});
		}
		if (dto.losses !== undefined) {
			user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					losses: dto.losses,
				},
			});
		}
		if (dto.exp !== undefined) {
			user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					exp: Math.ceil(dto.exp),
				},
			});
		}
		if (dto.ladder !== undefined) {
			user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					ladder_level: dto.ladder,
				},
			});
		}
		if (dto.playing !== undefined) {
			user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					playing: dto.playing,
				},
			});
		}
		delete user.hash;
		return (user);
	}

	// uer deleteMany?
	async deleteUserById(id: string) {
		const deleteUser = await this.prisma.user.delete({
			where: {
				id: Number(id),
			},
			select: {	//devrait retourner le name du user supprimé, ne fonctionne pas
				name: true,
			}
		})
		const nbOfUsersAfterDelete = await this.prisma.user.count();
		return { deletedUsers: 1, nbUsers: Number(nbOfUsersAfterDelete) };
	}

	async deleteMe(name: string) {
		const deleteUser = await this.prisma.user.delete({
			where: {
				name: name,
			},
			select: {	//devrait retourner le name du user supprimé, ne fonctionne pas
				name: true,
			}
		})
		const nbOfUsersAfterDelete = await this.prisma.user.count();
		return { deletedUsers: 1, nbUsers: Number(nbOfUsersAfterDelete) };
	}

	async create42User(dto: Create42UserDto) {
		return (await this.prisma.user.create({
			data: {
				name: dto.name,
				oauthId: dto.oauthId,
				hash: dto.hash,
				tfa_key: speakeasy.generateSecret({ length: 10 }).base32,
			},
		}));
	}

	async find42User(id: string) {
		return (await this.prisma.user.findFirst({
			where: {
				oauthId: id,
			},
		}));
	}

	async qrcode(name: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				name: name,
			}
		});
		return (user.tfa_key);
	}
}