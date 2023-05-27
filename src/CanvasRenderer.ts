type RenderEngineParams = {
  width?: number;
  height?: number;
};

export abstract class CanvasRenderer {
  protected ctx: CanvasRenderingContext2D;

  private raf: number | undefined;

  protected width: number;
  protected height: number;

  /** Main entry point to renderer - implement this in children classes, by
   * modifying buffer property.
   */
  abstract loop(): void;

  constructor(canvas: HTMLCanvasElement, options: RenderEngineParams = {}) {
    const { height = 640, width = 640 } = options;

    this.height = height;
    this.width = width;

    canvas.width = this.width;
    canvas.height = this.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Your browser doesn't support canvas");
    }

    this.ctx = ctx;
  }

  public start() {
    this.loopWrapper();
  }

  private loopWrapper() {
    this.clear();

    this.loop();

    this.raf = requestAnimationFrame(() => this.loopWrapper());
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
