import { GameState, Tile, TilesLayer } from "./game-state";

export class Renderer {
    ctx: CanvasRenderingContext2D;
    tileSize = 1;

    constructor(
        public canvas: HTMLCanvasElement) {
            this.ctx = this.canvas.getContext('2d');
        }

    render(gameState: GameState) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const layer of gameState.layers.values()) {
            this.drawTilesLayer(layer);
        }
    }

    drawTilesLayer(tilesLayer: TilesLayer) {
        for (const tile of tilesLayer.tilesList) {
            this.drawTile(tile);
        }
    }

    drawTile(tile: Tile) {
        const x = tile.x * this.tileSize;
        const y = tile.y * this.tileSize;
        const w = tile.width * this.tileSize;
        const h = tile.height * this.tileSize;
        this.ctx.fillStyle = tile.color;
        this.ctx.fillRect(x, y, w, h);
    }
}