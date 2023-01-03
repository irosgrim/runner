import { Game, InputHandler } from './game';
import './style.scss'
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");

const SIZE = 2;
const nHeight = SIZE * 225;
const nWidth = SIZE * 800;

const windowPercentage = 0.9;

let cHeight = nHeight;
let cWidth = nWidth;

function resize() {
  cWidth = window.innerWidth;
  cHeight = window.innerHeight;
  const nativeRatio = nWidth / nHeight;
  const browserWindowRatio = cWidth / cHeight;

  if (browserWindowRatio > nativeRatio) {
    cHeight = Math.floor(cHeight * windowPercentage);
    cWidth = Math.floor(cHeight * nativeRatio);
  } else {
    cWidth = Math.floor(cWidth * windowPercentage);
    cHeight = Math.floor(cWidth / nativeRatio);
  }

  context!.canvas.style.width = `${cWidth}px`;
  context!.canvas.style.height = `${cHeight}px`;
}

window.addEventListener('resize', () => {
  resize();
})

const ground = new Image();
ground.src = new URL('./imgs/ground.png', import.meta.url).href;
const obstacles = new Image();
obstacles.src = new URL('./imgs/obstacle.png', import.meta.url).href;
const player = new Image();
player.src = new URL('./imgs/player.png', import.meta.url).href;
// const obstcl = [];

obstacles.addEventListener("load", (e) => {
  e.stopImmediatePropagation

})

const loadGame = () => {
    context!.canvas.width = cWidth;
    context!.canvas.height = cHeight;
    resize();
    const game = new Game(canvas, {
      ground, 
      obstacles,
      player,
    });
    new InputHandler(game);

    const gameLoop = (timestamp = 0) => {
      context!.clearRect(0, 0, canvas.width, canvas.height);
      game.deltaTime = timestamp - game.lastTime;
      game.draw(context!);
      // step movement
      // if(game.timeToNextStep > game.stepInterval) {
        //     game.update();
        //     game.timeToNextStep = 0;
        // }
        
        game.update();
        window.requestAnimationFrame(gameLoop);
        game.lastTime = timestamp;
        game.gameFrame++;
        if(game.gameFrame > 100) {
          game.gameFrame = 1;
        }
    }

    gameLoop();
}

window.addEventListener("load", loadGame);
