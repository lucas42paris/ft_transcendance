import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import io from "socket.io-client";

const sketch: Sketch = p5 => {

    let p: Player;
    let master = false;
    let gameOn = false;
    let gameEnded = false;
    let opponentPoints = 0;
    let players: any[] = [];
    let spectator: number[] = [];
    let counter = 0;
    let b: Ball;
    let socket: any;
    let playerSize = 20;
    let playerSpeed = 6;
    let ballSize = 15;
    let ballSpeed = 5; // 3 ou 5
    let pointsToWinProps = 5;  // variable à envoyer
    let pointsToWin = pointsToWinProps - 1;
    let paused = 1;
    let drawLoops = 0;
    let background: any;
    let won: Boolean;
    let newMap: string | null = "classic";
    newMap = localStorage.getItem("map");
    
class Player {
    x: number;
    y: number;
    v: number;
    w: number;
    h: number;
    p: number;

    constructor(x:number) {
        this.x = x;
        this.y = p5.height / 2;
        this.v = playerSpeed;
        this.w = playerSize;
        this.h = 80;
        this.p = 0;
    }
    
    show = (): void => {
        p5.rectMode(p5.CENTER);
        p5.rect(this.x, this.y, this.w, this.h);
    }

    move = (): void => {
        if (p5.keyIsPressed) {
            if (p5.keyCode === p5.UP_ARROW && this.y !== 0)
                this.y -= this.v;
            else if (p5.keyCode === p5.DOWN_ARROW && this.y !== p5.height)
                this.y += this.v;
        }
    }
}

class Ball {
    x: number; 
    y: number; 
    r: number;
    xv: number;  
    yv: number; 

    constructor() {
        this.x = p5.width / 2;
        this.y = p5.height / 2;
        this.r = p5.floor(p5.random(2));
        this.xv = (this.r === 0)? -ballSpeed : ballSpeed;
        this.yv = ballSpeed;
    }

    show(): void {
        p5.ellipse(this.x, this.y, ballSize, ballSize);
    }

    move(): void {
        if(this.y < 1)
            this.yv = ballSpeed;
        if(this.y >= p5.height)
            this.yv = -ballSpeed;
        this.y += this.yv;
        this.x += this.xv;
    }

    collision(p: Player) {
        let d = p5.dist(this.x, this.y, p.x, p.y);
        if (d < ballSize + playerSize) {
            if(this.y - p.y < 0)
                this.yv = ballSpeed;
            else if(this.y - p.y === 0)
                this.yv = 0;
            else
                this.yv = -ballSpeed;
            return (true);
        }
        else
            return (false);
    }
}

    p5.setup = () => {

        socket = io('http://localhost:8080/pong');
        socket.on('connect', () => console.log("connected"));
        if (newMap === "terrifying")
            background = p5.loadImage('https://happycoding.io/images/stanley-1.jpg');
        p5.frameRate(85);
        p5.createCanvas(750, 600);
        p5.noCursor();
        b = new Ball();

        socket.on('getCounter', function(data: number) {
            // socket.on('getCounter', async function(data: number) {
            counter = data;
            if(p === undefined) {
                if (counter === 1) {
                    p = new Player(0);
                    master = true;
                } else if (counter === 2){
                    p = new Player(p5.width);
                    master = false;
                }
            }
            if (p !== undefined) {
                let infosPlayer = {
                    x: p.x,
                    y: p.y,
                    v: p.v,
                    w: p.w,
                    h: p.h,
                };
                socket.emit('start', infosPlayer);
                let infosBall = {
                    x: b.x,
                    y: b.y,
                    xv: b.xv,
                    yv: b.yv,
                    r: b.r
                };
                socket.emit('startBall', infosBall);
            }
            if (counter >= 2)
                gameOn = true;
        });
        socket.on('heartBeat', function(data: any[]) {
            players = data;
        });
        socket.on('heartBeatBall', function(data: any) {
            if (data !== null) {
                b.x = data.x;
                b.y = data.y;
                b.xv = data.xv;
                b.yv = data.yv;
                b.r = data.r;
            }
        });

        socket.on('heartBeatScore', function(data: any){
            if (data !== null && p !== undefined) {
                if (master === true) {
                    p.p = data[0];
                    opponentPoints = data[1];
                } else {
                    p.p = data[1];
                    opponentPoints = data[0];
                }
            }
            spectator[0] = data[0];
            spectator[1] = data[1];
        });
    }

    p5.draw = () => {
        p5.background(0, 0, 0);
        p5.textFont('Courier New');
        p5.fill(0, 102, 153);
        if(gameOn === false) {
            p5.textSize(48);
            p5.text("0", 25, 50);
            p5.text("0", 710, 50);
            p5.textAlign(p5.CENTER); 
            p5.textSize(40); 
            p5.text("Waiting for your opponent...", p5.width/2, p5.height/2); 
        }
        checkScores();
        if (gameEnded === true) {
            p5.noLoop();
            showWinner();
        }
        if(gameOn === true && p !== undefined) {
            p5.textSize(48);
            if (newMap === "terrifying")
                p5.background(background);
            else
                p5.rect(p5.width / 2, 0, 5, 1200);
            if (master === true) {
                p5.text(p.p, 20, 40);
                p5.text(opponentPoints, 710, 50);
            } else {
                p5.text(p.p, 710, 40);
                p5.text(opponentPoints, 20, 50);
            }
            p.show();
            p.move();
            b.show();
            b.move();
            if (players.length === 2 && p !== undefined) {
                let i = master === true  ? 1 : 0;
                p5.fill(255, 0, 0);
                p5.rectMode(p5.CENTER);
                p5.rect(players[i].x, players[i].y, players[i].w, players[i].h);
            }
            if (b.collision(p) && p.x === 0)
                b.xv = ballSpeed;
            if (b.collision(p) && p.x === p5.width)
                b.xv = -ballSpeed;
            if (b.x === 0) {
                p5.noLoop();
                if (master === false) {
                    socket.emit('updateScoreSlave', p.p);
                }
                    // p.p++;
                throwBall();
            } else if (b.x === p5.width) {
                p5.noLoop();
                if (master === true) {
                    socket.emit('updateScoreMaster', p.p);
                }
                    // p.p++;
                throwBall();
            }
            if (drawLoops < 50)
                drawLoops++;
            checkPlayers();
            pauseGame();
            let updateInfoPlayer = {
                x: p.x,
                y: p.y,
                v: p.v,
                w: p.w,
                h: p.h,
                p: p.p
            };
            socket.emit('update', updateInfoPlayer);
            let updateInfoBall = {
                x: b.x,
                y: b.y,
                xv: b.xv,
                yv: b.yv,
                r: b.r
            };
            socket.emit('updateBall', updateInfoBall);
        } 
        else if (gameOn === true && p === undefined)
            drawSpectator();
    };

    function checkScores() {
        if (p !== undefined && (p.p >= pointsToWinProps || opponentPoints >= pointsToWinProps)) {
            gameOn = false;
            gameEnded = true;
        }
    }

    function throwBall() {
        // if (p.p >= pointsToWin || opponentPoints >= pointsToWin ) {
        // if (p.p >= pointsToWinProps || opponentPoints >= pointsToWinProps ) {
        //     gameOn = false;
        //     gameEnded = true;
        // }
        p5.loop();
        b.x = p5.width / 2;
        b.y = p5.height / 2;
    }

    function showWinner() {
        p5.background(0);
        p5.textFont('Courier New');
        p5.textAlign(p5.CENTER); 
        p5.textSize(80);
        p5.fill(0, 102, 153);
        if (p !== undefined && p.p >= pointsToWinProps) {
            p5.textFont('Courier New');
            p5.text("You WON!", p5.width/2, p5.height/2); 
            p5.textSize(30);
            p5.text("reloading the page...", p5.width/2, p5.height/2 + 100); 
        } else if (p !== undefined && opponentPoints >= pointsToWinProps) {
            p5.textFont('Courier New');
            p5.text("You LOST...", p5.width/2, p5.height/2);
            p5.textSize(30);
            p5.text("reloading the page...", p5.width/2, p5.height/2 + 100);
        } else if (p === undefined ) {
            p5.textFont('Courier New');
            p5.text("Match is over!", p5.width/2, p5.height/2);
            p5.textSize(30);
            p5.text("reloading the page...", p5.width/2, p5.height/2 + 100);
        }
        if (p !== undefined && p.p === pointsToWinProps)
            won = true;
        else
            won = false;
        socket.on('disconnect', () => console.log("disconnection front"));
        if (p !== undefined)
            setTimeout(() => {  window.location.href = '/record?won=' + won; }, 3000);
        else    
           setTimeout(() => {  window.location.href = '/pong'; }, 3000);
    }

    function drawSpectator() {
        if (newMap === "terrifying")
            p5.background(background);
        b.show();
        b.move();
        if (players.length === 2) {
            for (let i = 0; i < 2; i++) {
                p5.fill(255,0,0);
                p5.rectMode(p5.CENTER);
                p5.rect(players[i].x, players[i].y, players[i].w, players[i].h);
                if (i === 0) {
                    p5.text(spectator[i], 20, 40);
                }
                else if (i === 1)
                    p5.text(spectator[i], 710, 50);
            }
        } else if (spectator[0] >= pointsToWin || spectator[1] >= pointsToWin || players.length === 0)
            showWinner();
        // else if (players.length === 0)
        //     showWinner();
        
    }

    function pauseGame() {
        if (p5.keyIsPressed) {
            if (p5.keyCode === p5.LEFT_ARROW) {
                if (paused === 1) {
                    b.xv = 0;
                    b.yv = 0;
                    p.v = 0;
                } else {
                    b.xv = ballSpeed;   //doit reprendre a la vitesse d'avant, (ballspeed ou -ballspeed).
                    b.yv = ballSpeed;
                    p.v = playerSpeed;
                }
                paused *= -1;
            }
        }
    }

    function checkPlayers() {
        if (players.length < 2 && drawLoops === 50) {
            p5.noLoop();
            p5.background(0);
            p5.textFont('Courier New');
            p5.textAlign(p5.CENTER); 
            p5.textFont('Courier New');
            p5.text("Opponent left :(", p5.width/2, p5.height/2); 
            p5.textSize(30);
            p5.text("reloading the page...", p5.width/2, p5.height/2 + 100);
            socket.on('disconnect', () => console.log("disconnection front"));
            setTimeout(() => {  window.location.href = "/pongredirec"; }, 3000);
        }
    }

};

export function SketchComponent() {
    return <ReactP5Wrapper sketch={sketch} />;
}
