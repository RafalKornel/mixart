import "./style.css";
import { CanvasRenderer } from "./CanvasRenderer.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <canvas></canvas>
`;

class Game extends CanvasRenderer {
  loop(): void {
    this.ctx.rect(20, 30, 100, 100);
    this.ctx.fill();
  }
}

const game = new Game(document.querySelector<HTMLCanvasElement>("canvas")!);

game.start();
