import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { ax } from "../../../services/axios/axios";

const sketch: Sketch = p5 => {

/******************** VARIABLES ******************/

    let p: Player;
    let a: AI;
    let b: Ball;
    let opponentPoints = 0;
    let playerSize = 20;
    let playerSpeed = 8;
    let ballSize = 15;
    let ballSpeed = 5;
    let pointsToWin = 3;
    let paused = 1;
	const token = localStorage.getItem("token");

/******************************** PLAYER ********************************/

class Player {
    x: number;
    y: number;
    v: number;
    w: number;
    h: number;
    p: number;

    constructor() {
        this.x = 0;
        this.y = p5.height/2;
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
            if (p5.keyCode === p5.UP_ARROW && this.y >= 0)
                this.y -= this.v;
            else if (p5.keyCode === p5.DOWN_ARROW && this.y <= p5.height)
                this.y += this.v;
          }
    }
}

/******************************** AI ************************************/

class AI {
    x: number;
    y: number;
    v: number;
    w: number;
    h: number;
    p: number;

    constructor() {
        this.x = p5.width;
        this.y = p5.height/2;
        this.v = 4;
        this.w = playerSize;
        this.h = 80;
        this.p = 0;
    }

    show = (): void => {
        p5.rectMode(p5.CENTER);
        p5.rect(this.x,this.y,this.w,this.h)
    }

    move = (): void => {
      if(b.x >= p5.width/2)
        if(b.y < this.y)
          this.y -= this.v;
        else if(b.y > this.y)
        this.y += this.v;
    }
}

/******************************** BALL ********************************/

class Ball {
    x: number; 
    y: number; 
    r: number;
    xv: number;  
    yv: number; 

    constructor() {
        this.x = p5.width/2;
        this.y = p5.height/2;
        this.r = p5.floor(p5.random(2));
        this.xv = (this.r === 0)?-ballSpeed:ballSpeed;
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
        if(d < ballSize + playerSize) {
            if(this.y - p.y < 0)
                this.yv = ballSpeed;
            else if(this.y - p.y === 0) {
                this.yv = 0;
            }
            else
                this.yv = -ballSpeed;
            return true;
        }
        else
            return false;
    }
}

/******************************** SKETCH ********************************/

    p5.setup = () => {
        p5.createCanvas(750,600);
        p5.noCursor();
        b = new Ball();
        p = new Player();
        a = new AI();  
    }

    p5.draw = () => {
        p5.background(0);
        p5.textFont('Courier New');
        p5.fill(0, 102, 153);
        p5.textSize(48);
        p5.rect(p5.width/2, 0, 5, 1200);
        p5.text(p.p, 20, 40);
        p5.text(opponentPoints, 710, 50);

        p.show();
        p.move();
        a.show();
        a.move();
        b.show();
        b.move();

        if (b.collision(p))
            b.xv = ballSpeed;
        if (b.collision(a))
            b.xv = -ballSpeed;
        if (b.x === 0) {
            opponentPoints++;
            throwBall();
        } else if (b.x === p5.width) {
            p.p++;
            throwBall();
        }
        pauseGame();
    };

/******************************** EXTERNAL FUNCTIONS ********************************/

    function throwBall() {
        if (p.p >= pointsToWin || opponentPoints >= pointsToWin) {
            p5.noLoop();
            showWinner();
        } else {
            b.x = p5.width/2;
            b.y = p5.height/2;
        }
    }

    async function showWinner() {
        p5.background(0);
        p5.textFont('Courier New');
        p5.textAlign(p5.CENTER); 
        p5.textSize(80);
        p5.fill(0, 102, 153);
        if (p.p >= pointsToWin) {
            p5.textFont('Courier New');
            p5.text("You WON!", p5.width/2, p5.height/2); 
            p5.textSize(30);
            p5.text("reloading the page...", p5.width/2, p5.height/2 + 100); 
        } else if (opponentPoints >= pointsToWin) {
            p5.textFont('Courier New');

            p5.text("You LOST...", p5.width/2, p5.height/2);
            p5.textSize(30);
            p5.text("reloading the page...", p5.width/2, p5.height/2 + 100);
        }
        try {
			await ax.patch('users',
				{ playing: false },
           		{ headers: { Authorization: `Bearer ${token}` } }
			);
		} catch {
			console.error('could not update playing status when quitting');
		}
        setTimeout(() => {  window.location.href = "/pong"; }, 3000);
    }

    function pauseGame() {
        if (p5.keyIsPressed) {
            if (p5.keyCode === p5.LEFT_ARROW) {
                if (paused === 1) {
                    b.xv = 0;
                    b.yv = 0;
                } else {
                    b.xv = ballSpeed;
                    b.yv = ballSpeed;
                }
                paused *= -1;
            }
        }
    }
};

export function SketchComponentSolo() {
  return <ReactP5Wrapper sketch={sketch} />;
}
