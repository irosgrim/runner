export class Pixel {
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    color = "black";
    scale = 2;
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    draw (context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width * this.scale, this.height * this.scale);
    }
}

export class Background {
    x = 0;
    speedX = 0;
    y = 0;
    groundAsset: HTMLImageElement;
    groundY = 0;
    constructor(game: Game) {
        this.groundY = game.groundY;
        this.groundAsset = game.assets.ground;
    }
    draw(context: CanvasRenderingContext2D) {
        const img = this.groundAsset;
        if (img) {
            // @ts-ignore
            context.drawImage(img, this.x, this.groundY - 16, img.width, img.height);
        }
    }
    update() {
        this.x -= this.speedX;
        if (this.x < -600) {
            this.x = 0;
            this.x -= this.speedX;
        }
    }
}

export class InputHandler {
    player: Player;
    constructor(game: Game) {
        this.player = game.player;
        window.addEventListener("keydown", e => {
            e.preventDefault();
            this.jump(e.key);
        });
    }
    jump(key: string) {
        if(key && key === " ") {
            this.player.jump = true;
        }
    }
}

export class ObstacleElement {
    obstacles: HTMLImageElement;
    x = 0;
    y = 0;
    height = 0;
    width = 0;
    type = "small";
    constructor (type: string, obstacles: HTMLImageElement) {
        this.type = type;
        this.obstacles = obstacles;
    }
    draw(context: CanvasRenderingContext2D) {
        switch (this.type) {
            case "small":
                this.width = 16;
                this.height = 32;
                // context.fillRect(this.x, this.y, this.width, this.height);
                context.drawImage(this.obstacles, this.x, this.y, this.width, this.height)
                break;
            case "medium":
                this.width = 16*1.5;
                this.height = 32*1.5;
                // context.fillRect(this.x, this.y, this.width, this.height);
                context.drawImage(this.obstacles, this.x, this.y, this.width, this.height)
                break;
            case "big":
                this.width = 16*1.8;
                this.height = 32*1.8;
                // context.fillRect(this.x, this.y, this.width, this.height);
                context.drawImage(this.obstacles, this.x, this.y, this.width, this.height)
                break;
        }

    }
    update() {}
}

function shuffleArray(array: ObstacleElement[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getMultipleRandom(arr: ObstacleElement[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

export class Obstacle {
    x = 0;
    y = 0;
    speedX = 0;
    width = 100;
    height = 100;
    groundY = 0;
    obstaclesAsset: HTMLImageElement;
    elements: ObstacleElement[];
    canvas: HTMLCanvasElement;
    
    constructor(game: Game) {
        this.x = game.canvas.width - 100;
        this.y = game.groundY - this.height;
        this.groundY = game.groundY;
        this.obstaclesAsset = game.assets.obstacles;
        this.canvas = game.canvas;
        this.elements = [ 
            new ObstacleElement("small", game.assets.obstacles), 
            new ObstacleElement("medium", game.assets.obstacles), 
            new ObstacleElement("big", game.assets.obstacles)
        ];
    }

    draw(context: CanvasRenderingContext2D) {
        for (const [index, el] of this.elements.entries()) {
            el.draw(context);
            el.x = this.x;
            el.y = this.groundY - el.height;
            const prevEl = this.elements[index - 1];
            if (prevEl) {
                el.x = prevEl.x + prevEl.width;
            }
        }
    }

    update() {
        this.x -= this.speedX;
        const totalWidth = this.elements.reduce((acc, curr) => acc += curr.width, 0);
        if (this.x < -totalWidth) {
            this.x = this.canvas.width + (Math.random() * 400);
            const els = [new ObstacleElement("small", this.obstaclesAsset), new ObstacleElement("medium", this.obstaclesAsset), new ObstacleElement("big", this.obstaclesAsset)];
            const randNr = Math.floor(Math.random() * (3 - 1 + 1) + 1);
            const randEls = getMultipleRandom(els, randNr);
            this.elements = shuffleArray(randEls);
        }
    }
}

export class Player {
    jump = false;
    onGround = true;
    x = 200;
    y = 0;
    dx = 0;
    dy = 0;
    height = 32;
    width = 16;
    limit = 100;
    isGrounded = true;
    jumpPower = 0.5;
    groundY = 0;
    playerImg: HTMLImageElement;
    frameX = 0;
    actions = {
        run: {
            endFrameX: 8,
            startFrameY: 3,
        },
        jump: {
            endFrameX: 6,
            startFrameY: 1,
        }
    }
    constructor(game: Game) {
        this.y = game.groundY - this.height;
        this.groundY = game.groundY;
        this.playerImg = game.assets.player;
    }
    draw(context: CanvasRenderingContext2D) {
        const w = 1200;
        const h = 913;
        const spriteW = w / 12;
        const spriteH = h / 10;
        context.fillStyle = "red";
        let action = this.actions.run;
        if (this.jump) {
            action = this.actions.jump;
        } else {
            action = this.actions.run;
        }
        context.drawImage(this.playerImg, spriteW * this.frameX, spriteH * action.startFrameY, spriteW, spriteW, this.x, this.y, 32, 32);
    }
    update(gameFrame: number) {
        let maxFrameX = 7; 
        if (this.jump) {
            maxFrameX = 5;
        }
        if (this.frameX > maxFrameX) {
            this.frameX = 0;
        }
        if(gameFrame % 6 === 0) {
            this.frameX += 1;
        }
        const gravity = 0.3;
        this.y += this.dy;
        this.y += gravity * this.jumpPower;
        this.dy += gravity * this.jumpPower;
        if (this.jump && this.isGrounded) {
            this.dy = -10 * this.jumpPower;
        };

        // Ground check
        if(this.y >= this.groundY - this.height) {
            this.y = this.groundY - this.height;
            this.isGrounded = true;
            this.jump = false;
        } else {
            this.isGrounded = false;
        }
    }
}

export class Game {
    rows = 130;
    columns = 300;
    canvas: HTMLCanvasElement;
    lastTime = 0;
    deltaTime = 0;
    blockSize = 2;
    player: Player;
    scale = 1;
    obstacle: Obstacle;
    groundY = 0;
    bg: Background;
    assets: {[key: string]: HTMLImageElement};
    speedX = 1.4;
    gameFrame = 1;
    constructor(canvasElement: HTMLCanvasElement, assets: {[key: string]: HTMLImageElement}) {
        this.canvas = canvasElement;
        this.scale = window.devicePixelRatio;
        this.assets = assets;
        this.canvas.width = 600;
        this.canvas.height = 300;
        this.setGroundY(32);
        this.player = new Player(this);
        this.obstacle = new Obstacle(this);
        this.bg = new Background(this);
    }

    setGroundY(height: number = 0) {
        this.groundY = this.canvas.height - height;
    }

    draw(context: CanvasRenderingContext2D) {
        this.bg.draw(context);
        this.bg.speedX = this.speedX;
        this.player.draw(context);
        this.obstacle.draw(context);
        this.obstacle.speedX = this.speedX;
    }
    update () {
        this.player.update(this.gameFrame);
        this.obstacle.update();
        this.bg.update();
    }
}