import { GameState, Tile } from "./game-state";
import { Input } from "./input";
import { Vector2 } from "./math";
import { Physics } from "./physics";
import { Renderer } from "./renderer";
import { WorkerThread } from "./worker-thread";

export class GameManager {
    input = new Input();
    state = new GameState();
    physics = new Physics();
    renderer: Renderer;
    gameWidth = 800;
    gameHeight = 600;
    thread = new WorkerThread(this);
    tickInterval = 100;

    constructor() {
        //
    }

    init(canvas: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);
        this._tick();
        this.thread.initRequest(this.tickInterval);
        this._spawnEnemy();
        setInterval(() => {
            this._spawnEnemy();
        }, this.tickInterval);
    }

    _spawnEnemy() {
        const x = Math.floor(Math.random() * this.gameWidth);
        this.thread.createTileRequest('enemyTiles', x, Math.floor(Math.random()*20), 10, 10, 
            new Vector2(Math.random() * 10 * ((x > this.gameWidth/2) ? -1 : 1), 10));
    }

    registerInput() {
        const a = 10;
        this.thread.createTileRequest('userTiles',
            Math.floor(this.input.mouse.x / a) * a,
            Math.floor(this.input.mouse.y / a) * a,
            a, a, new Vector2(0, 0));
    }

    _tick() {
        this.renderer.render(this.state);
        for (const layer of this.state.layers.values()) {
            for (const tile of layer.tilesList) {
                if (tile.health <= 0) {
                    layer.destroyTile(tile);
                } else {
                    const sideBounds = (
                        tile.x < 0 ||
                        (tile.x + tile.width) > this.gameWidth
                    );
                    if (sideBounds) {
                        this.state.score.setPoints(1);
                        layer.destroyTile(tile);
                    } else {
                        const bottomBounds = (
                            tile.y + tile.height > this.gameHeight
                        );
                        if (bottomBounds) {
                            this.state.score.setPoints(-1);
                            layer.destroyTile(tile);
                        }
                    }
                }
            }
        }
        setTimeout(() => {
            this._tick();
        }, 100);
    }
}
