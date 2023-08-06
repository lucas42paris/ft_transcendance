import { Controller, Patch, UseGuards, Get, Post, Body, Param } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MatchHistoryService } from './match-history.service';
import { CreateMatchDto } from './dto';


@UseGuards(JwtGuard) // ??? // A logged in user should not be able to freely modify history, so other type of guard to consider
@Controller('match-history')
export class MatchHistoryController {

	constructor(private historyService: MatchHistoryService) {}

	// @Get()
	// findAll() {
	// 	return this.historyService.findAll();
	// }

	// @Get("me")
	// findMyMatches(@GetUser() user: User) {
	// 	return this.historyService.findByUserId(user.id.toString());
	// }

	// @Get(":id")
	// findByUserId(@Param("id") id: string) {
	// 	return this.historyService.findByUserId(id);
	// }

	// @Get("name/:name")
	// findByUserName(@Param("name") name: string) {
	// 	return this.historyService.findByUserName(name);
	// }

	@Post()
	createMatch(@Body() dto: CreateMatchDto, @GetUser() user: User) {
		this.historyService.create(dto, user);
	}
}
