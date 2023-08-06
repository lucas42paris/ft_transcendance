import { Injectable } from '@nestjs/common';

@Injectable()
export class PongService {

	constructor() {}

    static players: string[] = [];

    setSocket() {
        const express = require('express');
        const app2 = express();
		return ("hello socket");
	}
    
    addPlayer(add: string) {
        PongService.players.push(add);
        // console.log('players: ', PongService.players);
    }
    
    removePlayer(rem: string) {
        PongService.players = PongService.players.filter(e => e !== rem);
        // console.log('players: ', PongService.players);
    }

    getPlayers() {
        return (PongService.players);
    }

}
