import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { PongService } from './pong.service';
import { JwtGuard } from '../auth/guard';
import { PlayerDto } from './dto';

@UseGuards(JwtGuard)
@Controller('pong')
export class PongController {
    
	constructor(private pongService: PongService) {}
	
    @Get()
	setSocket() {
		return this.pongService.setSocket();
	}

	@Patch('addPlayer')
	addPlayer(@Body() add: PlayerDto) {
		return (this.pongService.addPlayer(add.name));
	}

	@Patch('removePlayer')
	removePlayer(@Body() rem: PlayerDto) {
		return (this.pongService.removePlayer(rem.name));
	}

	@Get('getPlayers')
	getPlayers() {
		return (this.pongService.getPlayers());
	}

}
