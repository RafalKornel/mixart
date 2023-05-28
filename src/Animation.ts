type AnimationParams<T extends number> = {
  initialAnimation: T;
  frameWidth: number;
  frameHeight: number;
  framesCount: Record<T, number>;
  spritesheetURI: string;
};

export class Animation<T extends number> {
  private _animation: T;
  private _currentFrame: number;
  private _animationFrameCounter: number;

  private _image: HTMLImageElement;

  private FRAME_HEIGHT: number;
  private FRAME_WIDTH: number;
  private FRAMES_COUNT: Record<T, number>;

  private framesPerAnimation = 6;

  constructor({
    initialAnimation,
    framesCount,
    frameHeight,
    frameWidth,
    spritesheetURI,
  }: AnimationParams<T>) {
    this._animation = initialAnimation;
    this._currentFrame = 0;

    this._animationFrameCounter = 0;

    this.FRAME_HEIGHT = frameHeight;
    this.FRAME_WIDTH = frameWidth;
    this.FRAMES_COUNT = framesCount;

    const image = new Image();
    image.src = spritesheetURI;
    image.crossOrigin = "true";

    this._image = image;
  }

  nextFrame() {
    this._currentFrame =
      (this._currentFrame + 1) % this.FRAMES_COUNT[this._animation];
  }

  setAnimation(a: T) {
    this._animation = a;
  }

  shouldAnimate() {
    return this._animationFrameCounter % this.framesPerAnimation === 0;
  }

  increaseInternalCounter() {
    this._animationFrameCounter += 1;
  }

  get image() {
    return this._image;
  }

  get offset() {
    return {
      x: this._animation * this.FRAME_HEIGHT,
      y: this._currentFrame * this.FRAME_WIDTH,
    };
  }

  get frameDimension() {
    return { x: this.FRAME_WIDTH, y: this.FRAME_HEIGHT };
  }
}
