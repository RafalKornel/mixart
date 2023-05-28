import "./style.css";
import { CanvasRenderer } from "./CanvasRenderer.ts";
import { html } from "@arrow-js/core";
import { Animation } from "./Animation.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <div id="animation-select"></div>
    <canvas></canvas>
  </div>
`;

enum CatState {
  Idle1,
  Idle2,
  LickPaw,
  Scratch,
  Walk,
  Run,
  Sleep,
  Tap,
  Jump,
  Spine,
}

const CAT_STATE_KEYS = Object.values(CatState).filter((v) => isNaN(Number(v)));

const CAT_STATE_VALUES = Object.values(CatState).filter(
  (v) => !isNaN(Number(v))
);

const CAT_FRAMES_COUNT: Record<CatState, number> = {
  [CatState.Idle1]: 4,
  [CatState.Idle2]: 4,
  [CatState.LickPaw]: 4,
  [CatState.Scratch]: 4,
  [CatState.Walk]: 8,
  [CatState.Run]: 8,
  [CatState.Sleep]: 4,
  [CatState.Tap]: 6,
  [CatState.Jump]: 7,
  [CatState.Spine]: 8,
};

class Game extends CanvasRenderer {
  private _animation: Animation<CatState>;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this._animation = new Animation<CatState>({
      initialAnimation: CatState.Idle1,
      framesCount: CAT_FRAMES_COUNT,
      frameHeight: 32,
      frameWidth: 32,
      spritesheetURI: "/cat.png",
    });
  }

  changeCatState(animation: CatState) {
    this._animation.setAnimation(animation);
  }

  loop(): void {
    this._animation.increaseInternalCounter();

    if (this._animation.shouldAnimate()) {
      this._animation.nextFrame();
    }

    this.ctx.drawImage(
      this._animation.image,
      this._animation.offset.y,
      this._animation.offset.x,
      this._animation.frameDimension.y,
      this._animation.frameDimension.x,
      0, // pos x
      0, // pos y
      this._animation.frameDimension.y * 8,
      this._animation.frameDimension.x * 8
    );
  }
}

const game = new Game(document.querySelector<HTMLCanvasElement>("canvas")!);

game.start();

html`
  <select
    @change="${(e: any) => {
      const v = Number(e.target.value);

      if (!isNaN(v) && CAT_STATE_VALUES.includes(v)) {
        game.changeCatState(v);
      }
    }}"
  >
    ${CAT_STATE_KEYS.map(
      (key, value) =>
        html`<option value="${CAT_STATE_VALUES[value]}">${key}</option>`
    )}
  </select>
`(document.querySelector("#animation-select")!);
