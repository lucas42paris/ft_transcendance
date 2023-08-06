import { OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

let connections: number = 0;
let players = [];
let playersId:string[] = [];
let b;
let interval = 10;
let scores: number[] = [0, 0];

function Player(id, x, y, v, w, h, p) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.v = v;
    this.w = w;
    this.h = h;
}

function Ball(id, x, y, xv, yv, r) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
    this.r = r;
}

@WebSocketGateway({
    namespace: 'pong',
    cors: {
        origin: '*',
    },
})
export class SocketEvents implements OnGatewayInit {

    @WebSocketServer()
    server: Server;

    constructor() {}

    handleConnection(client: Socket) {
        connections++;
        this.getCounter();
        
        client.on("start", (data) => {
            if (players.length > 0 && players[players.length - 1].id === client.id) {
                return;
            }
            if (players.length < 2) {
                let p = new Player(client.id, data.x, data.y, data.v, data.w, data.h, data.p);
                players.push(p);
                playersId.push(client.id);
            } 
        });

        client.on("startBall", function(data) {
            b = new Ball(client.id, data.x, data.y, data.xv, data.yv, data.r);
        });

        client.on('update', function(data) {
            let pl;
            for (let i = 0; i < players.length; i++) {
                if (client.id === players[i].id)
                    pl = players[i];
            }
            if (pl !== undefined) {
                pl.x = data.x;
                pl.y = data.y;
                pl.v = data.v;
                pl.w = data.w;
                pl.h = data.h;
            }
        });

        client.on('updateBall', function(data) {
            b.x = data.x;
            b.y = data.y;
            b.xv = data.xv;
            b.yv = data.yv;
            b.r = data.r;
        })

        client.on('updateScoreMaster', function(data) {
            data++;
            scores[0] = data;
        })
        
        client.on('updateScoreSlave', function(data) {
            data++;
            scores[1] = data;
        })

    }

    getCounter() {
        this.server.emit('getCounter', connections);
    }

    heartBeat() {
        this.server.emit('heartBeat', players);
    }

    heartBeatBall() {
        this.server.emit('heartBeatBall', b); 
    }

    heartBeatScore() {
        this.server.emit('heartBeatScore', scores); 
    }

    startHeartbeat() {
        setInterval(() => {
          this.heartBeat();
        }, interval);
    }

    startBallHeartbeat() {
        setInterval(() => {
            this.heartBeatBall();
        }, interval);
    }

    startScoreHeartbeat() {
        setInterval(() => {
            this.heartBeatScore();
        }, interval);
    }

    afterInit() {
        this.startHeartbeat();
        this.startBallHeartbeat();
        this.startScoreHeartbeat();
    }

    handleDisconnect(client: Socket) {
        for (let i = 0; i < playersId.length; i++) {
            if (client.id === playersId[i]) {
                players = [];
                scores = [0, 0];
            }
        }
        connections--;
    }

}
