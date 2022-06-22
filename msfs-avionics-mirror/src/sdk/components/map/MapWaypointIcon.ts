import { MapProjection } from './MapProjection';
import { MapWaypoint } from './MapWaypoint';

/**
 * An icon for a waypoint displayed on a map.
 */
export interface MapWaypointIcon<T extends MapWaypoint> {
  /** The waypoint associated with this icon. */
  readonly waypoint: T;

  /**
   * The render priority of this icon. Icons with higher priorities will be rendered on top of icons with lower
   * priorities.
   */
  readonly priority: number;

  /** 
   * Renders this icon to a canvas.
   * @param context The canvas 2D rendering context to which to render.
   * @param mapProjection The projection to use for rendering.
   */
  draw(context: CanvasRenderingContext2D, mapProjection: MapProjection): void;
}

/**
 * A blank waypoint icon.
 */
export class MapBlankWaypointIcon<T extends MapWaypoint> implements MapWaypointIcon<T> {
  /**
   * Constructor.
   * @param waypoint The waypoint associated with this icon.
   * @param priority The render priority of this icon. Icons with higher priorities should be rendered above those
   * with lower priorities.
   */
  constructor(public readonly waypoint: T, public readonly priority: number) {
  }

  /**
   * Does nothing.
   */
  public draw(): void {
    // noop
  }
}

/**
 * Initialization options for an AbstractMapWaypointIcon.
 */
export type AbstractMapWaypointIconOptions = {
  /**
   * The anchor point of the icon, expressed as `[x, y]` relative to its width and height. `[0, 0]` is the top-left
   * corner, and `[1, 1]` is the bottom-right corner.
   */
  anchor?: Float64Array,

  /** The offset of the icon from the projected position of its associated waypoint, in pixels. */
  offset?: Float64Array
}

/**
 * An abstract implementation of MapWaypointIcon which supports an arbitrary anchor point and offset.
 */
export abstract class AbstractMapWaypointIcon<T extends MapWaypoint> implements MapWaypointIcon<T> {
  protected static readonly tempVec2 = new Float64Array(2);

  /**
   * The anchor point of this icon, expressed relative to its width and height. [0, 0] is the top-left corner, and
   * [1, 1] is the bottom-right corner.
   */
  public readonly anchor = new Float64Array([0.5, 0.5]);

  /** The offset of this icon from the projected position of its associated waypoint, in pixels. */
  public readonly offset = new Float64Array(2);

  private readonly totalOffsetX: number;
  private readonly totalOffsetY: number;

  /**
   * Constructor.
   * @param waypoint The waypoint associated with this icon.
   * @param priority The render priority of this icon. Icons with higher priorities should be rendered above those
   * with lower priorities.
   * @param width The width at which this icon should be rendered, in pixels.
   * @param height The height at which this icon should be rendered, in pixels.
   * @param options Options with which to initialize this icon.
   */
  constructor(
    public readonly waypoint: T,
    public readonly priority: number,
    public readonly width: number,
    public readonly height: number,
    options?: AbstractMapWaypointIconOptions
  ) {
    options?.anchor && this.anchor.set(options.anchor);
    options?.offset && this.offset.set(options.offset);

    this.totalOffsetX = this.offset[0] - this.anchor[0] * this.width;
    this.totalOffsetY = this.offset[1] - this.anchor[1] * this.height;
  }

  /** @inheritdoc */
  public draw(context: CanvasRenderingContext2D, mapProjection: MapProjection): void {
    const projected = mapProjection.project(this.waypoint.location, MapWaypointImageIcon.tempVec2);
    const left = projected[0] + this.totalOffsetX;
    const top = projected[1] + this.totalOffsetY;
    this.drawIconAt(context, mapProjection, left, top);
  }

  /**
   * Draws the icon at the specified position.
   * @param context The canvas rendering context to use.
   * @param mapProjection The map projection to use.
   * @param left The x-coordinate of the left edge of the icon.
   * @param top The y-coordinate of the top edge of the icon.
   */
  protected abstract drawIconAt(context: CanvasRenderingContext2D, mapProjection: MapProjection, left: number, top: number): void;
}

/**
 * A waypoint icon with an image as the icon's graphic source.
 */
export class MapWaypointImageIcon<T extends MapWaypoint> extends AbstractMapWaypointIcon<T> {
  /**
   * Constructor.
   * @param waypoint The waypoint associated with this icon.
   * @param priority The render priority of this icon. Icons with higher priorities should be rendered above those
   * with lower priorities.
   * @param img This icon's image.
   * @param width The width at which this icon should be rendered, in pixels.
   * @param height The height at which this icon should be rendered, in pixels.
   * @param options Options with which to initialize this icon.
   */
  constructor(
    waypoint: T,
    priority: number,
    protected readonly img: HTMLImageElement,
    width: number,
    height: number,
    options?: AbstractMapWaypointIconOptions
  ) {
    super(waypoint, priority, width, height, options);
  }

  /** @inheritdoc */
  protected drawIconAt(context: CanvasRenderingContext2D, mapProjection: MapProjection, left: number, top: number): void {
    context.drawImage(this.img, left, top, this.width, this.height);
  }
}

/**
 * A waypoint icon with a sprite as the icon's graphic source.
 */
export class MapWaypointSpriteIcon<T extends MapWaypoint> extends AbstractMapWaypointIcon<T> {
  /**
   * Constructor.
   * @param waypoint The waypoint associated with this icon.
   * @param priority The render priority of this icon. Icons with higher priorities should be rendered above those
   * with lower priorities.
   * @param img This icon's sprite's image source.
   * @param frameWidth The frame width of the sprite, in pixels.
   * @param frameHeight The frame height of the sprite, in pixels.
   * @param width The width at which this icon should be rendered, in pixels.
   * @param height The height at which this icon should be rendered, in pixels.
   * @param options Options with which to initialize this icon.
   * @param spriteFrameHandler An optional handler to determine the sprite frame to draw.
   */
  constructor(
    waypoint: T,
    priority: number,
    protected readonly img: HTMLImageElement,
    protected readonly frameWidth: number,
    protected readonly frameHeight: number,
    width: number,
    height: number,
    options?: AbstractMapWaypointIconOptions,
    private spriteFrameHandler?: (mapProjection: MapProjection) => number
  ) {
    super(waypoint, priority, width, height, options);
  }

  /** @inheritdoc */
  protected drawIconAt(context: CanvasRenderingContext2D, mapProjection: MapProjection, left: number, top: number): void {
    const spriteIndex = this.getSpriteFrame(mapProjection);
    const rowCount = Math.floor(this.img.naturalHeight / this.frameHeight);
    const colCount = Math.floor(this.img.naturalWidth / this.frameWidth);
    const row = Math.min(rowCount - 1, Math.floor(spriteIndex / colCount));
    const col = Math.min(colCount - 1, spriteIndex % colCount);
    const spriteLeft = col * this.frameWidth;
    const spriteTop = row * this.frameHeight;

    context.drawImage(this.img, spriteLeft, spriteTop, this.frameWidth, this.frameHeight, left, top, this.width, this.height);
  }

  /**
   * Gets the sprite frame to render.
   * @param mapProjection The map projection to use.
   * @returns The sprite frame to render.
   */
  protected getSpriteFrame(mapProjection: MapProjection): number {
    if (this.spriteFrameHandler !== undefined) {
      return this.spriteFrameHandler(mapProjection);
    }

    return 0;
  }
}