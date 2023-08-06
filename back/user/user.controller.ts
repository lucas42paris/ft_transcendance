import { Body, Controller, Get, Patch, UseGuards, Param, Delete, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto, QrcodeVerifyDto } from './dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from './middleware/multer.config';
import * as speakeasy from 'speakeasy';

var QRCode = require('qrcode');

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

	constructor(private userService: UserService) {}

	// localhost:3000/users
	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get()
	findOne(@Body() name: string) {
		return this.userService.findOneByName(name);
	}

	// localhost:3000/users/me
	@Get('me')
	getMe(@GetUser() user: User) {
		return (user);
	}
	
	// localhost:3000/users/name/:name
	@Get("name/:name")
	findOneByName(@Param("name") name: string) {
		return this.userService.findOneByName(name);
	}

	// localhost:3000/users/:id
	@Get(":id")
	findOneById(@Param("id") id: string) {
		return this.userService.findOneById(id);
	}

	@Patch()
	editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
		return (this.userService.editUser(userId, dto));
	}

	@Delete(":id")
	deleteUserById(@Param("id") id: string) {
		return this.userService.deleteUserById(id);
	}

	@Delete("me/me")
	deleteMe(@GetUser() user: User) {
		return this.userService.deleteMe(user.name);
	}

	@Post('avatar')
	@UseInterceptors(FileInterceptor('file', MulterConfig))
	uploadAvatar(@UploadedFile() file: any) {
		return (file);
	}

	@Post('qrcode')
	async qrcode(@Body() name: any) {
		const key = await this.userService.qrcode(name.name);
		return (key);
	}

	@Post('qrcode/verify')
	async verifyCode(@Body() elements: QrcodeVerifyDto) {
		const key = await this.userService.qrcode(elements.name);
		return (speakeasy.totp.verify({
			secret: key,
			encoding: 'base32',
			token: elements.otp,
		}));
	}
}
